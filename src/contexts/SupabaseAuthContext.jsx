import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext(undefined);

export const SupabaseAuthProvider = ({ children }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const openLoginModal = () => setIsLoginOpen(true);
  const closeLoginModal = () => setIsLoginOpen(false);
  const openRegisterModal = () => setIsRegisterOpen(true);
  const closeRegisterModal = () => setIsRegisterOpen(false);

  const fetchProfile = useCallback(async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // Ignore 'no rows found' error
      console.error('Error fetching profile:', error);
    }
    return data;
  }, []);

  const handleSession = useCallback(async (session) => {
    setSession(session);
    const currentUser = session?.user ?? null;
    setUser(currentUser);
    if (currentUser) {
      const userProfile = await fetchProfile(currentUser.id);
      setProfile(userProfile);
    } else {
      setProfile(null);
    }
    setLoading(false);
  }, [fetchProfile]);
  
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      await handleSession(session);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          await handleSession(session);
          navigate('/home');
        } else if (event === 'SIGNED_OUT') {
          await handleSession(null);
          navigate('/');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [handleSession, navigate]);


  const signUp = useCallback(async (email, password, username) => {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        },
        emailRedirectTo: `${window.location.origin}/home`,
      },
    });

    if (signUpError) {
      toast({
        variant: "destructive",
        title: "Registro fallido",
        description: signUpError.message || "Algo salió mal",
      });
      return { error: signUpError };
    }

    if (signUpData.user && signUpData.user.identities && signUpData.user.identities.length === 0) {
      toast({
        variant: "destructive",
        title: "Usuario ya registrado",
        description: "Este correo electrónico ya está en uso. Por favor, intenta iniciar sesión.",
      });
      return { error: { message: "User already exists" } };
    }
    
    toast({
      title: "¡Revisa tu correo!",
      description: "Te hemos enviado un enlace de confirmación para activar tu cuenta.",
    });

    return { user: signUpData.user, error: null };
  }, [toast]);


  const signIn = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Inicio de sesión fallido",
        description: error.message || "Credenciales incorrectas.",
      });
    } else {
      toast({
        title: "¡Bienvenido de nuevo!",
      });
      closeLoginModal();
    }
    return { error };
  }, [toast, closeLoginModal]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Cierre de sesión fallido",
        description: error.message || "Algo salió mal",
      });
    }
    return { error };
  }, [toast]);

  const value = useMemo(() => ({
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    isLoginOpen,
    openLoginModal,
    closeLoginModal,
    isRegisterOpen,
    openRegisterModal,
    closeRegisterModal,
  }), [user, session, profile, loading, signUp, signIn, signOut, isLoginOpen, isRegisterOpen]);

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
