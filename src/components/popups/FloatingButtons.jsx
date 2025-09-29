import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, MessageSquare, Send as PaperPlane } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import AiChatPopup from './AiChatPopup';
import MessagesPopup from './MessagesPopup';

const Plus = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const FloatingButtons = ({ startChatWithUser }) => {
  const { isDark, setIsDark } = useTheme();
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [startChatTarget, setStartChatTarget] = useState(null);

  React.useEffect(() => {
    if (startChatWithUser) {
        setStartChatTarget(startChatWithUser);
        setIsMessagesOpen(true);
        setIsMenuOpen(true);
    }
  }, [startChatWithUser]);


  const fabStyle = "w-14 h-14 rounded-full bg-[#0e345a] hover:bg-[#0e345a]/90 text-white shadow-lg flex items-center justify-center";

  const handleToggleMessages = () => {
    setStartChatTarget(null); // Reset target when manually opening
    setIsMessagesOpen(prev => !prev);
  }

  const handleCloseMessages = () => {
    setIsMessagesOpen(false);
    setStartChatTarget(null);
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <motion.div
          className="flex flex-col items-center space-y-3"
        >
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                key="menu"
                className="flex flex-col items-center space-y-3"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.button  className={fabStyle} onClick={() => setIsDark(!isDark)}>
                  {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                </motion.button>
                <motion.button  className={fabStyle} onClick={handleToggleMessages}>
                  <PaperPlane className="w-6 h-6" />
                </motion.button>
                <motion.button  className={fabStyle} onClick={() => setIsAiChatOpen(prev => !prev)}>
                  <MessageSquare className="w-6 h-6" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button
            className={`${fabStyle} z-10`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 45 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Plus className="w-7 h-7" />
            </motion.div>
          </motion.button>
        </motion.div>
      </div>

      <AiChatPopup isOpen={isAiChatOpen} onClose={() => setIsAiChatOpen(false)} />
      <MessagesPopup isOpen={isMessagesOpen} onClose={handleCloseMessages} startChatWith={startChatTarget} />
    </>
  );
};

export default FloatingButtons;
