import React from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { translations } from '@/lib/translations';
import { useLanguage } from '@/contexts/LanguageContext';

const StoryCarousel = ({ title, stories }) => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = translations[language];

  const handleStoryClick = () => {
    toast({ title: t.notImplemented, duration: 3000 });
  };

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-4 text-[#0e345a] dark:text-gray-100">{title}</h2>
      <div className="flex overflow-x-auto space-x-4 pb-4 carousel-container">
        {stories.map((story, index) => (
          <motion.div
            key={index}
            className="flex-shrink-0 w-40 cursor-pointer group"
            onClick={handleStoryClick}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <img
                src={story.cover}
                alt={story.title}
                className="w-full h-56 object-cover rounded-lg shadow-md group-hover:shadow-xl transition-shadow"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors rounded-lg" />
            </div>
            <p className="mt-2 text-sm font-semibold truncate text-foreground">{story.title}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StoryCarousel;
