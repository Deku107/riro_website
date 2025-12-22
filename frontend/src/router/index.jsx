import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import ServicesPage from '../pages/ServicesPage';
import ProcessPage from '../pages/ProcessPage';
import TeamPage from '../pages/TeamPage';
import GalleryPage from '../pages/GalleryPage';
import GalleryDetailPage from '../pages/GalleryDetailPage';
import ShortFilmPage from '../pages/ShortFilmPage';
import DigitalCommercialsPage from '../pages/DigitalCommercialsPage';
import FeatureFilmsPage from '../pages/FeatureFilmsPage';
import CorporateVideosPage from '../pages/CorporateVideosPage';
import MusicVideosPage from '../pages/MusicVideosPage';
import AdminLoginPage from '../pages/AdminLoginPage';
import AdminDashboard from '../pages/AdminDashboard';
import AdminTeamPage from '../pages/AdminTeamPage';
import AdminServiceCardsPage from '../pages/AdminServiceCardsPage';
import AdminServiceDetailPage from '../pages/AdminServiceDetailPage';

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    {/* Redirect /about and /services to home for single-page experience */}
    <Route path="/about" element={<Navigate to="/" replace />} />
    <Route path="/services" element={<Navigate to="/" replace />} />
    {/* Service Detail Pages */}
    <Route path="/services/short-films" element={<ShortFilmPage />} />
    <Route path="/services/digital-commercials" element={<DigitalCommercialsPage />} />
    <Route path="/services/feature-films" element={<FeatureFilmsPage />} />
    <Route path="/services/corporate-videos" element={<CorporateVideosPage />} />
    <Route path="/services/music-videos" element={<MusicVideosPage />} />
    {/* Gallery Pages */}
    <Route path="/gallery" element={<Navigate to="/#gallery" replace />} />
    <Route path="/gallery/:galleryId" element={<GalleryDetailPage />} />
    {/* Separate pages */}
    <Route path="/process" element={<ProcessPage />} />
    <Route path="/team" element={<TeamPage />} />
    {/* Admin Routes */}
    <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
    <Route path="/admin/login" element={<AdminLoginPage />} />
    <Route path="/admin/dashboard" element={<AdminDashboard />} />
    <Route path="/admin/team" element={<AdminTeamPage />} />
    <Route path="/admin/service-cards" element={<AdminServiceCardsPage />} />
    <Route path="/admin/service/:serviceId" element={<AdminServiceDetailPage />} />
  </Routes>
);

export default AppRouter;
