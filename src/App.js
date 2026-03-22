import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/tutorial/:id" element={<TutorialDetailPage />} />
              <Route path="/submit" element={<SubmitPage />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <Toast />
    </div>
  );
}

export default App;
