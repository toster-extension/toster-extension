import { browser } from 'webextension-polyfill-ts';
import { CHAT_URL, FEEDBACK_URL } from '@/libs/constants';

const setUpContextMenus = () => {
    const items = [
        {
            i18nKey: 'contextMenuFeedback',
            id: 'feedback',
        },
        {
            i18nKey: 'contextMenuSendPM',
            id: 'author_pm',
        },
    ];

    items.forEach((item) => {
        browser.contextMenus.create({
            title: browser.i18n.getMessage(item.i18nKey),
            id: item.id,
            type: 'normal',
            documentUrlPatterns: ['*://*/*'],
            contexts: ['browser_action'],
        });
    });
};

export const contextMenusOnClickHandler = (item) => {
    switch (item.menuItemId) {
        case 'feedback':
        default:
            browser.tabs.create({
                url: FEEDBACK_URL,
            });
            break;
        case 'author_pm':
            browser.tabs.create({
                url: CHAT_URL,
            });
            break;
    }
};

setUpContextMenus();
