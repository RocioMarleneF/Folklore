import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import FeaturedStories from '@/components/sections/FeaturedStories';

const LandingPage = () => {
  const { user, openLoginModal, openRegisterModal, logout } = useAuth();
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const t = translations[language] || translations.es;
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  if (user && location.pathname !== '/home/public') {
    return <Navigate to="/home" />;
  }
  
  if (location.pathname === '/home') {
    return <Navigate to="/home/public" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Folklore - {t.subtitle}</title>
        <meta name="description" content={t.description} />
        <meta property="og:title" content={`Folklore - ${t.subtitle}`} />
        <meta property="og:description" content={t.description} />
      </Helmet>

      <Header 
        user={user} 
        logout={logout}
        openLoginModal={openLoginModal}
        openRegisterModal={openRegisterModal}
      />
      
      <main className="pt-20">
        <Hero openLoginModal={openLoginModal} />
        <FeaturedStories />
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingPage;
