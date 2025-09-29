import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { translations } from '@/lib/translations';
import { useLanguage } from '@/contexts/LanguageContext';

const Hero = ({ openLoginModal }) => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h1 className="text-5xl lg:text-6xl font-bold text-[#0e345a] dark:text-gray-100 leading-tight">
            {t.welcome}
          </h1>
          <p className="text-xl text-foreground">
            {t.subtitle}
          </p>
          <p className="text-lg text-muted-foreground">
            {t.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-[#0e345a] hover:bg-[#0e345a]/90 text-white rounded-full px-8"
              onClick={openLoginModal}
            >
              {t.startReading}
            </Button>
            <Button
              size="lg"
              className="bg-[#0e345a] hover:bg-[#0e345a]/90 text-white rounded-full px-8"
              onClick={openLoginModal}
            >
              {t.startWriting}
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <img 
            className="w-full h-auto rounded-lg shadow-2xl"
            alt="Folklore platform preview on desktop and mobile devices"
           src="https://images.unsplash.com/photo-1663236757079-5909ac571f74" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
