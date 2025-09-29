import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
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
import { Image, Link as LinkIcon, UploadCloud, X } from 'lucide-react';
import Footer from '@/components/layout/Footer';
import FloatingButtons from '@/components/popups/FloatingButtons';

const CreateStoryHeader = ({ onCancel, onSkip }) => {
  const { language } = useLanguage();
  const t = translations[language] || translations.es;
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0e345a] shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/home" className="folklore-logo text-white text-3xl cursor-pointer">Folklore</Link>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => navigate('/home')}>{t.cancel}</Button>
          <Button className="bg-white text-[#0e345a] hover:bg-gray-100" onClick={onSkip}>{t.skip}</Button>
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

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map(tag => (
          <div key={tag} className="flex items-center bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm">
            {tag}
            <button onClick={() => removeTag(tag)} className="ml-2">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t.addTagsPlaceholder}
      />
    </div>
  );
}

const CreateStoryPage = () => {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const t = translations[language] || translations.es;
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState([]);
  const [storyLanguage, setStoryLanguage] = useState('es');
  const [copyright, setCopyright] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [coverLink, setCoverLink] = useState('');
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const showNotImplementedToast = () => toast({ title: t.notImplemented, duration: 3000 });

  const handleSkip = () => {
    // For now, we'll just show a toast and navigate to a placeholder id.
    // In a real app, you would create the story here and get its ID.
    const storyId = "new-story-placeholder";
    showNotImplementedToast();
    navigate(`/story/edit/${storyId}`);
  };
  
  const handleCoverUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      setCoverImage(URL.createObjectURL(file));
      showNotImplementedToast();
    } else {
      toast({ title: 'Error', description: 'Formato de archivo no válido. Solo PNG, JPG, JPEG.', variant: 'destructive' });
    }
  };

  const handleAddLink = () => {
    if (coverLink) {
      setCoverImage(coverLink);
      setIsLinkPopoverOpen(false);
      showNotImplementedToast();
    }
  };


  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>{t.createNewStoryTitle} - Folklore</title>
        <meta name="description" content={t.createNewStoryDescription} />
      </Helmet>

      <CreateStoryHeader onCancel={() => navigate('/home')} onSkip={handleSkip} />

      <main className="pt-24 pb-16 container mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Popover>
              <PopoverTrigger asChild>
                <div className="aspect-[2/3] bg-muted rounded-lg flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-border hover:border-primary transition-colors">
                  {coverImage ? (
                    <img src={coverImage} alt="Story cover" className="w-full h-full object-cover rounded-lg"/>
                  ) : (
                    <>
                      <Image className="w-12 h-12 text-muted-foreground" />
                      <p className="mt-2 text-muted-foreground">{t.addCover}</p>
                    </>
                  )}
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-48">
                <div className="grid gap-4">
                  <Button variant="outline" onClick={handleCoverUploadClick}>
                    <UploadCloud className="mr-2 h-4 w-4" /> {t.uploadCover}
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/jpg"
                    className="hidden"
                  />
                  <Popover open={isLinkPopoverOpen} onOpenChange={setIsLinkPopoverOpen}>
                      <PopoverTrigger asChild>
                          <Button variant="outline"><LinkIcon className="mr-2 h-4 w-4" /> {t.addLink}</Button>
                      </PopoverTrigger>
                      <PopoverContent>
                          <div className="space-y-2">
                            <Label htmlFor="cover-link">{t.imageUrl}</Label>
                            <Input id="cover-link" value={coverLink} onChange={(e) => setCoverLink(e.target.value)} />
                            <Button onClick={handleAddLink} className="w-full">{t.add}</Button>
                          </div>
                      </PopoverContent>
                  </Popover>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="md:col-span-2 space-y-6">
            <h1 className="text-3xl font-bold">{t.storyDetails}</h1>
            
            <div>
              <Label htmlFor="title">{t.title}</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t.untitledStory} />
            </div>

            <div>
              <Label htmlFor="description">{t.description}</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t.synopsisPlaceholder} rows={6} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">{t.category}</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder={t.selectCategory} />
                  </SelectTrigger>
                  <SelectContent>
                    {['action', 'adventure', 'sciFi', 'fanfiction', 'fantasy', 'nonFiction', 'youngAdult', 'poetry', 'horror'].map(cat => (
                      <SelectItem key={cat} value={cat}>{t[cat]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
               <div>
                <Label htmlFor="language">{t.language}</Label>
                <Select value={storyLanguage} onValueChange={setStoryLanguage}>
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="pt">Português</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
                <Label htmlFor="tags">{t.tags}</Label>
                <TagInput tags={tags} setTags={setTags} t={t} />
            </div>

            <div>
              <Label htmlFor="copyright">{t.copyright}</Label>
              <Select value={copyright} onValueChange={setCopyright}>
                <SelectTrigger id="copyright">
                  <SelectValue placeholder={t.selectCopyright} />
                </SelectTrigger>
                <SelectContent>
                   <SelectItem value="all-rights-reserved">{t.allRightsReserved}</SelectItem>
                   <SelectItem value="public-domain">{t.publicDomain}</SelectItem>
                   <SelectItem value="cc-by">{t.ccBy}</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">{t.copyrightNotice}</p>
            </div>
          </div>
        </div>
      </main>

      <FloatingButtons />
      <Footer />
    </div>
  );
};

export default CreateStoryPage;
