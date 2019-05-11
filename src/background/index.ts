import { browser } from 'webextension-polyfill-ts';
import { App } from '@/libs/app';
import { NotificationsType } from '@/libs/types';
import { omniboxOnInputEnteredHandler } from './omnibox';
import { browserActionOnClickHandler } from './browser-icon';
import { contextMenusOnClickHandler } from './context-menu';

const app = new App();

browser.alarms.onAlarm.addListener((alarm) => {
    app.alarmHandler(alarm);
});

browser.notifications.onClicked.addListener((id) => {
    app.notifyHandler(<NotificationsType>id);
});

browser.browserAction.onClicked.addListener(browserActionOnClickHandler);

browser.omnibox.onInputEntered.addListener(omniboxOnInputEnteredHandler);

browser.contextMenus.onClicked.addListener(contextMenusOnClickHandler);

browser.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'update') {
        app.clearDataBase();
    }
});

if (process.env.NODE_ENV !== 'production') {
    const script = document.createElement('script');
    script.src = browser.runtime.getURL('hot-reload.js');
    document.head.appendChild(script);
}
