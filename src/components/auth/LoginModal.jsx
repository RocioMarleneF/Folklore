import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const LoginModal = ({ isOpen, onClose, step, setStep, onSwitchToRegister, onGoogleLogin, onEmailLogin, t }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            {t.loginTitle}
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
                onClick={onGoogleLogin}
              >
                {t.loginWithGoogle}
              </Button>
              <Button
                className="w-full bg-[#0e345a] hover:bg-[#0e345a]/90 text-white"
                onClick={() => setStep('email')}
              >
                {t.loginWithEmail}
              </Button>
              <div className="text-center space-y-2">
                <button
                  className="text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => toast({ title: t.notImplemented, duration: 3000 })}
                >
                  {t.forgotPassword}
                </button>
                <p className="text-sm text-muted-foreground">
                  {t.noAccount.split('? ')[1] ? t.noAccount.split('? ')[0] + '?' : t.noAccount.split(' ')[0]}
                  <button
                    className="text-[#0e345a] hover:underline ml-1"
                    onClick={onSwitchToRegister}
                  >
                    {t.register}
                  </button>
                </p>
              </div>
            </>
          ) : (
            <form onSubmit={onEmailLogin} className="space-y-4">
              <div>
                <Label htmlFor="login-email">{t.email}</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder={t.email}
                  required
                />
              </div>
              <div>
                <Label htmlFor="login-password">{t.password}</Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t.password}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#0e345a] hover:bg-[#0e345a]/90 text-white"
              >
                {t.login}
              </Button>
              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => toast({ title: t.notImplemented, duration: 3000 })}
                >
                  {t.forgotPassword}
                </button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
