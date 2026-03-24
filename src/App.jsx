import React, { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import Toast from './components/Toast';
import LoadingSpinner from './components/LoadingSpinner';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import styles from './App.module.css';

const TutorialDetailPage = React.lazy(() => import('./pages/TutorialDetailPage'));
const SubmitPage = React.lazy(() => import('./pages/SubmitPage'));
const CategoryPage = React.lazy(() => import('./pages/CategoryPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));


const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.div>
);

function App() {
  const location = useLocation();
  return (
    <ThemeProvider>
      <div className={styles.app}>
        <Header />
        <main className={styles.main}>
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>

                <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
                <Route path="/search" element={<PageTransition><SearchPage /></PageTransition>} />
                <Route path="/tutorial/:id" element={<PageTransition><TutorialDetailPage /></PageTransition>} />
                <Route path="/submit" element={<PageTransition><SubmitPage /></PageTransition>} />
                <Route path="/category/:slug" element={<PageTransition><CategoryPage /></PageTransition>} />
                <Route path="/profile" element={<PageTransition><ProfilePage /></PageTransition>} />
                <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
                <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
                <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
                              </Routes>
              </AnimatePresence>
            </Suspense>
          </ErrorBoundary>
        </main>
        <Footer />
        <Toast />
      </div>
    </ThemeProvider>
  );
}

export default App;
