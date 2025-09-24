import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import LoginModal from '@/components/auth/LoginModal';
import RegisterModal from '@/components/auth/RegisterModal';
import { useToast } from '@/components/ui/use-toast';
import { translations } from '@/lib/translations';
import { useLanguage } from '@/contexts/LanguageContext';

const AuthModals = () => {
  const { 
    isLoginOpen, 
    closeLoginModal,
    isRegisterOpen, 
    closeRegisterModal,
    openLoginModal,
    openRegisterModal,
    signIn,
    signUp
  } = useAuth();
  
  const [loginStep, setLoginStep] = useState('main');
  const [registerStep, setRegisterStep] = useState('main');

  const { toast } = useToast();
  const { language } = useLanguage();
  const t = translations[language];

  const handleSwitchToRegister = () => {
    closeLoginModal();
    openRegisterModal();
    setLoginStep('main');
  };

  const handleSwitchToLogin = () => {
    closeRegisterModal();
    openLoginModal();
    setRegisterStep('main');
  };
  
  const handleGoogleAuth = () => {
    toast({
      title: t.notImplemented,
      duration: 3000,
    });
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    const email = e.target.elements['login-email'].value;
    const password = e.target.elements['login-password'].value;
    await signIn(email, password);
  };

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    const email = e.target.elements['register-email'].value;
    const username = e.target.elements['register-username'].value;
    const password = e.target.elements['register-password'].value;
    const confirmPassword = e.target.elements['register-confirm-password'].value;

    if (password !== confirmPassword) {
      toast({ title: t.passwordsDoNotMatch, variant: "destructive", duration: 3000 });
      return;
    }

    const { error } = await signUp(email, password, username);
    if (!error) {
      closeRegisterModal();
      setRegisterStep('main');
    }
  };


  return (
    <>
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => { closeLoginModal(); setLoginStep('main'); }}
        step={loginStep}
        setStep={setLoginStep}
        onSwitchToRegister={handleSwitchToRegister}
        onGoogleLogin={handleGoogleAuth}
        onEmailLogin={handleEmailLogin}
        t={t}
      />
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => { closeRegisterModal(); setRegisterStep('main'); }}
        step={registerStep}
        setStep={setRegisterStep}
        onSwitchToLogin={handleSwitchToLogin}
        onGoogleRegister={handleGoogleAuth}
        onEmailRegister={handleEmailRegister}
        t={t}
      />
    </>
  );
};

export default AuthModals;
