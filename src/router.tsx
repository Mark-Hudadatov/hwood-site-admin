/**
 * ROUTER CONFIGURATION — HWOOD v2.1
 * ====================================
 * Changes v2.1:
 *   + ThankYouPage route: /thank-you/:orderType
 *   + ROUTES.THANK_YOU helper
 */

import { createBrowserRouter, RouteObject } from 'react-router-dom';

// Layout
import { MainLayout } from './layouts/mainlayout';

// Public Pages
import { HomePage } from './pages/HomePage';
import { ServicePage } from './pages/ServicePage';
import { SubservicePage } from './pages/SubservicePage';
import { ProductPage } from './pages/ProductPage';
import { QuotePage } from './pages/QuotePage';
import { ThankYouPage } from './pages/ThankYouPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { StoryPage } from './pages/StoryPage';

// Admin Pages
import { AdminLayout } from './admin/AdminLayout';
import { AdminLogin } from './admin/pages/AdminLogin';
import { AdminDashboard } from './admin/pages/AdminDashboard';
import { AdminServices } from './admin/pages/AdminServices';
import { AdminSubservices } from './admin/pages/AdminSubservices';
import { AdminCategories } from './admin/pages/AdminCategories';
import { AdminProducts } from './admin/pages/AdminProducts';
import { AdminStories } from './admin/pages/AdminStories';
import { AdminMainPage } from './admin/pages/AdminMainPage';
import { AdminCompanyInfo } from './admin/pages/AdminCompanyInfo';
import { AdminSubmissions } from './admin/pages/AdminSubmissions';
import { AdminPartners } from './admin/pages/AdminPartners';

const ErrorPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-neutral-50">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-neutral-900 mb-4">404</h1>
      <p className="text-neutral-500 mb-8">Page not found</p>
      <a href="/" className="px-6 py-3 bg-brand text-white rounded-full hover:bg-teal-600 transition-colors font-semibold">
        Back to Home
      </a>
    </div>
  </div>
);

const routes: RouteObject[] = [
  // Public Routes
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'services/:serviceSlug', element: <ServicePage /> },
      { path: 'subservices/:subserviceSlug', element: <SubservicePage /> },
      { path: 'products/:productSlug', element: <ProductPage /> },
      { path: 'quote', element: <QuotePage /> },
      { path: 'quote/:productSlug', element: <QuotePage /> },
      // v2.1 — ThankYou route (all order types)
      { path: 'thank-you/:orderType', element: <ThankYouPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'portfolio', element: <PortfolioPage /> },
      { path: 'stories/:storySlug', element: <StoryPage /> },
    ],
  },
  // Admin Routes (unchanged)
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'services', element: <AdminServices /> },
      { path: 'subservices', element: <AdminSubservices /> },
      { path: 'categories', element: <AdminCategories /> },
      { path: 'products', element: <AdminProducts /> },
      { path: 'stories', element: <AdminStories /> },
      { path: 'main-page', element: <AdminMainPage /> },
      { path: 'partners', element: <AdminPartners /> },
      { path: 'company-info', element: <AdminCompanyInfo /> },
      { path: 'submissions', element: <AdminSubmissions /> },
    ],
  },
];

export const router = createBrowserRouter(routes);

// Route path constants
export const ROUTES = {
  HOME:       '/',
  SERVICE:    (slug: string) => `/services/${slug}`,
  SUBSERVICE: (slug: string) => `/subservices/${slug}`,
  PRODUCT:    (slug: string) => `/products/${slug}`,
  QUOTE:      '/quote',
  QUOTE_PRODUCT: (slug: string) => `/quote/${slug}`,
  THANK_YOU:  (orderType: string) => `/thank-you/${orderType}`,
  ABOUT:      '/about',
  CONTACT:    '/contact',
  PORTFOLIO:  '/portfolio',
  STORY:      (slug: string) => `/stories/${slug}`,
  ADMIN:      '/admin',
};
