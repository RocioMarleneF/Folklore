import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { translations } from '@/lib/translations';
import { useLanguage } from '@/contexts/LanguageContext';

const featuredStoriesData = [
    { id: 1, title: "El Susurro del Bosque", author: "María Elena Vásquez", quote: "En cada hoja que cae, hay una historia que contar...", cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=300&fit=crop" },
    { id: 2, title: "Lunas de Medianoche", author: "Carlos Mendoza", quote: "Cuando la luna llena aparece, los secretos salen a la luz.", cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop" },
    { id: 3, title: "El Último Dragón", author: "Ana Sofía Torres", quote: "No todos los dragones escupen fuego, algunos guardan lágrimas.", cover: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop" },
    { id: 4, title: "Cartas al Viento", author: "Roberto Silva", quote: "Cada carta llevaba un pedazo de su alma al infinito.", cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=300&fit=crop" },
    { id: 5, title: "La Biblioteca Perdida", author: "Isabella Moreno", quote: "Entre libros olvidados, encontró su propia historia.", cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=300&fit=crop" }
];

const FeaturedStories = () => {
    const [carouselIndex, setCarouselIndex] = useState(0);
    const { toast } = useToast();
    const { language } = useLanguage();
    const t = translations[language] || translations.es;

    const handleStoryClick = () => {
        toast({ title: t.notImplemented, duration: 3000 });
    };

    const nextSlide = () => setCarouselIndex((prev) => (prev + 1) % featuredStoriesData.length);
    const prevSlide = () => setCarouselIndex((prev) => (prev - 1 + featuredStoriesData.length) % featuredStoriesData.length);

    return (
        <section className="bg-muted/30 dark:bg-card/20 py-16">
            <div className="container mx-auto px-4">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl font-bold text-center mb-12 text-[#0e345a] dark:text-gray-100"
                >
                    {t.featuredStories}
                </motion.h2>

                <div className="relative">
                    <div className="overflow-hidden rounded-lg">
                        <motion.div
                            className="flex"
                            animate={{ x: `-${carouselIndex * 100}%` }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        >
                            {featuredStoriesData.map((story) => (
                                <div key={story.id} className="w-full flex-shrink-0">
                                    <div className="grid md:grid-cols-2 gap-0 items-center max-w-5xl mx-auto bg-card dark:bg-background/50 rounded-lg shadow-lg overflow-hidden">
                                        <motion.div
                                            className="h-64 md:h-full"
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="relative cursor-pointer group h-full" onClick={handleStoryClick}>
                                                <img src={story.cover} alt={story.title} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-gradient-to-r md:from-black/30 md:to-transparent" />
                                            </div>
                                        </motion.div>
                                        <div className="p-8 space-y-4 text-center md:text-left">
                                            <h3 className="text-2xl font-bold text-[#0e345a] dark:text-primary-foreground">{story.title}</h3>
                                            <p className="text-lg text-muted-foreground italic">"{story.quote}"</p>
                                            <p className="text-foreground font-medium">— {story.author}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    <Button variant="outline" size="icon" className="absolute left-0 md:left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white dark:bg-background/80 dark:hover:bg-background rounded-full shadow-md" onClick={prevSlide}><ChevronLeft className="w-5 h-5" /></Button>
                    <Button variant="outline" size="icon" className="absolute right-0 md:right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white dark:bg-background/80 dark:hover:bg-background rounded-full shadow-md" onClick={nextSlide}><ChevronRight className="w-5 h-5" /></Button>

                    <div className="flex justify-center mt-8 space-x-2">
                        {featuredStoriesData.map((_, index) => (
                            <button key={index} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === carouselIndex ? 'bg-[#0e345a] w-6' : 'bg-gray-300 dark:bg-gray-600'}`} onClick={() => setCarouselIndex(index)} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedStories;
