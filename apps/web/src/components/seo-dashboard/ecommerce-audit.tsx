'use client';

import { trpc } from '@/lib/trpc/client';
import { SEOErrorBoundary } from './error-boundary';
import { Loader2, TrendingUp, Target, DollarSign, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface EcommerceAuditProps {
  domain: string;
  ahrefsKey: string;
  semrushKey: string;
}

const ECOMMERCE_KEYWORDS = [
  'bond cleaning sydney',
  'end of lease cleaning melbourne',
  'commercial cleaning brisbane',
  'strata cleaning perth',
  'office cleaning adelaide',
  'carpet cleaning hobart',
  'window cleaning canberra',
  'industrial cleaning darwin',
  'cleaning services nsw',
  'cleaning services vic',
];

export function EcommerceAudit({ domain, ahrefsKey, semrushKey }: EcommerceAuditProps) {
  const ahrefsEcom = trpc.ahrefs.ecommerceAudit.useQuery(
    { domain, apiKey: ahrefsKey },
    { enabled: !!ahrefsKey }
  );

  const semrushEcom = trpc.semrush.ecommerceAudit.useQuery(
    { domain, apiKey: semrushKey },
    { enabled: !!semrushKey }
  );

  if (ahrefsEcom.isLoading || semrushEcom.isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-gray-600">Loading e-commerce audit...</span>
      </div>
    );
  }

  const ahrefsData = ahrefsEcom.data?.success ? ahrefsEcom.data.data : null;
  const semrushData = semrushEcom.data?.success ? semrushEcom.data.data : null;

  const chartData = ECOMMERCE_KEYWORDS.map((keyword) => {
    const ahrefsMatch = ahrefsData?.matchedKeywords?.find(
      (k: any) => k.keyword.toLowerCase().includes(keyword.toLowerCase())
    );
    const semrushMatch = semrushData?.matchedKeywords?.find(
      (k: any) => k.keyword.toLowerCase().includes(keyword.toLowerCase())
    );
    return {
      keyword: keyword.substring(0, 20) + '...',
      ahrefsPosition: ahrefsMatch?.position || 0,
      semrushPosition: semrushMatch?.position || 0,
    };
  });

  return (
    <SEOErrorBoundary>
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-3">
              <Target className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm text-gray-500">Avg. Position</p>
                <p className="text-2xl font-bold">
                  {ahrefsData?.averagePosition ? Math.round(ahrefsData.averagePosition) : 'N/A'}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <div>
                <p className="text-sm text-gray-500">Matched Keywords</p>
                <p className="text-2xl font-bold">
                  {ahrefsData?.matchedKeywords?.length || 0} / {ECOMMERCE_KEYWORDS.length}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-3">
              <DollarSign className="h-6 w-6 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-500">Total Volume</p>
                <p className="text-2xl font-bold">
                  {ahrefsData?.totalVolume?.toLocaleString() || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Keyword Positions Chart */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold mb-4">Keyword Position Comparison</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="keyword" tick={{ fontSize: 10 }} />
                <YAxis reversed />
                <Tooltip />
                <Bar dataKey="ahrefsPosition" fill="#0284c7" name="Ahrefs Position" />
                <Bar dataKey="semrushPosition" fill="#16a34a" name="SEMrush Position" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recommendations */}
        {ahrefsData?.recommendations?.length > 0 && (
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold mb-4">Optimization Recommendations</h3>
            <div className="space-y-3">
              {ahrefsData?.recommendations?.map((rec: any, index: number) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium">"{rec.keyword}"</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Current position: #{rec.currentPosition} → Target: Top {rec.targetPosition}
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      Estimated traffic gain: +{Math.round(rec.estimatedTrafficGain)} visits/month
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SEOErrorBoundary>
  );
}
