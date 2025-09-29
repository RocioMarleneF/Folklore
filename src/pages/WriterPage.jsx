import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronLeft, MoreHorizontal, Plus, Image as ImageIcon, Youtube, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Music } from 'lucide-react';
import FloatingButtons from '@/components/popups/FloatingButtons';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import UnderlineExtension from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import YoutubeExtension from '@tiptap/extension-youtube';
import Link from '@tiptap/extension-link';

const WriterHeader = ({ story, chapter, chapters, onSave, onPublish, onHistory, onDeletePart }) => {
    const { language } = useLanguage();
    const t = translations[language] || translations.es;
    const navigate = useNavigate();
    const { storyId } = useParams();

    const [isPublishOpen, setIsPublishOpen] = useState(false);

    const handlePublish = () => {
        setIsPublishOpen(false);
        onPublish();
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#0e345a] text-white shadow-lg">
            <div className="container mx-auto px-4 py-2 flex items-center justify-between">
                <div className="flex items-center space-x-2 md:space-x-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(`/story/edit/${story.id}`)}>
                        <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <img src={story.coverUrl} alt={story.title} className="w-8 h-12 object-cover rounded-sm hidden md:block" />
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="cursor-pointer text-left">
                                <p className="text-sm text-gray-300 truncate max-w-[150px] md:max-w-xs">{story.title}</p>
                                <h2 className="font-bold text-base md:text-lg truncate max-w-[150px] md:max-w-xs">{chapter.title}</h2>
                                <p className="text-xs text-green-400">{chapter.isPublished ? t.published : t.draft}</p>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="max-h-80 overflow-y-auto">
                            {chapters.map(c => (
                                <DropdownMenuItem key={c.id} onClick={() => navigate(`/story/edit/${story.id}/chapter/${c.id}`)}>
                                    <div>
                                        <p className="font-semibold">{c.title}</p>
                                        <p className="text-xs text-muted-foreground">{c.isPublished ? t.published : t.draft} - {new Date(c.updatedAt).toLocaleDateString()}</p>
                                    </div>
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                             <DropdownMenuItem onSelect={() => navigate(`/story/edit/${storyId}/chapter/new`)}>
                                <Button className="w-full bg-[#0e345a] text-white rounded-full">
                                    <Plus className="w-4 h-4 mr-2" />{t.newChapter}
                                </Button>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex items-center space-x-2">
                    <Button variant="ghost" onClick={onSave}>{t.save}</Button>
                    <Button className="bg-white text-[#0e345a] hover:bg-gray-100 rounded-full" onClick={() => setIsPublishOpen(true)}>{t.post}</Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreHorizontal className="w-5 h-5"/></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={onHistory}>{t.history}</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={onDeletePart}>{t.deletePart}</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <Dialog open={isPublishOpen} onOpenChange={setIsPublishOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-[#0e345a] text-2xl">{t.publishChapter}</DialogTitle>
                    </DialogHeader>
                    <DialogFooter>
                        <Button className="bg-[#0e345a] text-white rounded-full w-full" onClick={handlePublish}>{t.post}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </header>
    );
};

const EditorToolbar = ({ editor, t }) => {
    if (!editor) return null;

    const addImage = () => {
        const url = window.prompt('URL de la imagen');
        if (url) editor.chain().focus().setImage({ src: url }).run();
    };

    const addYoutubeVideo = () => {
        const url = window.prompt('URL del video de YouTube');
        if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run();
    };

    return (
        <div className="border border-input bg-transparent rounded-t-md p-2 flex items-center space-x-1 sticky top-[68px] z-10 bg-background">
            <Button variant={editor.isActive('bold') ? 'secondary' : 'ghost'} size="icon" onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="w-4 h-4" /></Button>
            <Button variant={editor.isActive('italic') ? 'secondary' : 'ghost'} size="icon" onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="w-4 h-4" /></Button>
            <Button variant={editor.isActive('underline') ? 'secondary' : 'ghost'} size="icon" onClick={() => editor.chain().focus().toggleUnderline().run()}><Underline className="w-4 h-4" /></Button>
            <Button variant={editor.isActive({ textAlign: 'left' }) ? 'secondary' : 'ghost'} size="icon" onClick={() => editor.chain().focus().setTextAlign('left').run()}><AlignLeft className="w-4 h-4" /></Button>
            <Button variant={editor.isActive({ textAlign: 'center' }) ? 'secondary' : 'ghost'} size="icon" onClick={() => editor.chain().focus().setTextAlign('center').run()}><AlignCenter className="w-4 h-4" /></Button>
            <Button variant={editor.isActive({ textAlign: 'right' }) ? 'secondary' : 'ghost'} size="icon" onClick={() => editor.chain().focus().setTextAlign('right').run()}><AlignRight className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" onClick={addImage}><ImageIcon className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" onClick={addYoutubeVideo}><Youtube className="w-4 h-4" /></Button>
        </div>
    );
};

const WriterPage = () => {
    const { storyId, chapterId } = useParams();
    const { isDark } = useTheme();
    const { language } = useLanguage();
    const t = translations[language] || translations.es;
    const { toast } = useToast();
    const navigate = useNavigate();

    const [story, setStory] = useState({ id: storyId, title: 'El Legado del Dragón de Jade', coverUrl: 'https://images.unsplash.com/photo-1542944352-27863a32f659' });
    const [chapters, setChapters] = useState([
        { id: '1', title: 'Capítulo 1: El Despertar', isPublished: true, updatedAt: '2025-09-10' },
        { id: '2', title: 'La Sombra en el Bosque', isPublished: false, updatedAt: '2025-09-12' },
        { id: '3', title: 'Capítulo 3: El Viaje Comienza', isPublished: false, updatedAt: '2025-09-11' },
    ]);
    const [currentChapter, setCurrentChapter] = useState(null);
    const [chapterTitle, setChapterTitle] = useState('');
    const [spotifyUrl, setSpotifyUrl] = useState('');
    const [spotifyInput, setSpotifyInput] = useState('');
    
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            UnderlineExtension,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Placeholder.configure({ placeholder: 'Comienza a escribir tu capítulo aquí...' }),
            Image.configure({ inline: false }),
            YoutubeExtension.configure({ nocookie: true }),
            Link.configure({ openOnClick: false, autolink: true }),
        ],
        content: '',
    });

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark);
        
        let chapter;
        if (chapterId === 'new') {
            const newChapterNumber = chapters.length + 1;
            chapter = { id: 'new', title: `Capítulo ${newChapterNumber}`, content: '', isPublished: false, updatedAt: new Date().toISOString() };
        } else {
            chapter = chapters.find(c => c.id === chapterId);
        }

        if (chapter) {
            setCurrentChapter(chapter);
            setChapterTitle(chapter.title);
            editor?.commands.setContent(chapter.content || 'Lorem ipsum dolor sit amet...');
        } else {
            navigate(`/story/edit/${storyId}`);
        }
    }, [isDark, chapterId, storyId, navigate, chapters, t, editor]);

    const showNotImplementedToast = () => toast({ title: t.notImplemented, duration: 3000 });

    const handleSave = showNotImplementedToast;
    const handlePublish = showNotImplementedToast;
    const handleHistory = showNotImplementedToast;
    const handleDeletePart = () => setIsDeleteOpen(true);
    
    const confirmDeletePart = () => {
        setIsDeleteOpen(false);
        showNotImplementedToast();
        navigate(`/story/edit/${storyId}`);
    };

    const handleAddSpotify = () => {
        setSpotifyUrl(spotifyInput);
        showNotImplementedToast();
        toast({ title: "Playlist agregada (simulado)" });
    };

    if (!currentChapter) return null;

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Helmet><title>{`${chapterTitle} - ${t.writerMode}`}</title></Helmet>

            <WriterHeader story={story} chapter={{...currentChapter, title: chapterTitle}} chapters={chapters} onSave={handleSave} onPublish={handlePublish} onHistory={handleHistory} onDeletePart={handleDeletePart} />

            <main className="pt-24 pb-16">
                <div className="max-w-4xl mx-auto px-4 space-y-6">
                    <div className="flex items-center space-x-4">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="icon" className="bg-[#1DB954] text-white hover:bg-[#1DB954]/90 rounded-full"><Music className="w-5 h-5" /></Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <h4 className="font-medium leading-none">Spotify Playlist</h4>
                                        <p className="text-sm text-muted-foreground">Añade una playlist para ambientar tu capítulo.</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Input 
                                          defaultValue={spotifyUrl} 
                                          onChange={(e) => setSpotifyInput(e.target.value)}
                                          placeholder="https://open.spotify.com/..." 
                                          onKeyDown={(e) => { if (e.key === 'Enter') handleAddSpotify(); }} 
                                      />
                                      <Button onClick={handleAddSpotify} className="rounded-full">{t.add}</Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                        <Input
                            value={chapterTitle}
                            onChange={(e) => setChapterTitle(e.target.value)}
                            placeholder="Título del capítulo"
                            className="text-2xl font-bold border-0 focus-visible:ring-0 shadow-none p-0"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => showNotImplementedToast()}><ImageIcon className="w-4 h-4 mr-2" />Añadir Imagen de Cabecera</Button>
                            <Button variant="outline" size="sm" onClick={() => showNotImplementedToast()}><Youtube className="w-4 h-4 mr-2" />Añadir Video de Cabecera</Button>
                        </div>
                    </div>

                    <div className="border rounded-md">
                        <EditorToolbar editor={editor} t={t} />
                        <EditorContent editor={editor} className="p-4" />
                    </div>
                </div>
            </main>

            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-[#0e345a]">{t.confirmChapterDeletion}</DialogTitle>
                    <DialogDescription>
                      <p className="font-bold text-foreground">{t.deleteChapterWarning}</p>
                      <p>{t.deleteChapterConsequences}</p>
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild><Button variant="outline" className="rounded-full">{t.cancel}</Button></DialogClose>
                    <Button onClick={confirmDeletePart} className="bg-[#0e345a] text-white rounded-full">{t.delete}</Button>
                  </DialogFooter>
                </DialogContent>
            </Dialog>
            
            <FloatingButtons />
        </div>
    );
};

export default WriterPage;
