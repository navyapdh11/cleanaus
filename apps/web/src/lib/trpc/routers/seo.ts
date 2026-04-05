import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../init';

// Zod schemas for input validation
const AhrefsApiKeySchema = z.string().min(10).max(128);
const SEMrushApiKeySchema = z.string().min(10).max(128);
const DomainSchema = z.string().regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);

// Ahrefs API integration
const ahrefsClient = {
  baseUrl: 'https://apiv2.ahrefs.com',
  
  async fetch(endpoint: string, params: Record<string, string>, apiKey: string) {
    const url = new URL(this.baseUrl);
    url.search = new URLSearchParams({
      token: apiKey,
      from: endpoint,
      output: 'json',
      limit: '100',
      ...params,
    }).toString();

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Ahrefs API error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  },

  async getSiteOverview(target: string, apiKey: string) {
    return this.fetch('ahrefs_rank', { target }, apiKey);
  },

  async getBacklinks(target: string, apiKey: string) {
    return this.fetch('backlinks', { target, mode: 'exact' }, apiKey);
  },

  async getOrganicKeywords(target: string, apiKey: string) {
    return this.fetch('organic', { target, mode: 'domain' }, apiKey);
  },

  async getSiteAudit(target: string, apiKey: string) {
    return this.fetch('site_audit', { target }, apiKey);
  },
};

// SEMrush API integration
const semrushClient = {
  baseUrl: 'https://api.semrush.com',
  
  async fetch(params: Record<string, string>, apiKey: string) {
    const url = new URL(this.baseUrl);
    url.search = new URLSearchParams({
      key: apiKey,
      output: 'json',
      ...params,
    }).toString();

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`SEMrush API error: ${response.status} ${response.statusText}`);
    }
    
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      // SEMrush sometimes returns CSV
      return text;
    }
  },

  async getDomainOverview(domain: string, apiKey: string) {
    return this.fetch({
      type: 'domain_rank',
      domain,
      database: 'au', // Australian database
    }, apiKey);
  },

  async getOrganicKeywords(domain: string, apiKey: string) {
    return this.fetch({
      type: 'domain_organic',
      domain,
      database: 'au',
      export_columns: 'Ph,Nq,Cp,Co,Po,Ps,Td,Ur',
    }, apiKey);
  },

  async getBacklinks(domain: string, apiKey: string) {
    return this.fetch({
      type: 'domain_backlinks',
      domain,
      database: 'au',
    }, apiKey);
  },

  async getSiteAudit(domain: string, apiKey: string) {
    return this.fetch({
      type: 'site_audit',
      domain,
    }, apiKey);
  },
};

// E-commerce specific keywords for Australian cleaning services
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
  'cleaning services qld',
];

