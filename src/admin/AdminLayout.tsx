/**
 * ADMIN LAYOUT
 * =============
 * WordPress-like admin interface with sidebar navigation
 * 
 * UPDATES:
 * ✅ Added Partners navigation item
 */

import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  FolderTree,
  Grid3X3,
  Package,
  FileText,
  Image,
  Building2,
  Mail,
  LogOut,
  Menu,
  X,
  Monitor,
  Users,
} from 'lucide-react';
import { isAdminLoggedIn, adminLogout, getAdminSession } from './adminStore';

// Desktop-only gate component
const DesktopOnlyGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div className="min-h-screen bg-[#005f5f] flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl p-12 max-w-md text-center shadow-2xl">
          <Monitor className="w-20 h-20 text-[#005f5f] mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Desktop Required
          </h1>
          <p className="text-gray-600 mb-6">
            The HWOOD Admin Panel is optimized for desktop use. 
            Please access this page from a computer with a screen width of at least 1024px.
          </p>
          <Link 
            to="/"
            className="inline-block px-6 py-3 bg-[#005f5f] text-white rounded-lg hover:bg-[#004d4d] transition-colors"
          >
            Return to Website
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Navigation items - UPDATED with Partners
const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/admin/main-page', icon: Image, label: 'Main Page' },
  { path: '/admin/partners', icon: Users, label: 'Partners' },
  { path: '/admin/services', icon: Layers, label: 'Services' },
  { path: '/admin/subservices', icon: FolderTree, label: 'Subservices' },
  { path: '/admin/categories', icon: Grid3X3, label: 'Categories' },
  { path: '/admin/products', icon: Package, label: 'Products' },
  { path: '/admin/stories', icon: FileText, label: 'Stories' },
  { path: '/admin/company-info', icon: Building2, label: 'Company Info' },
  { path: '/admin/submissions', icon: Mail, label: 'Submissions' },
];

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const session = getAdminSession();

  // Check auth on mount
  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  if (!isAdminLoggedIn()) {
    return null; // Will redirect via useEffect
  }

  return (
    <DesktopOnlyGate>
      <div className="min-h-screen bg-gray-100 flex">
        {/* Sidebar */}
        <aside 
          className={`
            fixed top-0 left-0 h-full bg-[#1a1a2e] text-white z-40
            transition-all duration-300 flex flex-col
            ${sidebarOpen ? 'w-64' : 'w-20'}
          `}
        >
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
            {sidebarOpen && (
              <span className="text-xl font-bold text-[#00d4aa]">HWOOD Admin</span>
            )}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path, item.exact);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 mx-2 rounded-lg
                    transition-all duration-200
                    ${active 
                      ? 'bg-[#005f5f] text-white' 
                      : 'text-gray-400 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* User & Logout */}
          <div className="border-t border-white/10 p-4">
            {sidebarOpen && session && (
              <div className="mb-3 text-sm text-gray-400">
                {session.email}
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main 
          className={`
            flex-1 transition-all duration-300
            ${sidebarOpen ? 'ml-64' : 'ml-20'}
          `}
        >
          {/* Top Bar */}
          <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 sticky top-0 z-30">
            <h1 className="text-xl font-semibold text-gray-800">
              {navItems.find(item => isActive(item.path, item.exact))?.label || 'Admin'}
            </h1>
            <Link 
              to="/" 
              target="_blank"
              className="text-sm text-[#005f5f] hover:underline"
            >
              View Website →
            </Link>
          </header>

          {/* Page Content */}
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </DesktopOnlyGate>
  );
};
