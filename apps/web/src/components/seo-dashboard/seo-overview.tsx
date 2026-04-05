'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { trpc } from '@/lib/trpc/client';
import { SEOErrorBoundary } from './error-boundary';
import { Loader2, TrendingUp, TrendingDown, Link, Search } from 'lucide-react';

interface SEOOverviewProps {
  domain: string;
  ahrefsKey: string;
  semrushKey: string;
}

export function SEOOverview({ domain, ahrefsKey, semrushKey }: SEOOverviewProps) {
  const ahrefsOverview = trpc.ahrefs.overview.useQuery(
    { domain, apiKey: ahrefsKey },
    { enabled: !!ahrefsKey }
  );

  const semrushOverview = trpc.semrush.overview.useQuery(
    { domain, apiKey: semrushKey },
    { enabled: !!semrushKey }
  );

  if (ahrefsOverview.isLoading || semrushOverview.isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-gray-600">Loading SEO data...</span>
      </div>
    );
  }

  const ahrefsData = ahrefsOverview.data?.success ? ahrefsOverview.data.data : null;
  const semrushData = semrushOverview.data?.success ? semrushOverview.data.data : null;

  const metrics = [
    {
      label: 'Domain Authority',
      ahrefs: ahrefsData?.ahrefsRank || '-',
      semrush: semrushData?.authorityScore || '-',
      icon: TrendingUp,
    },
    {
      label: 'Backlinks',
      ahrefs: ahrefsData?.backlinks?.toLocaleString() || '-',
      semrush: semrushData?.backlinks?.toLocaleString() || '-',
      icon: Link,
    },
    {
      label: 'Organic Keywords',
      ahrefs: ahrefsData?.organicKeywords?.toLocaleString() || '-',
      semrush: semrushData?.keywords?.toLocaleString() || '-',
      icon: Search,
    },
    {
      label: 'Organic Traffic',
      ahrefs: ahrefsData?.organicTraffic?.toLocaleString() || '-',
      semrush: semrushData?.organicTraffic?.toLocaleString() || '-',
      icon: TrendingDown,
    },
  ];

  // Chart data for comparison
  const chartData = [
    { metric: 'Backlinks', ahrefs: ahrefsData?.backlinks || 0, semrush: semrushData?.backlinks || 0 },
    { metric: 'Keywords', ahrefs: ahrefsData?.organicKeywords || 0, semrush: semrushData?.keywords || 0 },
    { metric: 'Traffic', ahrefs: ahrefsData?.organicTraffic || 0, semrush: semrushData?.organicTraffic || 0 },
  ].filter(item => item.ahrefs > 0 || item.semrush > 0);

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <metric.icon className="h-6 w-6 text-primary" />
              <span className="text-xs font-medium text-gray-500">Ahrefs vs SEMrush</span>
            </div>
            <h3 className="mt-4 text-sm font-medium text-gray-500">{metric.label}</h3>
            <div className="mt-2 space-y-1">
              <p className="text-lg font-bold text-gray-900">
                {metric.ahrefs} <span className="text-xs font-normal text-gray-500">(Ahrefs)</span>
              </p>
              <p className="text-lg font-bold text-gray-900">
                {metric.semrush} <span className="text-xs font-normal text-gray-500">(SEMrush)</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Chart */}
      {ahrefsData || semrushData ? (
        <SEOErrorBoundary>
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Source Comparison</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="metric" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="ahrefs" fill="#0284c7" name="Ahrefs" />
                  <Bar dataKey="semrush" fill="#16a34a" name="SEMrush" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </SEOErrorBoundary>
      ) : null}

      {/* Errors */}
      {(!ahrefsOverview.data?.success || !semrushOverview.data?.success) && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">
            {!ahrefsOverview.data?.success && ahrefsOverview.data?.error}
            {!semrushOverview.data?.success && semrushOverview.data?.error}
          </p>
        </div>
      )}
    </div>
  );
}
