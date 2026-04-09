'use client';

import { useState } from 'react';
import { SEOErrorBoundary } from '@/components/seo-dashboard/error-boundary';
import { SEOOverview } from '@/components/seo-dashboard/seo-overview';
import { KeywordTable } from '@/components/seo-dashboard/keyword-table';
import { SiteAuditResults } from '@/components/seo-dashboard/site-audit-results';
import { EcommerceAudit } from '@/components/seo-dashboard/ecommerce-audit';
import { BarChart3, Search, Link, Settings, AlertCircle } from 'lucide-react';

const AUSTRALIAN_DOMAINS = ['cleanaus.com.au'];

export default function SEODashboardPage() {
  const [selectedDomain, setSelectedDomain] = useState(AUSTRALIAN_DOMAINS[0]);
  const [activeTab, setActiveTab] = useState<'overview' | 'keywords' | 'backlinks' | 'audit' | 'ecommerce'>('overview');

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
    { id: 'keywords' as const, label: 'Keywords', icon: Search },
    { id: 'backlinks' as const, label: 'Backlinks', icon: Link },
    { id: 'audit' as const, label: 'Site Audit', icon: Search },
    { id: 'ecommerce' as const, label: 'E-commerce Audit', icon: BarChart3 },
  ];

  // API keys are now server-side (env vars), no client-side config needed
  const isConfigured = true;

  return (
    <div className="min-h-screen bg-bg">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">SEO Dashboard</h1>
          <p className="mt-2 text-white/60">
            Ahrefs & SEMrush integration for CleanAUS SEO analysis
          </p>
        </div>

        {/* Domain Selector */}
        <div className="mb-6 flex items-center gap-4">
          <label className="text-sm font-medium text-white/70">Domain:</label>
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
          >
            {AUSTRALIAN_DOMAINS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {isConfigured ? (
          <SEOErrorBoundary>
            {activeTab === 'overview' && (
              <SEOOverview domain={selectedDomain} />
            )}
            {activeTab === 'keywords' && (
              <KeywordTable domain={selectedDomain} />
            )}
            {activeTab === 'audit' && (
              <SiteAuditResults domain={selectedDomain} />
            )}
            {activeTab === 'ecommerce' && (
              <EcommerceAudit domain={selectedDomain} />
            )}
            {activeTab === 'backlinks' && (
              <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
                <Link className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">Backlinks Analysis</h3>
                <p className="mt-2 text-gray-600">Coming soon - Backlink data visualization</p>
              </div>
            )}
          </SEOErrorBoundary>
        ) : (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-yellow-600" />
            <h3 className="mt-4 text-lg font-medium text-yellow-900">API Not Configured</h3>
            <p className="mt-2 text-yellow-700">
              Please configure AHREFS_API_KEY and SEMRUSH_API_KEY environment variables on the server.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
