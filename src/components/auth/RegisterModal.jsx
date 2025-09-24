import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Eye, EyeOff } from 'lucide-react';

const RegisterModal = ({ isOpen, onClose, step, setStep, onSwitchToLogin, onGoogleRegister, onEmailRegister, t }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            {t.registerTitle}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-4">
          {step === 'main' ? (
            <>
              <Button
                variant="outline"
                className="w-full"
                onClick={onGoogleRegister}
              >
                {t.registerWithGoogle}
              </Button>
              <Button
                className="w-full bg-[#0e345a] hover:bg-[#0e345a]/90 text-white"
                onClick={() => setStep('email')}
              >
                {t.registerWithEmail}
              </Button>
              <div className="text-center">
                <button
                  className="text-sm text-[#0e345a] hover:underline"
                  onClick={onSwitchToLogin}
                >
                  {t.haveAccount}
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={onEmailRegister} className="space-y-4">
              <div>
                <Label htmlFor="register-email">{t.email}</Label>
                <Input id="register-email" type="email" placeholder={t.email} required />
              </div>
              <div>
                <Label htmlFor="register-username">{t.username}</Label>
                <Input id="register-username" type="text" placeholder={t.username} required />
              </div>
              <div>
                <Label>{t.birthday}</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Select>
                    <SelectTrigger><SelectValue placeholder={t.day} /></SelectTrigger>
                    <SelectContent className="max-h-48">{Array.from({ length: 31 }, (_, i) => (<SelectItem key={i + 1} value={String(i + 1)}>{i + 1}</SelectItem>))}</SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger><SelectValue placeholder={t.month} /></SelectTrigger>
                    <SelectContent className="max-h-48">{Array.from({ length: 12 }, (_, i) => (<SelectItem key={i + 1} value={String(i + 1)}>{i + 1}</SelectItem>))}</SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger><SelectValue placeholder={t.year} /></SelectTrigger>
                    <SelectContent className="max-h-48">{Array.from({ length: 100 }, (_, i) => (<SelectItem key={2024 - i} value={String(2024 - i)}>{2024 - i}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="register-password">{t.password}</Label>
                <div className="relative">
                  <Input id="register-password" type={showPassword ? 'text' : 'password'} placeholder={t.password} required />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="register-confirm-password">{t.confirmPassword}</Label>
                <div className="relative">
                  <Input id="register-confirm-password" type={showConfirmPassword ? 'text' : 'password'} placeholder={t.confirmPassword} required />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-[#0e345a] hover:bg-[#0e345a]/90 text-white">
                {t.registerWithEmail}
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterModal;
