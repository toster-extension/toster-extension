import { Tag } from '@/libs/types';

export interface FeaturesCollection {
    hideSolutionButton?: boolean;
    swapAnswerAndSolutionButtons?: boolean;
    hideVacanciesAndOrdersBlock?: boolean;
    hideRelatedIssuesBlock?: boolean;
    hideMostInterestingBlock?: boolean;
    hideRecomendationsBlock?: boolean;
    hideAdvertisingBlock?: boolean;
    doublePagination?: boolean;
    hideDecisionQuestions?: boolean;
    useKeyboardSubmitForm?: boolean;
    saveTextBeforeFormSending?: boolean;
    useTagsBlackList?: boolean;
    tagsBlacklist?: Tag[];
    showNameInQuestionsList?: boolean;
    showNickInQuestionsList?: boolean;
    showTagsInQuestionsList?: boolean;
    showTagsImagesInQuestionsList?: boolean;
    showNameInTop24QuestionsList?: boolean;
    showNickInTop24QuestionsList?: boolean;
    showTagsInTop24QuestionsList?: boolean;
    useAuthorsBlackListForAnswersAndComments?: boolean;
    useAuthorsBlackList?: boolean;
    authorsBlacklist?: string[];
    wrapSpoilerCodeBlocks?: boolean;
    monospaceFont?: boolean;
    questionPreview?: boolean;
    questionPreviewLoadingDelay?: number;
    replaceCodeInPreview?: boolean;
    userProfilePreview?: boolean;
    userProfilePreviewLoadingDelay?: number;
    openLinksInNewTab?: boolean;
    showAuthorPMLink?: boolean;
    checkNotifications?: boolean;
    checkNotificationsInterval?: number;
    showNotifications?: boolean;
    showNotificationsCountOnFavicon?: boolean;
    showNotificationsCountOnExtensionIcon?: boolean;
    useNotificationSound?: boolean;
    sound?: string;
    iconClickEvent?: IconClickEvents;
    deleteNotDecisionAnswers?: boolean;
    normalizeDate?: boolean;
    addSettingsLinkToMenu?: boolean;
    hideTopPanel?: boolean;
    expandToFullWidth?: boolean;
    scrollToTop?: boolean;
    hiddenQuestionStub?: boolean;
    showUserBlacklistButton?: boolean,
}

export enum FeaturesAttribute {
    HIDE_SOLUTION_BUTTON = 'HIDE_SOLUTION_BUTTON',
    SWAP_ANSWER_AND_SOLUTION_BUTTONS = 'SWAP_ANSWER_AND_SOLUTION_BUTTONS',
    HIDE_VACANCIES_AND_ORDERS_BLOCK = 'HIDE_VACANCIES_AND_ORDERS_BLOCK',
    HIDE_RELATED_ISSUES_BLOCK = 'HIDE_RELATED_ISSUES_BLOCK',
    HIDE_MOST_INTERESTING_BLOCK = 'HIDE_MOST_INTERESTING_BLOCK',
    HIDE_RECOMENDATIONS_BLOCK = 'HIDE_RECOMENDATIONS_BLOCK',
    HIDE_ADVERTISING_BLOCK = 'HIDE_ADVERTISING_BLOCK',
    DOUBLE_PAGINATION = 'DOUBLE_PAGINATION',
    HIDE_DECISION_QUESTIONS = 'HIDE_DECISION_QUESTIONS',
    USE_KEYBOARD_SUBMIT_FORM = 'USE_KEYBOARD_SUBMIT_FORM',
    SAVE_TEXT_BEFORE_FORM_SENDING = 'SAVE_TEXT_BEFORE_FORM_SENDING',
    USE_TAGS_BLACKLIST = 'USE_TAGS_BLACKLIST',
    SHOW_NAME_IN_QUESTIONS_LIST = 'SHOW_NAME_IN_QUESTIONS_LIST',
    SHOW_NICK_IN_QUESTIONS_LIST = 'SHOW_NICK_IN_QUESTIONS_LIST',
    SHOW_TAGS_IN_QUESTIONS_LIST = 'SHOW_TAGS_IN_QUESTIONS_LIST',
    SHOW_TAGS_IMAGES_IN_QUESTIONS_LIST = 'SHOW_TAGS_IMAGES_IN_QUESTIONS_LIST',
    SHOW_NAME_IN_TOP24_QUESTIONS_LIST = 'SHOW_NAME_IN_TOP24_QUESTIONS_LIST',
    SHOW_NICK_IN_TOP24_QUESTIONS_LIST = 'SHOW_NICK_IN_TOP24_QUESTIONS_LIST',
    SHOW_TAGS_IN_TOP24_QUESTIONS_LIST = 'SHOW_TAGS_IN_TOP24_QUESTIONS_LIST',
    USE_AUTHORS_BLACKLIST = 'USE_AUTHORS_BLACKLIST',
    WRAP_SPOILER_CODE_BLOCKS = 'WRAP_SPOILER_CODE_BLOCKS',
    MONOSPACE_FONT = 'MONOSPACE_FONT',
    QUESTION_PREVIEW = 'QUESTION_PREVIEW',
    REPLACE_CODE_IN_PREVIEW = 'REPLACE_CODE_IN_PREVIEW',
    USER_PROFILE_PREVIEW = 'USER_PROFILE_PREVIEW',
    OPEN_LINKS_IN_NEW_TAB = 'OPEN_LINKS_IN_NEW_TAB',
    SHOW_AUTHOR_PM_LINK = 'SHOW_AUTHOR_PM_LINK',
    CHECK_NOTIFICATIONS = 'CHECK_NOTIFICATIONS',
    SHOW_NOTIFICATIONS_COUNT_ON_FAVICON = 'SHOW_NOTIFICATIONS_COUNT_ON_FAVICON',
    USE_NOTIFICATION_SOUND = 'USE_NOTIFICATION_SOUND',
    DELETE_NOT_DECISION_ANSWERS = 'DELETE_NOT_DECISION_ANSWERS',
    FLASH_MESSAGES = 'FLASH_MESSAGES',
    ADD_SETTINGS_LINK_TO_MENU = 'ADD_SETTINGS_LINK_TO_MENU',
    HIDE_TOP_PANEL = 'HIDE_TOP_PANEL',
    EXPAND_TO_FULL_WIDTH = 'EXPAND_TO_FULL_WIDTH',
    SCROLL_TO_TOP = 'SCROLL_TO_TOP',
    HIDDEN_QUESTION_STUB = 'HIDDEN_QUESTION_STUB',
    SHOW_USER_BLACKLIST_BUTTON = 'SHOW_USER_BLACKLIST_BUTTON',
}

export enum EventType {
    FEATURES_UPDATE = 'featuresUpdate',
    QUESTIONS_UPDATE = 'questionsUpdate',
    TOP24_QUESTIONS_UPDATE = 'top24QuestionsUpdate',
    NOTIFICATIONS_UPDATE = 'notificationsUpdate',
    SHOW_FLASH_MESSAGES = 'showFlashMessages',
}

export enum IconClickEvents {
    OPEN_SETTINGS = 'openSettings',
    OPEN_TOSTER = 'openToster',
}
