'use client';

import { trpc } from '@/lib/trpc/client';
import { SEOErrorBoundary } from './error-boundary';
import { Loader2, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface SiteAuditResultsProps {
  domain: string;
  ahrefsKey: string;
  semrushKey: string;
}

export function SiteAuditResults({ domain, ahrefsKey, semrushKey }: SiteAuditResultsProps) {
  const ahrefsAudit = trpc.ahrefs.siteAudit.useQuery(
    { domain, apiKey: ahrefsKey },
    { enabled: !!ahrefsKey }
  );

  const semrushAudit = trpc.semrush.siteAudit.useQuery(
    { domain, apiKey: semrushKey },
    { enabled: !!semrushKey }
  );

  if (ahrefsAudit.isLoading || semrushAudit.isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-gray-600">Loading audit data...</span>
      </div>
    );
  }

  const ahrefsData = ahrefsAudit.data?.success ? ahrefsAudit.data.data : null;
  const semrushData = semrushAudit.data?.success ? semrushAudit.data.data : null;

  const healthScore = semrushData?.score || ahrefsData?.healthRating || 0;
  const healthColor = healthScore >= 80 ? '#22c55e' : healthScore >= 50 ? '#eab308' : '#ef4444';

  const pieData = [
    { name: 'Health', value: healthScore, fill: healthColor },
    { name: 'Issues', value: 100 - healthScore, fill: '#f3f4f6' },
  ];

  return (
    <SEOErrorBoundary>
      <div className="space-y-6">
        {/* Health Score */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Site Health Score</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                  >
                    <Cell fill={healthColor} />
                    <Cell fill="#f3f4f6" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-3xl font-bold" style={{ color: healthColor }}>
              {healthScore}%
            </p>
            <p className="text-center text-sm text-gray-500">Overall site health</p>
          </div>

          {/* Issues Summary */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Issues Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="font-medium">Errors</span>
                </div>
                <span className="text-2xl font-bold text-red-600">{semrushData?.errors || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium">Warnings</span>
                </div>
                <span className="text-2xl font-bold text-yellow-600">{semrushData?.warnings || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Passed</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">{semrushData?.crawledPages || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Comparison</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded">
              <p className="text-sm text-gray-500">Ahrefs Health Rating</p>
              <p className="text-2xl font-bold mt-1">{ahrefsData?.healthRating || 'N/A'}%</p>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <p className="text-sm text-gray-500">SEMrush Site Score</p>
              <p className="text-2xl font-bold mt-1">{semrushData?.score || 'N/A'}%</p>
            </div>
          </div>
        </div>
      </div>
    </SEOErrorBoundary>
  );
}
