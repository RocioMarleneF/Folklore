import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { translations } from '@/lib/translations';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { language, setLanguage } = useLanguage();
  const t = translations[language] || translations.es;
  const { toast } = useToast();

  const showNotImplementedToast = () => {
    toast({ title: t.notImplemented, duration: 3000 });
  };

  const openLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="bg-[#0e345a] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <span className="text-lg font-semibold mb-4 block">{t.quickLinks}</span>
            <div className="space-y-2">
              <button className="block text-white/80 hover:text-white transition-colors" onClick={showNotImplementedToast}>{t.about}</button>
              <button className="block text-white/80 hover:text-white transition-colors" onClick={showNotImplementedToast}>{t.terms}</button>
              <button className="block text-white/80 hover:text-white transition-colors" onClick={showNotImplementedToast}>{t.privacy}</button>
              <button className="block text-white/80 hover:text-white transition-colors" onClick={showNotImplementedToast}>{t.help}</button>
            </div>
          </div>
          <div>
            <span className="text-lg font-semibold mb-4 block">{t.socialMedia}</span>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-white hover:text-white/80" onClick={() => openLink('https://www.facebook.com/folklorepl')}><Facebook className="w-5 h-5" /></Button>
              <Button variant="ghost" size="icon" className="text-white hover:text-white/80" onClick={() => openLink('https://x.com/Folklorepl')}><Twitter className="w-5 h-5" /></Button>
              <Button variant="ghost" size="icon" className="text-white hover:text-white/80" onClick={() => openLink('https://www.instagram.com/folklore.plataforma.literaria/')}><Instagram className="w-5 h-5" /></Button>
              <Button variant="ghost" size="icon" className="text-white hover:text-white/80" onClick={() => openLink('https://www.youtube.com/@FolklorePlataformaLiteraria')}><Youtube className="w-5 h-5" /></Button>
            </div>
          </div>
          <div>
            <span className="text-lg font-semibold mb-4 block">{t.language}</span>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-40 bg-white text-black">
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
      </div>
    </footer>
  );
};

export default Footer;
