import { test as base, expect } from '@playwright/test';

/** Every test starts with analytics declined so the consent banner stays out of the way. */
export const test = base.extend<{ consent: 'denied' | 'granted' | null }>({
  consent: ['denied', { option: true }],
  page: async ({ page, consent }, provide) => {
    if (consent)
      await page.addInitScript((value) => window.localStorage.setItem('nf_consent', value), consent);
    await provide(page);
  },
});

export { expect };

export const isMobile = (projectName: string) => projectName === 'mobile';
