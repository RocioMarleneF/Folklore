import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Library, Plus, Book, User, Bell, Settings, LogOut, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { translations } from '@/lib/translations';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';

const Header = ({ user, logout, openLoginModal, openRegisterModal }) => {
  const { language } = useLanguage();
  const t = translations[language] || translations.es;
  const { toast } = useToast();
  const navigate = useNavigate();
  const { profile } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  
  const showNotImplementedToast = () => toast({ title: t.notImplemented, duration: 3000 });

  const displayName = profile?.display_name || user?.email || 'User';
  const username = profile?.username || 'user';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0e345a] shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to={user ? "/home" : "/"} className="folklore-logo text-white text-3xl cursor-pointer">Folklore</Link>
        
        <div className="flex-1 max-w-md mx-4 md:mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder={t.search}
              className="pl-10 bg-white border-0 rounded-full"
              onFocus={showNotImplementedToast}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          {user && profile ? (
            <>
              {/* Desktop view */}
              <div className="hidden md:flex items-center space-x-4">
                <Button variant="ghost" className="text-white hover:bg-white/10" onClick={showNotImplementedToast}>{t.library}</Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-white hover:bg-white/10">{t.myStories}</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => navigate('/story/new')}><Plus className="mr-2 h-4 w-4" />{t.createNewStory}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/my-stories')}><Book className="mr-2 h-4 w-4" />{t.myStories}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Mobile view */}
              <div className="flex md:hidden items-center space-x-2">
                 <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={showNotImplementedToast}>
                    <Library className="w-5 h-5" />
                 </Button>
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                            <Pencil className="w-5 h-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => navigate('/story/new')}><Plus className="mr-2 h-4 w-4" />{t.createNewStory}</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/my-stories')}><Book className="mr-2 h-4 w-4" />{t.myStories}</DropdownMenuItem>
                    </DropdownMenuContent>
                 </DropdownMenu>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer h-9 w-9">
                    <AvatarImage src={profile.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`} alt={displayName} />
                    <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate(`/profile/${username}`)}><User className="mr-2 h-4 w-4" />{t.profile}</DropdownMenuItem>
                  <DropdownMenuItem onClick={showNotImplementedToast}><Bell className="mr-2 h-4 w-4" />{t.notifications}</DropdownMenuItem>
                  <DropdownMenuItem onClick={showNotImplementedToast}><Settings className="mr-2 h-4 w-4" />{t.settings}</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" />{t.logout}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : !user ? (
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="text-[#0e345a] border-white bg-white hover:bg-gray-100" onClick={openLoginModal}>
                {t.login}
              </Button>
              <Button className="bg-white text-[#0e345a] hover:bg-gray-100" onClick={openRegisterModal}>
                {t.register}
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default Header;
