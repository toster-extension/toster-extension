function browserName () {
    if (typeof chrome !== 'undefined') {
        // @ts-ignore-line
        if (typeof browser !== 'undefined') {
            return 'Firefox';
        }

        return 'Chrome';
    }

    return 'Edge';
}

const isChrome = browserName() === 'Chrome';

export const HABR_URL = 'https://habr.com';
export const TOSTER_URL = 'https://toster.ru';
export const TOSTER_FEED_PATH = '/my/feed';
export const TOSTER_TRACKER_PATH = '/my/tracker';
export const TOSTER_QUESTION_PATH = '/q';

export const EXTENSION_URL = isChrome
    ? 'https://chrome.google.com/webstore/detail/toster-extension/edbifjhhbolcnccchgdenjnlidcoadae'
    : 'https://addons.mozilla.org/firefox/addon/toster-extension';

export const FEEDBACK_URL = `${EXTENSION_URL}/reviews`;

export const CHAT_URL = `${HABR_URL}/conversations/yarkov`.toLowerCase();
