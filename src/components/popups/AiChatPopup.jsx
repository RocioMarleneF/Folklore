import React, { useState, useEffect, useRef, useCallback } from 'react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { X, Send, Bot, RefreshCw, Plus, MessageSquare, Trash2 } from 'lucide-react';
    import { useLanguage } from '@/contexts/LanguageContext';
    import { translations } from '@/lib/translations';
    import { Avatar, AvatarFallback } from '@/components/ui/avatar';
    import { supabase } from '@/lib/customSupabaseClient';
    import { useAuth } from '@/hooks/useAuth';

    const AiChatPopup = ({ isOpen, onClose }) => {
      const { language } = useLanguage();
      const t = translations[language] || translations.es;
      const { user } = useAuth();

      const [sessions, setSessions] = useState([]);
      const [currentSessionId, setCurrentSessionId] = useState(null);
      const [messages, setMessages] = useState([]);
      const [input, setInput] = useState('');
      const [isThinking, setIsThinking] = useState(false);
      const messagesEndRef = useRef(null);

      const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      };

      useEffect(scrollToBottom, [messages, isThinking]);

      const fetchSessions = useCallback(async () => {
        if (!user) return;
        const { data, error } = await supabase
          .from('chat_sessions')
          .select('id, title')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching sessions:', error);
        } else {
          setSessions(data);
          if (data.length > 0 && !currentSessionId) {
            setCurrentSessionId(data[0].id);
          } else if (data.length === 0) {
            createNewSession();
          }
        }
      }, [user, currentSessionId]);

      const fetchMessages = useCallback(async () => {
        if (!currentSessionId) {
          setMessages([]);
          return;
        };
        
        const { data, error } = await supabase
          .from('chat_messages')
          .select('id, sender, content')
          .eq('session_id', currentSessionId)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching messages:', error);
          setMessages([]);
        } else {
          if (data.length === 0) {
             const initialMessage = { sender: 'bot', content: "¡Hola! Soy Folky, tu guía literario en Folklore 📚✨. ¿Sobre qué quieres saber?" };
             setMessages([initialMessage]);
          } else {
            setMessages(data);
          }
        }
      }, [currentSessionId]);

      useEffect(() => {
        if (isOpen && user) {
          fetchSessions();
        } else {
          setSessions([]);
          setCurrentSessionId(null);
        }
      }, [isOpen, user, fetchSessions]);

      useEffect(() => {
        fetchMessages();
      }, [currentSessionId, fetchMessages]);

      const createNewSession = async () => {
        if (!user) return;
        const { data, error } = await supabase
          .from('chat_sessions')
          .insert({ user_id: user.id, title: 'Nuevo Chat' })
          .select('id, title')
          .single();

        if (error) {
          console.error('Error creating new session:', error);
        } else {
          setSessions(prev => [data, ...prev]);
          setCurrentSessionId(data.id);
        }
      };

      const deleteSession = async (sessionIdToDelete) => {
        const { error } = await supabase
          .from('chat_sessions')
          .delete()
          .eq('id', sessionIdToDelete);

        if (error) {
          console.error('Error deleting session:', error);
        } else {
          setSessions(prev => prev.filter(s => s.id !== sessionIdToDelete));
          if (currentSessionId === sessionIdToDelete) {
            const remainingSessions = sessions.filter(s => s.id !== sessionIdToDelete);
            if (remainingSessions.length > 0) {
              setCurrentSessionId(remainingSessions[0].id);
            } else {
              createNewSession();
            }
          }
        }
      };

      const handleSend = async () => {
        if (input.trim() && !isThinking && currentSessionId) {
          const userMessage = { sender: 'user', content: input };
          const newMessages = [...messages, userMessage];
          setMessages(newMessages);
          setInput('');
          setIsThinking(true);

          // Save user message
          await supabase.from('chat_messages').insert({ session_id: currentSessionId, ...userMessage });
          
          // If it's the first user message, update session title
          if (messages.filter(m => m.sender === 'user').length === 0) {
            const newTitle = input.substring(0, 25) + (input.length > 25 ? '...' : '');
            await supabase.from('chat_sessions').update({ title: newTitle }).eq('id', currentSessionId);
            setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, title: newTitle } : s));
          }

          const conversationHistory = newMessages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
          }));
          
          const systemInstruction = {
            role: "user",
            parts: [{ text: "Eres Folky, un asistente amigable, útil y creativo para un sitio web de escritura llamado Folklore. Responde de manera concisa y amigable." }],
          };
          const modelResponseForSystemInstruction = {
            role: "model",
            parts: [{ text: "¡Entendido! Soy Folky, tu guía literario en Folklore 📚✨. Estoy listo para ayudar." }],
          };

          const historyForApi = [
            systemInstruction,
            modelResponseForSystemInstruction,
            ...conversationHistory.filter(m => m.parts[0].text !== "¡Hola! Soy Folky, tu guía literario en Folklore 📚✨. ¿Sobre qué quieres saber?")
          ];

          try {
            const { data, error } = await supabase.functions.invoke('gemini-chat', {
              body: JSON.stringify({ history: historyForApi }),
            });

            if (error) throw error;

            const botResponse = { sender: 'bot', content: data.reply };
            await supabase.from('chat_messages').insert({ session_id: currentSessionId, ...botResponse });
            setMessages(prev => [...prev, botResponse]);

          } catch (error) {
            console.error('Error calling Gemini Edge Function:', error);
            const errorMessage = { sender: 'bot', content: "Lo siento, algo salió mal. Intenta de nuevo más tarde." };
            setMessages(prev => [...prev, errorMessage]);
          } finally {
            setIsThinking(false);
          }
        }
      };

      const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
      };

      return (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="fixed bottom-24 right-6 w-[32rem] h-[30rem] bg-background rounded-2xl shadow-2xl flex z-[100] overflow-hidden border"
            >
              {/* Sessions Sidebar */}
              <div className="w-1/3 bg-secondary/50 border-r flex flex-col">
                <div className="p-2 flex justify-between items-center border-b">
                  <h4 className="font-semibold text-sm">Chats</h4>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={createNewSession}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  {sessions.map(session => (
                    <div
                      key={session.id}
                      onClick={() => setCurrentSessionId(session.id)}
                      className={`group w-full text-left p-2 rounded-md text-sm cursor-pointer flex justify-between items-center ${currentSessionId === session.id ? 'bg-primary/20' : 'hover:bg-primary/10'}`}
                    >
                      <span className="truncate flex-1">{session.title}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100"
                        onClick={(e) => { e.stopPropagation(); deleteSession(session.id); }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Chat Window */}
              <div className="w-2/3 flex flex-col">
                <header className="bg-[#0e345a] text-white p-3 flex justify-between items-center flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5" />
                    <h3 className="font-semibold text-base">Folky</h3>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-white hover:bg-white/20" onClick={onClose}>
                    <X className="w-4 h-4" />
                  </Button>
                </header>
                
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.sender === 'bot' && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-[#0e345a] text-white"><Bot size={20} /></AvatarFallback>
                        </Avatar>
                      )}
                      <div className={`max-w-xs rounded-2xl px-4 py-2 ${msg.sender === 'user' ? 'bg-[#0e345a] text-white rounded-br-none' : 'bg-secondary text-secondary-foreground rounded-bl-none'}`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isThinking && (
                    <div className="flex items-end gap-2 justify-start">
                      <Avatar className="h-8 w-8"><AvatarFallback className="bg-[#0e345a] text-white"><Bot size={20} /></AvatarFallback></Avatar>
                      <div className="max-w-xs rounded-2xl px-4 py-2 bg-secondary text-secondary-foreground rounded-bl-none">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">Folky está pensando...</span>
                          <div className="flex space-x-1">
                            <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }} className="w-1.5 h-1.5 bg-current rounded-full" />
                            <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, delay: 0.1, repeat: Infinity, ease: "easeInOut" }} className="w-1.5 h-1.5 bg-current rounded-full" />
                            <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, delay: 0.2, repeat: Infinity, ease: "easeInOut" }} className="w-1.5 h-1.5 bg-current rounded-full" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-3 border-t border-border flex items-center">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t.aiChatPlaceholder}
                    className="flex-1 mr-2 rounded-full"
                    disabled={isThinking}
                  />
                  <Button size="icon" className="bg-[#0e345a] hover:bg-[#0e345a]/90 rounded-full" onClick={handleSend} disabled={isThinking || !input.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      );
    };

    export default AiChatPopup;
