/**
 * OASIS Agent Queue names - shared constants
 */
export const OASIS_QUEUES = {
  SCHEDULING: 'oasis-scheduling',
  PRICING: 'oasis-pricing',
  DISPATCH: 'oasis-dispatch',
  SUPPORT: 'oasis-support',
  QUALITY: 'oasis-quality',
  ORCHESTRATOR: 'oasis-orchestrator',
} as const;

export type OasisQueueName = typeof OASIS_QUEUES[keyof typeof OASIS_QUEUES];
