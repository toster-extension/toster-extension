function browserName () {
    if (typeof chrome !== 'undefined') {
        // @ts-ignore-line
        if (typeof browser !== 'undefined') {
            return 'Firefox';
        }

        if (
            window.navigator.userAgent.toLowerCase().includes('opr') ||
            window.navigator.userAgent.toLowerCase().includes('opera')
        ) {
            return 'Opera';
        }

        return 'Chrome';
    }

    return 'Edge';
}

const isChrome = browserName() === 'Chrome';
const isOpera = browserName() === 'Opera';

export const HABR_URL = 'https://habr.com';
export const TOSTER_URL = 'https://qna.habr.com';
export const TOSTER_FEED_PATH = '/my/feed';
export const TOSTER_TRACKER_PATH = '/my/tracker';
export const TOSTER_QUESTION_PATH = '/q';

export const EXTENSION_URL = isChrome
    ? 'https://chrome.google.com/webstore/detail/toster-extension/edbifjhhbolcnccchgdenjnlidcoadae'
    : isOpera
    ? 'https://addons.opera.com/extensions/details/toster-extension'
    : 'https://addons.mozilla.org/firefox/addon/toster-extension';

export const FEEDBACK_URL = `${EXTENSION_URL}/reviews`;

export const CHAT_URL = `${HABR_URL}/conversations/yarkov`.toLowerCase();
