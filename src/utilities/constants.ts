const BACKEND_URL: string =
  import.meta.env.PUBLIC_BACKEND_URL ?? 'http://localhost:4000';

const SOCIAL_EMAIL_URL: string = import.meta.env.SOCIAL_EMAIL_URL ?? '';
const SOCIAL_GITHUB_URL: string = import.meta.env.SOCIAL_GITHUB_URL ?? '';
const SOCIAL_GITLAB_URL: string = import.meta.env.SOCIAL_GITLAB_URL ?? '';
const SOCIAL_LINKEDIN_URL: string = import.meta.env.SOCIAL_LINKEDIN_URL ?? '';

export const Constants = {
  BACKEND_URL,
  social: {
    EMAIL_URL: SOCIAL_EMAIL_URL,
    GITHUB_URL: SOCIAL_GITHUB_URL,
    GITLAB_URL: SOCIAL_GITLAB_URL,
    LINKEDIN_URL: SOCIAL_LINKEDIN_URL,
  },
} as const;