// tRPC Router
export const seoRouter = router({
  // Ahrefs endpoints
  ahrefs: router({
    overview: protectedProcedure
      .input(z.object({
        domain: DomainSchema,
        apiKey: AhrefsApiKeySchema,
      }))
      .query(async ({ input }) => {
        try {
          const data = await ahrefsClient.getSiteOverview(input.domain, input.apiKey);
          return {
            success: true,
            data: {
              domain: input.domain,
              ahrefsRank: data.ahrefs_rank?.[0]?.ahrefs_rank || null,
              urlRating: data.ahrefs_rank?.[0]?.url_rating || null,
              backlinks: data.ahrefs_rank?.[0]?.backlinks || 0,
              referringDomains: data.ahrefs_rank?.[0]?.referring_domains || 0,
              organicKeywords: data.ahrefs_rank?.[0]?.organic_keywords || 0,
              organicTraffic: data.ahrefs_rank?.[0]?.organic_traffic || 0,
            },
            timestamp: new Date().toISOString(),
          };
        } catch (error: any) {
          return { success: false, error: error.message, timestamp: new Date().toISOString() };
        }
      }),

    organicKeywords: protectedProcedure
      .input(z.object({
        domain: DomainSchema,
        apiKey: AhrefsApiKeySchema,
      }))
      .query(async ({ input }) => {
        try {
          const data = await ahrefsClient.getOrganicKeywords(input.domain, input.apiKey);
          return {
            success: true,
            data: data.organic?.map((k: any) => ({
              keyword: k.keyword,
              position: k.position,
              volume: k.volume,
              traffic: k.traffic,
              difficulty: k.kd || 0,
              url: k.url,
            })) || [],
            timestamp: new Date().toISOString(),
          };
        } catch (error: any) {
          return { success: false, error: error.message, timestamp: new Date().toISOString() };
        }
      }),

    siteAudit: protectedProcedure
      .input(z.object({
        domain: DomainSchema,
        apiKey: AhrefsApiKeySchema,
      }))
      .query(async ({ input }) => {
        try {
          const data = await ahrefsClient.getSiteAudit(input.domain, input.apiKey);
          return {
            success: true,
            data: {
              domain: input.domain,
              internalUrls: data.internal_urls || 0,
              healthRating: data.health_rating || 0,
              issues: data.issues || [],
              crawledAt: data.crawled_at || null,
            },
            timestamp: new Date().toISOString(),
          };
        } catch (error: any) {
          return { success: false, error: error.message, timestamp: new Date().toISOString() };
        }
      }),

    ecommerceAudit: protectedProcedure
      .input(z.object({
        domain: DomainSchema,
        apiKey: AhrefsApiKeySchema,
      }))
      .query(async ({ input }) => {
        try {
          // Get organic keywords and filter for e-commerce relevance
          const keywordsData = await ahrefsClient.getOrganicKeywords(input.domain, input.apiKey);
          
          const ecommerceKeywords = (keywordsData.organic || []).filter((k: any) =>
            ECOMMERCE_KEYWORDS.some(keyword => 
              k.keyword.toLowerCase().includes(keyword.toLowerCase())
            )
          );

          const keywordPositions = ecommerceKeywords.map((k: any) => ({
            keyword: k.keyword,
            position: k.position,
            volume: k.volume,
            traffic: k.traffic,
            difficulty: k.kd || 0,
          }));

          // Calculate average position for tracked keywords
          const avgPosition = keywordPositions.length > 0
            ? keywordPositions.reduce((sum: number, k: any) => sum + k.position, 0) / keywordPositions.length
            : null;

          return {
            success: true,
            data: {
              domain: input.domain,
              trackedKeywords: ECOMMERCE_KEYWORDS,
              matchedKeywords: keywordPositions,
              averagePosition: avgPosition,
              totalVolume: keywordPositions.reduce((sum: number, k: any) => sum + (k.volume || 0), 0),
              recommendations: keywordPositions
                .filter((k: any) => k.position > 10 && k.volume > 100)
                .map((k: any) => ({
                  keyword: k.keyword,
                  currentPosition: k.position,
                  targetPosition: 10,
                  estimatedTrafficGain: k.volume * 0.05,
                })),
            },
            timestamp: new Date().toISOString(),
          };
        } catch (error: any) {
          return { success: false, error: error.message, timestamp: new Date().toISOString() };
        }
      }),
  }),

  // SEMrush endpoints
  semrush: router({
    overview: protectedProcedure
      .input(z.object({
        domain: DomainSchema,
        apiKey: SEMrushApiKeySchema,
      }))
      .query(async ({ input }) => {
        try {
          const data = await semrushClient.getDomainOverview(input.domain, input.apiKey);
          return {
            success: true,
            data: {
              domain: input.domain,
              authorityScore: data?.authority_score || null,
              organicTraffic: data?.organic_traffic || 0,
              keywords: data?.organic_keywords || 0,
              backlinks: data?.backlinks || 0,
              referringDomains: data?.referring_domains || 0,
            },
            timestamp: new Date().toISOString(),
          };
        } catch (error: any) {
          return { success: false, error: error.message, timestamp: new Date().toISOString() };
        }
      }),

    organicKeywords: protectedProcedure
      .input(z.object({
        domain: DomainSchema,
        apiKey: SEMrushApiKeySchema,
      }))
      .query(async ({ input }) => {
        try {
          const data = await semrushClient.getOrganicKeywords(input.domain, input.apiKey);
          return {
            success: true,
            data: Array.isArray(data) ? data.map((k: any) => ({
              keyword: k.Phrase || k.keyword || '',
              position: k.Position || k.position || 0,
              volume: k.Volume || k.volume || 0,
              cpc: k.Cpc || k.cpc || 0,
              competition: k.Competition || k.competition || 0,
              trend: k.Trend || k.trend || '',
            })) : [],
            timestamp: new Date().toISOString(),
          };
        } catch (error: any) {
          return { success: false, error: error.message, timestamp: new Date().toISOString() };
        }
      }),

    siteAudit: protectedProcedure
      .input(z.object({
        domain: DomainSchema,
        apiKey: SEMrushApiKeySchema,
      }))
      .query(async ({ input }) => {
        try {
          const data = await semrushClient.getSiteAudit(input.domain, input.apiKey);
          return {
            success: true,
            data: {
              domain: input.domain,
              score: data?.score || data?.percent || 0,
              errors: data?.errors || 0,
              warnings: data?.warnings || 0,
              notices: data?.notices || 0,
              crawledPages: data?.crawled_pages || 0,
            },
            timestamp: new Date().toISOString(),
          };
        } catch (error: any) {
          return { success: false, error: error.message, timestamp: new Date().toISOString() };
        }
      }),

    ecommerceAudit: protectedProcedure
      .input(z.object({
        domain: DomainSchema,
        apiKey: SEMrushApiKeySchema,
      }))
      .query(async ({ input }) => {
        try {
          const keywordsData = await semrushClient.getOrganicKeywords(input.domain, input.apiKey);
          const keywords = Array.isArray(keywordsData) ? keywordsData : [];
          
          const ecommerceKeywords = keywords.filter((k: any) =>
            ECOMMERCE_KEYWORDS.some(keyword =>
              (k.Phrase || '').toLowerCase().includes(keyword.toLowerCase())
            )
          );

          const keywordPositions = ecommerceKeywords.map((k: any) => ({
            keyword: k.Phrase || '',
            position: parseInt(k.Position) || 0,
            volume: parseInt(k.Volume) || 0,
            cpc: parseFloat(k.Cpc) || 0,
          }));

          const avgPosition = keywordPositions.length > 0
            ? keywordPositions.reduce((sum: number, k: any) => sum + k.position, 0) / keywordPositions.length
            : null;

          return {
            success: true,
            data: {
              domain: input.domain,
              trackedKeywords: ECOMMERCE_KEYWORDS,
              matchedKeywords: keywordPositions,
              averagePosition: avgPosition,
              totalVolume: keywordPositions.reduce((sum: number, k: any) => sum + k.volume, 0),
              recommendations: keywordPositions
                .filter((k: any) => k.position > 10 && k.volume > 100)
                .map((k: any) => ({
                  keyword: k.keyword,
                  currentPosition: k.position,
                  targetPosition: 10,
                  estimatedTrafficGain: k.volume * 0.05,
                  cpc: k.cpc,
                })),
            },
            timestamp: new Date().toISOString(),
          };
        } catch (error: any) {
          return { success: false, error: error.message, timestamp: new Date().toISOString() };
        }
      }),
  }),
});

export type SEORouter = typeof seoRouter;
