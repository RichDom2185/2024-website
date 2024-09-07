export enum Social {
  LINKEDIN = 'LinkedIn',
  GITHUB = 'GitHub',
  GITLAB = 'Gitlab',
  EMAIL = 'Email',
  WHATSAPP = 'WhatsApp',
  TIKTOK = 'TikTok',
  FACEBOOK = 'Facebook',
  TWITTER = 'Twitter',
  TELEGRAM = 'Telegram',
}

export const socialToIconMap = Object.freeze({
  [Social.LINKEDIN]: 'ri:linkedin-box-line',
  [Social.GITHUB]: 'ri:github-line',
  [Social.GITLAB]: 'ri:gitlab-line',
  [Social.EMAIL]: 'ri:mail-line',
  [Social.WHATSAPP]: 'ri:whatsapp-line',
  [Social.TIKTOK]: 'ri:tiktok-fill',
  [Social.FACEBOOK]: 'ri:facebook-circle-fill',
  [Social.TWITTER]: 'ri:twitter-x-fill',
  [Social.TELEGRAM]: 'ri:telegram-2-fill',
}) satisfies { [key in Social]: string };

export const socialToColorClassMap = Object.freeze({
  [Social.GITHUB]: 'hover:text-[#8250DF]',
  [Social.GITLAB]: 'hover:text-[#FC6D26]',
  [Social.LINKEDIN]: 'hover:text-[#0B66C2]',
  [Social.EMAIL]: 'hover:text-[#EA4336]',
  [Social.WHATSAPP]: 'hover:text-[#24D366]',
  [Social.TIKTOK]: 'hover:text-[#FF004F]',
  [Social.FACEBOOK]: 'hover:text-[#1877F2]',
  [Social.TWITTER]: 'hover:text-[#198CD8]',
  [Social.TELEGRAM]: 'hover:text-[#2AABEE]',
}) satisfies { [key in Social]: string };
