import React from 'react';
import AppRouter from './router';
import MainLayout from './layouts/MainLayout';
import ScrollToTop from './components/common/ScrollToTop';

const App = () => {
  return (
    <div>
      <ScrollToTop />
      <MainLayout>
        <AppRouter />
      </MainLayout>
    </div>
  );
};

export default App;
