import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingButtons from '@/components/popups/FloatingButtons';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Plus, MoreVertical, Eye, Heart, MessageCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const dummyPublishedStories = [
    { id: '1', title: 'El Último Dragón', coverUrl: 'https://images.unsplash.com/photo-1597923109921-ba3c29830038', publishedChapters: 12, draftChapters: 2, updatedAt: '2025-09-11T21:28:00Z', views: 1024, votes: 128, comments: 32 },
    { id: '2', title: 'Crónicas de Marte', coverUrl: 'https://images.unsplash.com/photo-1697564264564-6b19381f0637', publishedChapters: 5, draftChapters: 0, updatedAt: '2025-09-10T14:15:00Z', views: 512, votes: 64, comments: 16 },
];

const dummyDraftStories = [
    { id: '3', title: 'Proyecto Quimera', coverUrl: 'https://images.unsplash.com/photo-1534723328310-e82dad3ee43f', publishedChapters: 0, draftChapters: 3, updatedAt: '2025-09-09T10:05:00Z', views: 0, votes: 0, comments: 0 },
];

const StoryItem = ({ story, isPublished, t, onUnpublish, onDelete }) => {
    const navigate = useNavigate();
    const formattedDate = new Date(story.updatedAt).toLocaleString(t.language, {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return (
        <div className="flex items-start space-x-4 p-4 bg-card rounded-2xl shadow-sm">
            <img src={story.coverUrl} alt={story.title} className="w-16 h-24 object-cover rounded-md flex-shrink-0" />
            <div className="flex-grow">
                <Link to={`/story/edit/${story.id}`} className="font-bold text-lg hover:underline">{story.title}</Link>
                <div className="text-sm text-muted-foreground mt-1 space-x-4">
                    {isPublished && <span><span className="text-primary font-semibold">{story.publishedChapters}</span> {t.publishedChapters}</span>}
                    <span><span className="text-gray-500 font-semibold">{story.draftChapters}</span> {t.draftChapters}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{t.updated} {formattedDate}</p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
                    <span className="flex items-center"><Eye className="w-4 h-4 mr-1" /> {story.views}</span>
                    <span className="flex items-center"><Heart className="w-4 h-4 mr-1" /> {story.votes}</span>
                    <span className="flex items-center"><MessageCircle className="w-4 h-4 mr-1" /> {story.comments}</span>
                </div>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon"><MoreVertical className="w-5 h-5" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {isPublished && <DropdownMenuItem onClick={() => onUnpublish(story.id)}>{t.unpublish}</DropdownMenuItem>}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive" onClick={() => onDelete(story.id)}>{t.deleteStory}</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

const MyStoriesPage = () => {
    const { user, profile, logout, openLoginModal, openRegisterModal } = useAuth();
    const { isDark } = useTheme();
    const { language } = useLanguage();
    const t = translations[language] || translations.es;
    const navigate = useNavigate();
    const { toast } = useToast();

    const [publishedStories, setPublishedStories] = useState(dummyPublishedStories);
    const [draftStories, setDraftStories] = useState(dummyDraftStories);
    const [dialogState, setDialogState] = useState({ open: false, type: null, storyId: null });

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark);
    }, [isDark]);

    const handleNewStory = () => navigate('/story/new');
    
    const showNotImplementedToast = () => toast({ title: t.notImplemented, duration: 3000 });

    const handleUnpublishClick = (storyId) => {
        setDialogState({ open: true, type: 'unpublish', storyId });
    };

    const handleDeleteClick = (storyId) => {
        setDialogState({ open: true, type: 'delete', storyId });
    }

    const confirmAction = () => {
        showNotImplementedToast();
        setDialogState({ open: false, type: null, storyId: null });
    };

    const hasStories = publishedStories.length > 0 || draftStories.length > 0;

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Helmet>
                <title>{t.myStoriesTitle} - Folklore</title>
                <meta name="description" content={`Gestiona tus historias en Folklore, ${profile?.username}.`} />
            </Helmet>

            <Header user={user} logout={logout} openLoginModal={openLoginModal} openRegisterModal={openRegisterModal} />

            <main className="pt-24 pb-16 container mx-auto px-4">
                {hasStories ? (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold text-[#0e345a]">{t.myStoriesTitle}</h1>
                            <Button onClick={handleNewStory}>
                                <Plus className="w-4 h-4 mr-2" /> {t.newStory}
                            </Button>
                        </div>
                        <Tabs defaultValue="published" className="w-full">
                            <TabsList className="rounded-full">
                                <TabsTrigger value="published" className="rounded-full">{t.published}</TabsTrigger>
                                <TabsTrigger value="drafts" className="rounded-full">{t.drafts}</TabsTrigger>
                            </TabsList>
                            <TabsContent value="published" className="mt-6 space-y-4">
                                {publishedStories.map(story => (
                                    <StoryItem key={story.id} story={story} isPublished={true} t={t} onUnpublish={handleUnpublishClick} onDelete={handleDeleteClick} />
                                ))}
                            </TabsContent>
                            <TabsContent value="drafts" className="mt-6 space-y-4">
                                {draftStories.map(story => (
                                    <StoryItem key={story.id} story={story} isPublished={false} t={t} onUnpublish={handleUnpublishClick} onDelete={handleDeleteClick}/>
                                ))}
                            </TabsContent>
                        </Tabs>
                    </>
                ) : (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-bold text-[#0e345a] mb-4">
                            {t.noStoriesYet.replace('{username}', profile?.username || 'escritor')}
                        </h2>
                        <Button onClick={handleNewStory}>
                            <Plus className="w-4 h-4 mr-2" /> {t.createOne}
                        </Button>
                    </div>
                )}
            </main>

            <Dialog open={dialogState.open} onOpenChange={(isOpen) => setDialogState(prev => ({...prev, open: isOpen}))}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-[#0e345a]">
                            {dialogState.type === 'unpublish' ? t.unpublishWarningTitle : t.confirmDeleteStoryTitle}
                        </DialogTitle>
                        <DialogDescription>
                            {dialogState.type === 'unpublish' ? t.unpublishWarningBody : t.confirmDeleteStoryBody}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild><Button variant="outline">{t.cancel}</Button></DialogClose>
                        <Button onClick={confirmAction}>{t.accept}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <FloatingButtons />
            <Footer />
        </div>
    );
};

export default MyStoriesPage;
