import { browser } from 'webextension-polyfill-ts';
import { Storage } from '@/libs/storage';
import { StorageType } from '@/libs/types';
import { FeaturesCollection, IconClickEvents } from '@/features';
import { TOSTER_URL } from '@/libs/constants';

const storage = new Storage(StorageType.OPTIONS);

export const browserActionOnClickHandler = () => {
  const config = storage.getAll<FeaturesCollection>();

  switch (config.iconClickEvent) {
  case IconClickEvents.OPEN_TOSTER:
    browser.tabs.create({ url: TOSTER_URL });
    break;
  case IconClickEvents.OPEN_SETTINGS:
  default:
    browser.runtime.openOptionsPage();
    break;
  }
};
