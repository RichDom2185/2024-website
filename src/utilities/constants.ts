const SOCIAL_LINKEDIN_URL: string = import.meta.env.SOCIAL_LINKEDIN_URL ?? '';

export const Constants = {
  social: {
    LINKEDIN_URL: SOCIAL_LINKEDIN_URL,
  },
} as const;
