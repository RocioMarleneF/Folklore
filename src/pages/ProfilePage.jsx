import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';
import { supabase } from '@/lib/customSupabaseClient';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingButtons from '@/components/popups/FloatingButtons';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Instagram, Youtube, Twitter, Heart, MessageCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';

const ProfilePage = () => {
  const { username } = useParams();
  const { user, logout, openLoginModal, openRegisterModal, profile: currentUserProfile } = useAuth();
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const t = translations[language] || translations.es;
  const { toast } = useToast();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startChat, setStartChat] = useState(null);


  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (error) {
        setError(error.message);
        toast({ title: 'Error', description: `No se pudo cargar el perfil: ${error.message}`, variant: 'destructive' });
      } else {
        setProfile(data);
      }
      setLoading(false);
    };

    if (username) {
      fetchProfile();
    }
  }, [username, toast]);

  const showNotImplementedToast = () => toast({ title: t.notImplemented, duration: 3000 });

  const handleSendMessage = () => {
    setStartChat(profile?.display_name || profile?.username);
  }

  const isOwnProfile = currentUserProfile?.username === username;

  if (loading) {
    return <div>Cargando perfil...</div>;
  }

  if (error || !profile) {
    return <div>Error al cargar el perfil.</div>;
  }

  const displayName = profile.display_name || profile.username;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>{`${displayName} - Folklore`}</title>
        <meta name="description" content={`Perfil de ${displayName} en Folklore.`} />
        <meta property="og:title" content={`${displayName} - Folklore`} />
        <meta property="og:description" content={`Perfil de ${displayName} en Folklore.`} />
      </Helmet>

      <Header
        user={user}
        logout={logout}
        openLoginModal={openLoginModal}
        openRegisterModal={openRegisterModal}
      />

      <main className="pt-20">
        <div className="relative h-48 md:h-64 bg-gray-300 dark:bg-gray-700">
          <img 
            className="w-full h-full object-cover"
            alt={`Banner de ${displayName}`}
           src="https://images.unsplash.com/photo-1657983794129-95527a7b7738" />
          <div className="absolute -bottom-16 left-8">
            <Avatar className="w-32 h-32 border-4 border-background">
              <AvatarImage src={profile.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`} alt={displayName} />
              <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="container mx-auto px-4 pt-20 pb-16">
          <div className="flex justify-end mb-4 space-x-2">
            {isOwnProfile ? (
              <Button onClick={showNotImplementedToast}>{t.editProfile}</Button>
            ) : (
              <>
                <Button onClick={showNotImplementedToast}>{t.follow}</Button>
                <Button onClick={handleSendMessage} className="bg-[#0e345a] text-white">{t.sendMessage}</Button>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {/* Columna Izquierda: Info Personal */}
            <div className="md:col-span-1 lg:col-span-1">
              <h1 className="text-2xl font-bold">{displayName}</h1>
              <p className="text-muted-foreground">@{profile.username}</p>
              <p className="mt-4 text-sm">{profile.bio || 'Este usuario aún no ha añadido una biografía.'}</p>
              
              <div className="flex space-x-4 mt-4">
                <div><span className="font-bold">0</span> <span className="text-muted-foreground">{t.followers}</span></div>
                <div><span className="font-bold">0</span> <span className="text-muted-foreground">{t.following}</span></div>
                <div><span className="font-bold">0</span> <span className="text-muted-foreground">{t.stories}</span></div>
              </div>

              <div className="flex space-x-2 mt-4">
                <Button variant="ghost" size="icon" onClick={showNotImplementedToast}><Instagram className="w-5 h-5" /></Button>
                <Button variant="ghost" size="icon" onClick={showNotImplementedToast}><Youtube className="w-5 h-5" /></Button>
                <Button variant="ghost" size="icon" onClick={showNotImplementedToast}><Twitter className="w-5 h-5" /></Button>
              </div>
            </div>

            {/* Columna Central: Muro Social */}
            <div className="md:col-span-2 lg:col-span-2">
              <div className="bg-card p-4 rounded-2xl shadow-sm">
                <Textarea placeholder={t.whatsOnYourMind} className="mb-2 rounded-2xl" />
                <div className="flex justify-end">
                  <Button onClick={showNotImplementedToast}>{t.post}</Button>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {/* Ejemplo de post */}
                <div className="bg-card p-4 rounded-2xl shadow-sm">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={profile.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`} alt={displayName} />
                      <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{displayName} <span className="text-sm text-muted-foreground font-normal">@ {profile.username} · 1h</span></p>
                      <p>¡Emocionado por empezar mi nueva historia en Folklore! ✍️</p>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-4 mt-2 text-muted-foreground">
                    <button className="flex items-center space-x-1 hover:text-primary" onClick={showNotImplementedToast}><Heart className="w-4 h-4" /> <span>12</span></button>
                    <button className="flex items-center space-x-1 hover:text-primary" onClick={showNotImplementedToast}><MessageCircle className="w-4 h-4" /> <span>3</span></button>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Historias */}
            <div className="md:col-span-3 lg:col-span-1">
              <h2 className="text-xl font-bold mb-4">{t.stories}</h2>
              <div className="space-y-4">
                {/* Ejemplo de historia */}
                <div className="flex items-center space-x-4" onClick={showNotImplementedToast}>
                  <img  className="w-16 h-24 object-cover rounded-md" alt="Portada de libro" src="https://images.unsplash.com/photo-1597923109921-ba3c29830038" />
                  <div>
                    <h3 className="font-semibold">El Último Dragón</h3>
                    <p className="text-sm text-muted-foreground">Fantasía</p>
                  </div>
                </div>
                 <div className="flex items-center space-x-4" onClick={showNotImplementedToast}>
                  <img  className="w-16 h-24 object-cover rounded-md" alt="Portada de libro de ciencia ficción" src="https://images.unsplash.com/photo-1697564264564-6b19381f0637" />
                  <div>
                    <h3 className="font-semibold">Crónicas de Marte</h3>
                    <p className="text-sm text-muted-foreground">Ciencia Ficción</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FloatingButtons startChatWithUser={startChat} />
      <Footer />
    </div>
  );
};

export default ProfilePage;
