import { createBrowserRouter, RouteObject } from 'react-router-dom';

// Layout
import { MainLayout } from './layouts/mainlayout';

// Public Pages
import { HomePage }      from './pages/HomePage';
import { ServicePage }   from './pages/ServicePage';
import { SubservicePage } from './pages/SubservicePage';
import { ProductPage }   from './pages/ProductPage';
import { QuotePage }     from './pages/QuotePage';
import { AboutPage }     from './pages/AboutPage';
import { ContactPage }   from './pages/ContactPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { StoryPage }     from './pages/StoryPage';
import { PrivacyPage }   from './pages/PrivacyPage';
import { TermsPage }     from './pages/TermsPage';
import { CookiesPage }   from './pages/CookiesPage';
import { DynamicPage }   from './pages/DynamicPage';

// Admin Pages
import { AdminLayout }        from './admin/AdminLayout';
import { AdminLogin }         from './admin/pages/AdminLogin';
import { AdminDashboard }     from './admin/pages/AdminDashboard';
import { AdminServices }      from './admin/pages/AdminServices';
import { AdminSubservices }   from './admin/pages/AdminSubservices';
import { AdminCategories }    from './admin/pages/AdminCategories';
import { AdminProducts }      from './admin/pages/AdminProducts';
import { AdminStories }       from './admin/pages/AdminStories';
import { AdminMainPage }      from './admin/pages/AdminMainPage';
import { AdminCompanyInfo }   from './admin/pages/AdminCompanyInfo';
import { AdminSubmissions }   from './admin/pages/AdminSubmissions';
import { AdminPartners }      from './admin/pages/AdminPartners';
import { AdminHeroSlides }    from './admin/pages/AdminHeroSlides';
import { AdminPageList }      from './admin/pages/AdminPageList';
import { AdminPageBuilder }   from './admin/pages/AdminPageBuilder';
import { AdminDesignTokens }  from './admin/pages/AdminDesignTokens';

const ErrorPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-gray-600 mb-8">Page not found</p>
      <a href="/" className="px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand-hover transition-colors">
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
      { path: 'services/:serviceSlug',       element: <ServicePage /> },
      { path: 'subservices/:subserviceSlug', element: <SubservicePage /> },
      { path: 'products/:productSlug',       element: <ProductPage /> },
      { path: 'quote',                       element: <QuotePage /> },
      { path: 'quote/:productSlug',          element: <QuotePage /> },
      { path: 'about',                       element: <AboutPage /> },
      { path: 'contact',                     element: <ContactPage /> },
      { path: 'portfolio',                   element: <PortfolioPage /> },
      { path: 'stories/:storySlug',          element: <StoryPage /> },
      { path: 'privacy',                     element: <PrivacyPage /> },
      { path: 'terms',                       element: <TermsPage /> },
      { path: 'cookies',                     element: <CookiesPage /> },
      { path: 'p/:slug',                     element: <DynamicPage /> },
    ],
  },
  // Admin Login (no layout)
  { path: '/admin/login', element: <AdminLogin /> },
  // Admin Panel (page builder is fullbleed — nested outside standard layout)
  { path: '/admin/pages/:pageId/edit', element: <AdminPageBuilder /> },
  { path: '/admin/pages/new',          element: <AdminPageBuilder /> },
  // Admin Panel (standard layout)
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true,                element: <AdminDashboard /> },
      { path: 'services',           element: <AdminServices /> },
      { path: 'subservices',        element: <AdminSubservices /> },
      { path: 'categories',         element: <AdminCategories /> },
      { path: 'products',           element: <AdminProducts /> },
      { path: 'stories',            element: <AdminStories /> },
      { path: 'main-page',          element: <AdminMainPage /> },
      { path: 'partners',           element: <AdminPartners /> },
      { path: 'company-info',       element: <AdminCompanyInfo /> },
      { path: 'submissions',        element: <AdminSubmissions /> },
      { path: 'hero-slides',        element: <AdminHeroSlides /> },
      { path: 'pages',              element: <AdminPageList /> },
      { path: 'design-tokens',      element: <AdminDesignTokens /> },
    ],
  },
];

export const router = createBrowserRouter(routes);

export const ROUTES = {
  HOME:       '/',
  SERVICE:    (slug: string) => `/services/${slug}`,
  SUBSERVICE: (slug: string) => `/subservices/${slug}`,
  PRODUCT:    (slug: string) => `/products/${slug}`,
  QUOTE:      '/quote',
  QUOTE_PRODUCT: (s: string) => `/quote/${s}`,
  ABOUT:      '/about',
  CONTACT:    '/contact',
  PORTFOLIO:  '/portfolio',
  STORY:      (slug: string) => `/stories/${slug}`,
  PAGE:       (slug: string) => `/p/${slug}`,
  // Admin
  ADMIN:                '/admin',
  ADMIN_LOGIN:          '/admin/login',
  ADMIN_SERVICES:       '/admin/services',
  ADMIN_SUBSERVICES:    '/admin/subservices',
  ADMIN_CATEGORIES:     '/admin/categories',
  ADMIN_PRODUCTS:       '/admin/products',
  ADMIN_STORIES:        '/admin/stories',
  ADMIN_MAIN_PAGE:      '/admin/main-page',
  ADMIN_PARTNERS:       '/admin/partners',
  ADMIN_COMPANY_INFO:   '/admin/company-info',
  ADMIN_SUBMISSIONS:    '/admin/submissions',
  ADMIN_PAGES:          '/admin/pages',
  ADMIN_PAGE_BUILDER:   (id?: string) => id ? `/admin/pages/${id}/edit` : '/admin/pages/new',
  ADMIN_DESIGN_TOKENS:  '/admin/design-tokens',
  // Legal
  PRIVACY:  '/privacy',
  TERMS:    '/terms',
  COOKIES:  '/cookies',
} as const;
