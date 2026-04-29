/**
 * ADMIN SUBMISSIONS PAGE
 * =======================
 * v2.1 — April 2026
 * Updated: display order_type, service_slug, client_role,
 *          material, volume, deadline, file_url for quote submissions
 */

import React, { useEffect, useState } from 'react';
import {
  Mail, MessageSquare, Check, Clock,
  ChevronDown, ChevronUp, ExternalLink, Tag,
} from 'lucide-react';
import {
  ContactSubmission, QuoteSubmission,
  getContactSubmissions, getQuoteSubmissions,
  markContactRead, markQuoteRead,
} from '../adminStore';

type TabType = 'contact' | 'quote';

const ORDER_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  'browse-and-order':      { label: 'Browse & Order',      color: 'bg-teal-100 text-teal-700' },
  'send-file-and-process': { label: 'Send File & Process', color: 'bg-amber-100 text-amber-700' },
  'describe-and-request':  { label: 'Describe & Request',  color: 'bg-purple-100 text-purple-700' },
};

const ROLE_LABELS: Record<string, string> = {
  designer:   'Architect / Designer',
  contractor: 'General Contractor',
  developer:  'Developer / Real Estate',
  private:    'Private Client',
};

export const AdminSubmissions: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('contact');
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [quotes, setQuotes] = useState<QuoteSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [contactData, quoteData] = await Promise.all([
        getContactSubmissions(),
        getQuoteSubmissions(),
      ]);
      setContacts(contactData);
      setQuotes(quoteData);
    } catch (error) {
      console.error('Failed to load:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleMarkRead = async (type: TabType, id: string) => {
    try {
      if (type === 'contact') {
        await markContactRead(id);
        setContacts((items) => items.map((item) => item.id === id ? { ...item, is_read: true } : item));
      } else {
        await markQuoteRead(id);
        setQuotes((items) => items.map((item) => item.id === id ? { ...item, is_read: true } : item));
      }
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const toggleExpand = (id: string) => setExpandedId(expandedId === id ? null : id);

  const unreadContacts = contacts.filter((c) => !c.is_read).length;
  const unreadQuotes   = quotes.filter((q) => !q.is_read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005f5f]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Submissions</h2>
        <p className="text-gray-500">Contact messages and order requests from the website</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('contact')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
            activeTab === 'contact'
              ? 'border-[#005f5f] text-[#005f5f]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Mail className="w-5 h-5" />
          Contact Messages
          {unreadContacts > 0 && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
              {unreadContacts}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('quote')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
            activeTab === 'quote'
              ? 'border-[#005f5f] text-[#005f5f]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          Order Requests
          {unreadQuotes > 0 && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
              {unreadQuotes}
            </span>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        {/* CONTACT TAB */}
        {activeTab === 'contact' && (
          contacts.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No contact messages yet</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {contacts.map((item) => (
                <div key={item.id} className={!item.is_read ? 'bg-blue-50/50' : ''}>
                  <div
                    className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleExpand(item.id)}
                  >
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${item.is_read ? 'bg-gray-300' : 'bg-blue-500'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{item.name}</span>
                        <span className="text-gray-400">·</span>
                        <span className="text-gray-500 text-sm">{item.email}</span>
                      </div>
                      <p className="text-gray-600 text-sm truncate">{item.subject || item.message}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>
                    {expandedId === item.id
                      ? <ChevronUp className="w-5 h-5 text-gray-400" />
                      : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </div>

                  {expandedId === item.id && (
                    <div className="px-4 pb-4 ml-7 border-l-2 border-gray-200">
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        {item.subject && (
                          <div>
                            <span className="text-xs text-gray-500 uppercase">Subject</span>
                            <p className="text-gray-900">{item.subject}</p>
                          </div>
                        )}
                        {item.phone && (
                          <div>
                            <span className="text-xs text-gray-500 uppercase">Phone</span>
                            <p className="text-gray-900">{item.phone}</p>
                          </div>
                        )}
                        <div>
                          <span className="text-xs text-gray-500 uppercase">Message</span>
                          <p className="text-gray-900 whitespace-pre-wrap">{item.message}</p>
                        </div>
                        {!item.is_read && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleMarkRead('contact', item.id); }}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#005f5f] hover:bg-[#005f5f]/10 rounded-lg transition-colors"
                          >
                            <Check className="w-4 h-4" />
                            Mark as Read
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}

        {/* QUOTE TAB */}
        {activeTab === 'quote' && (
          quotes.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No order requests yet</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {quotes.map((item) => {
                const orderTypeCfg = ORDER_TYPE_LABELS[item.order_type || ''];
                return (
                  <div key={item.id} className={!item.is_read ? 'bg-blue-50/50' : ''}>
                    <div
                      className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleExpand(item.id)}
                    >
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${item.is_read ? 'bg-gray-300' : 'bg-orange-500'}`} />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-gray-900">{item.name}</span>
                          {item.company && (
                            <>
                              <span className="text-gray-400">·</span>
                              <span className="text-gray-500 text-sm">{item.company}</span>
                            </>
                          )}
                          {orderTypeCfg && (
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${orderTypeCfg.color}`}>
                              {orderTypeCfg.label}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm truncate">
                          {item.service_slug || item.project_type || '—'}
                          {item.client_role ? ` · ${ROLE_LABELS[item.client_role] || item.client_role}` : ''}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {new Date(item.created_at).toLocaleDateString()}
                      </div>
                      {expandedId === item.id
                        ? <ChevronUp className="w-5 h-5 text-gray-400" />
                        : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </div>

                    {expandedId === item.id && (
                      <div className="px-4 pb-4 ml-7 border-l-2 border-gray-200">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="grid grid-cols-2 gap-4 mb-4">

                            {/* Contact */}
                            {item.phone && (
                              <div>
                                <span className="text-xs text-gray-500 uppercase">Phone</span>
                                <p className="text-gray-900">{item.phone}</p>
                              </div>
                            )}
                            {item.email && (
                              <div>
                                <span className="text-xs text-gray-500 uppercase">Email</span>
                                <p className="text-gray-900">{item.email}</p>
                              </div>
                            )}

                            {/* v2.0 structured fields */}
                            {item.order_type && (
                              <div>
                                <span className="text-xs text-gray-500 uppercase">Order Type</span>
                                <p className="text-gray-900">{item.order_type}</p>
                              </div>
                            )}
                            {item.service_slug && (
                              <div>
                                <span className="text-xs text-gray-500 uppercase">Service</span>
                                <p className="text-gray-900">{item.service_slug}</p>
                              </div>
                            )}
                            {item.client_role && (
                              <div>
                                <span className="text-xs text-gray-500 uppercase">Client Role</span>
                                <p className="text-gray-900">{ROLE_LABELS[item.client_role] || item.client_role}</p>
                              </div>
                            )}
                            {item.object_type && (
                              <div>
                                <span className="text-xs text-gray-500 uppercase">Object Type</span>
                                <p className="text-gray-900">{item.object_type}</p>
                              </div>
                            )}
                            {item.material && (
                              <div>
                                <span className="text-xs text-gray-500 uppercase">Material</span>
                                <p className="text-gray-900">{item.material}</p>
                              </div>
                            )}
                            {item.volume && (
                              <div>
                                <span className="text-xs text-gray-500 uppercase">Volume</span>
                                <p className="text-gray-900">{item.volume}</p>
                              </div>
                            )}
                            {item.deadline && (
                              <div>
                                <span className="text-xs text-gray-500 uppercase">Deadline</span>
                                <p className="text-gray-900">{item.deadline}</p>
                              </div>
                            )}

                            {/* Legacy fields */}
                            {item.project_type && !item.order_type && (
                              <div>
                                <span className="text-xs text-gray-500 uppercase">Project Type</span>
                                <p className="text-gray-900">{item.project_type}</p>
                              </div>
                            )}
                            {item.budget_range && (
                              <div>
                                <span className="text-xs text-gray-500 uppercase">Budget Range</span>
                                <p className="text-gray-900">{item.budget_range}</p>
                              </div>
                            )}
                            {item.timeline && !item.deadline && (
                              <div>
                                <span className="text-xs text-gray-500 uppercase">Timeline</span>
                                <p className="text-gray-900">{item.timeline}</p>
                              </div>
                            )}
                          </div>

                          {/* Products of interest */}
                          {item.product_interest && item.product_interest.length > 0 && (
                            <div className="mb-4">
                              <span className="text-xs text-gray-500 uppercase">Products</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {item.product_interest.map((prod, i) => (
                                  <span key={i} className="px-2 py-1 bg-white rounded text-sm border border-gray-200">
                                    {prod}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* File attachment */}
                          {item.file_url && (
                            <div className="mb-4">
                              <span className="text-xs text-gray-500 uppercase">Attached File</span>
                              <div className="mt-1">
                                <a
                                  href={item.file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-sm text-[#005f5f] hover:underline"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  View Attached File
                                </a>
                              </div>
                            </div>
                          )}

                          {/* Message / description */}
                          {item.message && (
                            <div className="mb-4">
                              <span className="text-xs text-gray-500 uppercase">
                                {item.order_type === 'describe-and-request' ? 'Project Description' : 'Message'}
                              </span>
                              <p className="text-gray-900 whitespace-pre-wrap mt-1 text-sm">{item.message}</p>
                            </div>
                          )}

                          {!item.is_read && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleMarkRead('quote', item.id); }}
                              className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#005f5f] hover:bg-[#005f5f]/10 rounded-lg transition-colors"
                            >
                              <Check className="w-4 h-4" />
                              Mark as Read
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
};
