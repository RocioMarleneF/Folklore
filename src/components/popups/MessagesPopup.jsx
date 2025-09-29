import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Send, Mail, ArrowLeft } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { translations } from '@/lib/translations';
import { useLanguage } from '@/contexts/LanguageContext';

const dummyChats = [
  { id: 1, name: 'Elena Vazquez', lastMessage: '¡Hola! Me encantó tu última historia.', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, name: 'Carlos Mendoza', lastMessage: '¿Podemos colaborar en un nuevo capítulo?', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: 3, name: 'Ana Torres', lastMessage: 'Gracias por los comentarios. ¡Significan mucho!', avatar: 'https://i.pravatar.cc/150?img=3' },
];

const MessagesPopup = ({ isOpen, onClose, startChatWith }) => {
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = translations[language];

  React.useEffect(() => {
    if (startChatWith) {
      const chat = dummyChats.find(c => c.name.toLowerCase().includes(startChatWith.toLowerCase())) || { id: Date.now(), name: startChatWith, lastMessage: '', avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${startChatWith}` };
      setActiveChat(chat);
    }
  }, [startChatWith]);

  const handleSend = () => {
    toast({ title: t.notImplemented, duration: 3000 });
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
    }
  };
  
  const handleChatClick = (chat) => {
    setActiveChat(chat);
    toast({ title: t.notImplemented, duration: 3000 });
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const handleBack = () => {
    setActiveChat(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-24 right-6 w-80 h-[28rem] bg-white dark:bg-card rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
        >
          <header className="bg-[#0e345a] text-white p-3 flex justify-between items-center rounded-t-2xl flex-shrink-0">
            <div className="flex items-center">
              {activeChat ? (
                <Button variant="ghost" size="icon" className="h-7 w-7 mr-2 text-white hover:bg-white/20" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              ) : (
                <Mail className="w-5 h-5 mr-2" />
              )}
              <h3 className="font-semibold text-base truncate">{activeChat ? activeChat.name : t.messages}</h3>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-white hover:bg-white/20" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </header>
          
          {!activeChat ? (
            <div className="p-2 space-y-2 overflow-y-auto">
              {dummyChats.map(chat => (
                <div key={chat.id} className="p-2 flex items-center space-x-3 rounded-lg hover:bg-gray-100 dark:hover:bg-secondary cursor-pointer" onClick={() => handleChatClick(chat)}>
                  <Avatar>
                    <AvatarImage src={chat.avatar} />
                    <AvatarFallback>{chat.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-bold text-[#0e345a] dark:text-primary-foreground truncate">{chat.name}</p>
                    <p className="text-sm text-gray-500 dark:text-muted-foreground truncate">{chat.lastMessage}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 p-4 overflow-y-auto">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs rounded-lg px-3 py-2 mb-2 ${msg.sender === 'user' ? 'bg-[#0e345a] text-white' : 'bg-gray-200 dark:bg-secondary text-foreground'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-border flex items-center">
                <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress} placeholder={t.writeMessage} className="flex-1 mr-2" />
                <Button size="icon" className="bg-[#0e345a] hover:bg-[#0e345a]/90" onClick={handleSend}><Send className="w-4 h-4" /></Button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MessagesPopup;
