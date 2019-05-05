import { FeaturesCollection, IconClickEvents } from './types';

export * from './hide-solution-button';
export * from './swap-answer-and-solution-buttons';
export * from './hide-vacancies-and-orders-block';
export * from './hide-related-issues-block';
export * from './hide-right-sidebar-block';
export * from './double-pagination';
export * from './hide-decision-questions';
export * from './use-keyboard-submit-form';
export * from './save-text-before-form-sending';
export * from './hide-blacklist-tags-questions';
export * from './show-name-in-questions-list';
export * from './show-name-in-top24-questions-list';
export * from './show-all-tags-in-questions-list';
export * from './show-all-tags-in-top24-questions-list';
export * from './hide-blacklist-authors-questions';
export * from './wrap-spoiler-code-blocks';
export * from './monospace-font';
export * from './question-preview';
export * from './user-profile-preview';
export * from './open-links-in-new-tab';
export * from './show-author-pm-link';
export * from './unread-notifications';
export * from './delete-not-decision-answers';
export * from './flash-messages';
export * from './normalize-date';
export * from './add-settings-link-to-menu';
export * from './types';

export const defaultFeaturesCollection: FeaturesCollection = {
    hideSolutionButton: false,
    swapAnswerAndSolutionButtons: false,
    hideVacanciesAndOrdersBlock: false,
    hideRelatedIssuesBlock: false,
    hideMostInterestingBlock: false,
    hideRecomendationsBlock: false,
    doublePagination: false,
    hideDecisionQuestions: false,
    useKeyboardSubmitForm: false,
    saveTextBeforeFormSending: false,
    useTagsBlackList: false,
    tagsBlacklist: [],
    showNameInQuestionsList: false,
    showNickInQuestionsList: false,
    showTagsInQuestionsList: false,
    showTagsImagesInQuestionsList: false,
    showNameInTop24QuestionsList: false,
    showNickInTop24QuestionsList: false,
    showTagsInTop24QuestionsList: false,
    useAuthorsBlackListForAnswersAndComments: false,
    useAuthorsBlackList: false,
    authorsBlacklist: [],
    wrapSpoilerCodeBlocks: false,
    monospaceFont: false,
    questionPreview: false,
    questionPreviewLoadingDelay: 0,
    replaceCodeInPreview: false,
    userProfilePreview: false,
    userProfilePreviewLoadingDelay: 0,
    openLinksInNewTab: false,
    showAuthorPMLink: false,
    checkNotifications: false,
    checkNotificationsInterval: 0,
    showNotifications: false,
    showNotificationsCountOnFavicon: false,
    showNotificationsCountOnExtensionIcon: false,
    useNotificationSound: false,
    sound: 'sounds/1.mp3',
    iconClickEvent: IconClickEvents.OPEN_SETTINGS,
    deleteNotDecisionAnswers: false,
    normalizeDate: false,
    addSettingsLinkToMenu: false,
};
