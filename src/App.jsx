import React, { useState, useEffect } from 'react';
import AppRouter from './router';
import MainLayout from './layouts/MainLayout';
import ScrollToTop from './components/common/ScrollToTop';
import LoadingSpinner from './components/common/LoadingSpinner';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Brief loading time for better UX

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="opacity-0 animate-fade-in">
      <ScrollToTop />
      <MainLayout>
        <AppRouter />
      </MainLayout>
    </div>
  );
};

export default App;
