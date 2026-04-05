'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc/client';
import { SEOErrorBoundary } from '@/components/seo-dashboard/error-boundary';
import { SEOOverview } from '@/components/seo-dashboard/seo-overview';
import { KeywordTable } from '@/components/seo-dashboard/keyword-table';
import { SiteAuditResults } from '@/components/seo-dashboard/site-audit-results';
import { EcommerceAudit } from '@/components/seo-dashboard/ecommerce-audit';
import { ApiKeyConfig } from '@/components/seo-dashboard/api-key-config';
import { BarChart3, Search, Link, Settings, Loader2, AlertCircle } from 'lucide-react';

const AUSTRALIAN_DOMAINS = ['cleanaus.com.au'];

export default function SEODashboardPage() {
  const [selectedDomain, setSelectedDomain] = useState(AUSTRALIAN_DOMAINS[0]);
  const [ahrefsKey, setAhrefsKey] = useState('');
  const [semrushKey, setSemrushKey] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'keywords' | 'backlinks' | 'audit' | 'ecommerce'>('overview');

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
    { id: 'keywords' as const, label: 'Keywords', icon: Search },
    { id: 'backlinks' as const, label: 'Backlinks', icon: Link },
    { id: 'audit' as const, label: 'Site Audit', icon: Search },
    { id: 'ecommerce' as const, label: 'E-commerce Audit', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">SEO Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Ahrefs & SEMrush integration for CleanAUS SEO analysis
          </p>
        </div>

        {/* API Key Configuration */}
        <SEOErrorBoundary>
          <ApiKeyConfig
            ahrefsKey={ahrefsKey}
            semrushKey={semrushKey}
            onAhrefsChange={setAhrefsKey}
            onSemrushChange={setSemrushKey}
          />
        </SEOErrorBoundary>

        {ahrefsKey && semrushKey ? (
          <>
            {/* Domain Selector */}
            <div className="mb-6 flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Domain:</label>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
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
            <SEOErrorBoundary>
              {activeTab === 'overview' && (
                <SEOOverview
                  domain={selectedDomain}
                  ahrefsKey={ahrefsKey}
                  semrushKey={semrushKey}
                />
              )}
              {activeTab === 'keywords' && (
                <KeywordTable
                  domain={selectedDomain}
                  ahrefsKey={ahrefsKey}
                />
              )}
              {activeTab === 'audit' && (
                <SiteAuditResults
                  domain={selectedDomain}
                  ahrefsKey={ahrefsKey}
                  semrushKey={semrushKey}
                />
              )}
              {activeTab === 'ecommerce' && (
                <EcommerceAudit
                  domain={selectedDomain}
                  ahrefsKey={ahrefsKey}
                  semrushKey={semrushKey}
                />
              )}
              {activeTab === 'backlinks' && (
                <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
                  <Link className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Backlinks Analysis</h3>
                  <p className="mt-2 text-gray-600">Coming soon - Backlink data visualization</p>
                </div>
              )}
            </SEOErrorBoundary>
          </>
        ) : (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-yellow-600" />
            <h3 className="mt-4 text-lg font-medium text-yellow-900">API Keys Required</h3>
            <p className="mt-2 text-yellow-700">
              Please configure your Ahrefs and SEMrush API keys above to view SEO data
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
