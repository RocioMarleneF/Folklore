import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FeaturedStories from '@/components/sections/FeaturedStories';
import StoryCarousel from '@/components/common/StoryCarousel';

const dummyStories = (count) => Array.from({ length: count }, (_, i) => ({
  title: `Historia Asombrosa ${i + 1}`,
  cover: `https://picsum.photos/seed/${i+10}/200/300`
}));

const PublicHomePage = () => {
  const { openLoginModal, openRegisterModal } = useAuth();
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const t = translations[language] || translations.es;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>{t.home} - Folklore</title>
        <meta name="description" content="Explora las historias de Folklore." />
        <meta property="og:title" content={`${t.home} - Folklore`} />
        <meta property="og:description" content="Explora las historias de Folklore." />
      </Helmet>

      <Header
        user={null}
        openLoginModal={openLoginModal}
        openRegisterModal={openRegisterModal}
      />

      <main className="pt-20">
        <FeaturedStories />

        <div className="container mx-auto px-4 pb-16">
          <StoryCarousel title={t.recentlyRead} stories={dummyStories(10)} />
          <StoryCarousel title={t.recommendedStories} stories={dummyStories(10)} />
          <StoryCarousel title={t.trending} stories={dummyStories(10)} />
          <StoryCarousel title={t.popularCategories} stories={dummyStories(10)} />
          <StoryCarousel title={t.listsAndCollections} stories={dummyStories(10)} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PublicHomePage;
