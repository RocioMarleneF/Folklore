import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Image, Link as LinkIcon, UploadCloud, X, Edit, GripVertical, Eye as EyeIcon, Heart, MessageCircle, MoreVertical } from 'lucide-react';
import Footer from '@/components/layout/Footer';
import FloatingButtons from '@/components/popups/FloatingButtons';

const EditStoryHeader = ({ onCancel, onSave }) => {
  const { language } = useLanguage();
  const t = translations[language] || translations.es;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0e345a] shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/home" className="folklore-logo text-white text-3xl cursor-pointer">Folklore</Link>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-white hover:bg-white/10" onClick={onCancel}>{t.cancel}</Button>
          <Button className="bg-white text-[#0e345a] hover:bg-gray-100" onClick={onSave}>{t.save}</Button>
        </div>
      </div>
    </header>
  );
};

const TagInput = ({ tags, setTags, t }) => {
  const [inputValue, setInputValue] = useState('');
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        setTags([...tags, inputValue.trim()]);
      }
      setInputValue('');
    }
  };
  const removeTag = (tagToRemove) => setTags(tags.filter(tag => tag !== tagToRemove));
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map(tag => (
          <div key={tag} className="flex items-center bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm">
            {tag}
            <button onClick={() => removeTag(tag)} className="ml-2"><X className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
      <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown} placeholder={t.addTagsPlaceholder} />
    </div>
  );
};

const SortableChapterItem = ({ chapter, t, onDelete, onPreview, onEdit }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: chapter.id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
        <div ref={setNodeRef} style={style} className="flex items-center bg-card p-3 rounded-lg shadow-sm">
            <button {...attributes} {...listeners} className="cursor-grab p-2"><GripVertical className="text-muted-foreground" /></button>
            <div className="flex-grow ml-2" onClick={onEdit}>
                <p className="font-semibold cursor-pointer hover:underline">{chapter.title}</p>
                <div className="flex items-center text-xs text-muted-foreground space-x-4">
                    <span>{chapter.isPublished ? t.published : t.draft}</span>
                    <span>{t.lastUpdated}: {new Date(chapter.updatedAt).toLocaleDateString()}</span>
                </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span className="flex items-center"><EyeIcon className="w-4 h-4 mr-1" /> {chapter.views}</span>
                <span className="flex items-center"><Heart className="w-4 h-4 mr-1" /> {chapter.votes}</span>
                <span className="flex items-center"><MessageCircle className="w-4 h-4 mr-1" /> {chapter.comments}</span>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="ml-4"><MoreVertical className="w-5 h-5" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={onPreview}>{t.preview}</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={onDelete}>{t.deleteChapter}</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};


