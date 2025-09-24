import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { SupabaseAuthProvider } from '@/contexts/SupabaseAuthContext';
import { useAuth } from '@/hooks/useAuth';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import LandingPage from '@/pages/LandingPage';
import HomePage from '@/pages/HomePage';
import ProfilePage from '@/pages/ProfilePage';
import CreateStoryPage from '@/pages/CreateStoryPage';
import EditStoryPage from '@/pages/EditStoryPage';
import WriterPage from '@/pages/WriterPage';
import MyStoriesPage from '@/pages/MyStoriesPage';
import AuthModals from '@/components/auth/AuthModals';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PublicHomePage from '@/pages/PublicHomePage';

// This component prevents redirection on tab focus/refocus
const LocationChangeObserver = () => {
    const { session } = useAuth();
    const location = useLocation();

    useEffect(() => {
        // This effect only runs on location changes, not session changes.
        // It prevents re-routing when Supabase re-authenticates in the background.
    }, [location.pathname, session]);

    return null;
}


function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <Router>
          <SupabaseAuthProvider>
            <AppContent />
          </SupabaseAuthProvider>
        </Router>
      </ThemeProvider>
    </LanguageProvider>
  );
}

// We need to wrap the content in a separate component to use the useAuth hook
// which requires being inside the SupabaseAuthProvider.
const AppContent = () => {
  return (
    <>
      <LocationChangeObserver />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile/:username"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/story/new"
          element={
            <ProtectedRoute>
              <CreateStoryPage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/story/edit/:storyId"
          element={
            <ProtectedRoute>
              <EditStoryPage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/story/edit/:storyId/chapter/:chapterId"
          element={
            <ProtectedRoute>
              <WriterPage />
            </ProtectedRoute>
          }
        />
         <Route 
          path="/my-stories"
          element={
            <ProtectedRoute>
              <MyStoriesPage />
            </ProtectedRoute>
          }
        />
        <Route path="/home/public" element={<PublicHomePage />} />
      </Routes>
      <AuthModals />
      <Toaster />
    </>
  );
};

export default App;
