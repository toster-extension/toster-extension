import { browser } from 'webextension-polyfill-ts';
import { TOSTER_URL } from '@/libs/constants';

export const omniboxOnInputEnteredHandler = (search: string) => {
  const url = `${TOSTER_URL}/search?q=${encodeURIComponent(search)}`;

  browser.tabs.query({ active: true }).then((activeTabs) => {
    const tab = activeTabs[0];
    browser.tabs.update(tab.id, { url });
  });
};
