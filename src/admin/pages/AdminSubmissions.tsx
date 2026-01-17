/**
 * ADMIN SUBMISSIONS PAGE
 * =======================
 * View contact and quote form submissions
 */

import React, { useEffect, useState } from 'react';
import { Mail, MessageSquare, Check, Clock, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import {
  ContactSubmission,
  QuoteSubmission,
  getContactSubmissions,
  getQuoteSubmissions,
  markContactRead,
  markQuoteRead,
} from '../adminStore';

type TabType = 'contact' | 'quote';

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

  useEffect(() => {
    loadData();
  }, []);

  const handleMarkRead = async (type: TabType, id: string) => {
    try {
      if (type === 'contact') {
        await markContactRead(id);
        setContacts(items => 
          items.map(item => item.id === id ? { ...item, is_read: true } : item)
        );
      } else {
        await markQuoteRead(id);
        setQuotes(items => 
          items.map(item => item.id === id ? { ...item, is_read: true } : item)
        );
      }
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const unreadContacts = contacts.filter(c => !c.is_read).length;
  const unreadQuotes = quotes.filter(q => !q.is_read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005f5f]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Submissions</h2>
        <p className="text-gray-500">Contact messages and quote requests from website visitors</p>
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
          Quote Requests
          {unreadQuotes > 0 && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
              {unreadQuotes}
            </span>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {activeTab === 'contact' ? (
          contacts.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No contact messages yet
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {contacts.map((item) => (
                <div
                  key={item.id}
                  className={`${!item.is_read ? 'bg-blue-50/50' : ''}`}
                >
                  <div 
                    className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleExpand(item.id)}
                  >
                    {/* Status */}
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      item.is_read ? 'bg-gray-300' : 'bg-blue-500'
                    }`} />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{item.name}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500 text-sm">{item.email}</span>
                      </div>
                      <p className="text-gray-600 text-sm truncate">
                        {item.subject || item.message}
                      </p>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>

                    {/* Expand */}
                    {expandedId === item.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>

                  {/* Expanded Content */}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkRead('contact', item.id);
                            }}
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
        ) : (
          quotes.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No quote requests yet
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {quotes.map((item) => (
                <div
                  key={item.id}
                  className={`${!item.is_read ? 'bg-blue-50/50' : ''}`}
                >
                  <div 
                    className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleExpand(item.id)}
                  >
                    {/* Status */}
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      item.is_read ? 'bg-gray-300' : 'bg-orange-500'
                    }`} />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{item.name}</span>
                        {item.company && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500 text-sm">{item.company}</span>
                          </>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">
                        {item.project_type} {item.budget_range && `• Budget: ${item.budget_range}`}
                      </p>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>

                    {/* Expand */}
                    {expandedId === item.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>

                  {/* Expanded Content */}
                  {expandedId === item.id && (
                    <div className="px-4 pb-4 ml-7 border-l-2 border-gray-200">
                      <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs text-gray-500 uppercase">Email</span>
                          <p className="text-gray-900">{item.email}</p>
                        </div>
                        {item.phone && (
                          <div>
                            <span className="text-xs text-gray-500 uppercase">Phone</span>
                            <p className="text-gray-900">{item.phone}</p>
                          </div>
                        )}
                        {item.project_type && (
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
                        {item.timeline && (
                          <div>
                            <span className="text-xs text-gray-500 uppercase">Timeline</span>
                            <p className="text-gray-900">{item.timeline}</p>
                          </div>
                        )}
                        {item.product_interest && item.product_interest.length > 0 && (
                          <div className="col-span-2">
                            <span className="text-xs text-gray-500 uppercase">Products of Interest</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {item.product_interest.map((prod, i) => (
                                <span key={i} className="px-2 py-1 bg-white rounded text-sm">
                                  {prod}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {item.message && (
                          <div className="col-span-2">
                            <span className="text-xs text-gray-500 uppercase">Message</span>
                            <p className="text-gray-900 whitespace-pre-wrap">{item.message}</p>
                          </div>
                        )}
                        
                        {!item.is_read && (
                          <div className="col-span-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkRead('quote', item.id);
                              }}
                              className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#005f5f] hover:bg-[#005f5f]/10 rounded-lg transition-colors"
                            >
                              <Check className="w-4 h-4" />
                              Mark as Read
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};