const EditStoryPage = () => {
  const { storyId } = useParams();
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const t = translations[language] || translations.es;
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [story, setStory] = useState({ title: 'Historia sin título', description: '', category: '', copyright: '' });
  const [chapters, setChapters] = useState([
      { id: '1', title: 'Capítulo 1: El Despertar', isPublished: true, updatedAt: '2025-09-10', views: 1024, votes: 128, comments: 32 },
      { id: '2', title: 'Capítulo 2: La Sombra en el Bosque', isPublished: false, updatedAt: '2025-09-12', views: 0, votes: 0, comments: 0 },
  ]);
  const [tags, setTags] = useState(['fantasía', 'magia']);
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1542944352-27863a32f659');
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [chapterToDelete, setChapterToDelete] = useState(null);

  useEffect(() => { document.documentElement.classList.toggle('dark', isDark); }, [isDark]);

  const showNotImplementedToast = () => toast({ title: t.notImplemented, duration: 3000 });
  const handleSave = showNotImplementedToast;
  const handleCancel = () => navigate('/home');

  const handleCoverUploadClick = () => fileInputRef.current?.click();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      setCoverImage(URL.createObjectURL(file));
      showNotImplementedToast();
    } else {
      toast({ title: 'Error', description: 'Formato inválido.', variant: 'destructive' });
    }
  };

  const handleDeleteChapterClick = (chapterId) => {
    setChapterToDelete(chapterId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteChapter = () => {
    setChapters(chapters.filter(c => c.id !== chapterToDelete));
    setIsDeleteDialogOpen(false);
    setChapterToDelete(null);
    showNotImplementedToast();
  };
  
  const handleEditChapter = (chapterId) => {
    navigate(`/story/edit/${storyId}/chapter/${chapterId}`);
  };

  const handleNewChapter = () => {
    navigate(`/story/edit/${storyId}/chapter/new`);
  };

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setChapters((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      showNotImplementedToast();
    }
  };


  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>{t.editStoryTitle} - Folklore</title>
        <meta name="description" content={`${t.editStoryTitle}: ${story.title}`} />
      </Helmet>

      <EditStoryHeader onCancel={handleCancel} onSave={handleSave} />

      <main className="pt-24 pb-16 container mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 relative">
            <div className="aspect-[2/3] bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
              {coverImage ? (
                <img src={coverImage} alt="Story cover" className="w-full h-full object-cover rounded-lg"/>
              ) : (
                <div className="text-center text-muted-foreground">
                  <Image className="w-12 h-12 mx-auto" />
                  <p className="mt-2">{t.addCover}</p>
                </div>
              )}
            </div>
             <Popover>
              <PopoverTrigger asChild>
                <Button size="icon" className="absolute bottom-2 left-2 rounded-full"><Edit className="w-4 h-4"/></Button>
              </PopoverTrigger>
              <PopoverContent className="w-48">
                <div className="grid gap-4">
                  <Button variant="outline" onClick={handleCoverUploadClick}><UploadCloud className="mr-2 h-4 w-4"/> {t.uploadCover}</Button>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden"/>
                  <Button variant="outline" onClick={showNotImplementedToast}><LinkIcon className="mr-2 h-4 w-4"/> {t.addLink}</Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="md:col-span-2">
            <Tabs defaultValue="content" className="w-full">
              <TabsList>
                <TabsTrigger value="details">{t.storyDetails}</TabsTrigger>
                <TabsTrigger value="content">{t.tableOfContents}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-6 space-y-6">
                 <div>
                    <Label htmlFor="title">{t.title}</Label>
                    <Input id="title" value={story.title} onChange={(e) => setStory({...story, title: e.target.value})} />
                </div>
                <div>
                    <Label htmlFor="description">{t.description}</Label>
                    <Textarea id="description" value={story.description} onChange={(e) => setStory({...story, description: e.target.value})} rows={6} />
                </div>
                 <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <Label>{t.category}</Label>
                        <Select value={story.category} onValueChange={(val) => setStory({...story, category: val})}>
                            <SelectTrigger><SelectValue placeholder={t.selectCategory} /></SelectTrigger>
                            <SelectContent>{['action', 'adventure', 'sciFi', 'fanfiction', 'fantasy', 'nonFiction', 'youngAdult', 'poetry', 'horror'].map(cat => <SelectItem key={cat} value={cat}>{t[cat]}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>{t.copyright}</Label>
                        <Select value={story.copyright} onValueChange={(val) => setStory({...story, copyright: val})}>
                            <SelectTrigger><SelectValue placeholder={t.selectCopyright} /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-rights-reserved">{t.allRightsReserved}</SelectItem>
                                <SelectItem value="public-domain">{t.publicDomain}</SelectItem>
                                <SelectItem value="cc-by">{t.ccBy}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                 </div>
                 <div>
                    <Label>{t.tags}</Label>
                    <TagInput tags={tags} setTags={setTags} t={t} />
                 </div>
              </TabsContent>

              <TabsContent value="content" className="mt-6">
                <Button className="w-full mb-6 bg-[#0e345a] text-white" onClick={handleNewChapter}>{t.newChapter}</Button>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={chapters} strategy={verticalListSortingStrategy}>
                        <div className="space-y-3">
                            {chapters.map(chapter => (
                                <SortableChapterItem 
                                  key={chapter.id} 
                                  chapter={chapter} 
                                  t={t} 
                                  onPreview={showNotImplementedToast} 
                                  onDelete={() => handleDeleteChapterClick(chapter.id)}
                                  onEdit={() => handleEditChapter(chapter.id)}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
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
            <Button onClick={confirmDeleteChapter} className="bg-[#0e345a] text-white rounded-full">{t.delete}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <FloatingButtons />
      <Footer />
    </div>
  );
};

export default EditStoryPage;
