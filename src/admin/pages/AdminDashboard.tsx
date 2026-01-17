/**
 * ADMIN DASHBOARD
 * ================
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  FolderTree,
  Grid3X3,
  Package,
  FileText,
  Mail,
  MessageSquare,
  TrendingUp,
} from 'lucide-react';
import { getDashboardStats } from '../adminStore';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  link: string;
  color: string;
  badge?: number;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, link, color, badge }) => (
  <Link 
    to={link}
    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative"
  >
    {badge !== undefined && badge > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
        {badge}
      </span>
    )}
    <div className="flex items-center gap-4">
      <div 
        className="w-12 h-12 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  </Link>
);

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    services: 0,
    subservices: 0,
    categories: 0,
    products: 0,
    stories: 0,
    unreadContacts: 0,
    unreadQuotes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005f5f]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-[#005f5f] to-[#003d3d] rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome to HWOOD Admin</h2>
        <p className="text-white/80">
          Manage your website content, products, and customer inquiries from this dashboard.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Layers}
          label="Services"
          value={stats.services}
          link="/admin/services"
          color="#005f5f"
        />
        <StatCard
          icon={FolderTree}
          label="Subservices"
          value={stats.subservices}
          link="/admin/subservices"
          color="#2D5A5A"
        />
        <StatCard
          icon={Grid3X3}
          label="Categories"
          value={stats.categories}
          link="/admin/categories"
          color="#8B4513"
        />
        <StatCard
          icon={Package}
          label="Products"
          value={stats.products}
          link="/admin/products"
          color="#D48F28"
        />
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={FileText}
          label="Stories"
          value={stats.stories}
          link="/admin/stories"
          color="#6366f1"
        />
        <StatCard
          icon={Mail}
          label="Contact Messages"
          value={stats.unreadContacts}
          link="/admin/submissions"
          color="#ef4444"
          badge={stats.unreadContacts}
        />
        <StatCard
          icon={MessageSquare}
          label="Quote Requests"
          value={stats.unreadQuotes}
          link="/admin/submissions"
          color="#f59e0b"
          badge={stats.unreadQuotes}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#005f5f]" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/admin/products"
            className="p-4 border border-gray-200 rounded-lg hover:border-[#005f5f] hover:bg-[#005f5f]/5 transition-colors text-center"
          >
            <Package className="w-6 h-6 mx-auto mb-2 text-[#005f5f]" />
            <span className="text-sm text-gray-700">Add Product</span>
          </Link>
          <Link
            to="/admin/stories"
            className="p-4 border border-gray-200 rounded-lg hover:border-[#005f5f] hover:bg-[#005f5f]/5 transition-colors text-center"
          >
            <FileText className="w-6 h-6 mx-auto mb-2 text-[#005f5f]" />
            <span className="text-sm text-gray-700">Add Story</span>
          </Link>
          <Link
            to="/admin/hero-slides"
            className="p-4 border border-gray-200 rounded-lg hover:border-[#005f5f] hover:bg-[#005f5f]/5 transition-colors text-center"
          >
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-[#005f5f]" />
            <span className="text-sm text-gray-700">Edit Hero</span>
          </Link>
          <Link
            to="/admin/company-info"
            className="p-4 border border-gray-200 rounded-lg hover:border-[#005f5f] hover:bg-[#005f5f]/5 transition-colors text-center"
          >
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-[#005f5f]" />
            <span className="text-sm text-gray-700">Company Info</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
