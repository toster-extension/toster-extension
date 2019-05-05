import { browser } from 'webextension-polyfill-ts';
import { IObservableEvent, Observable } from 'typescript-observable';
import { Feature } from '@/entity/feature';
import { EventType } from '@/features/types';
import { MessageData, MessageType } from '@/libs/types';
import {
    AddSettingsLinkToMenu,
    DeleteNotDecisionAnswers,
    DoublePagination,
    FlashMessages,
    HideBlacklistAuthorsQuestions,
    HideBlacklistTagsQuestions,
    HideDecisionQuestions,
    HideRelatedIssuesBlock,
    HideRightSidebarBlock,
    HideSolutionButton,
    HideVacanciesAndOrdersBlock,
    MonospaceFont,
    NormalizeDate,
    OpenLinksInNewTab,
    QuestionPreview,
    SaveTextBeforeFormSending,
    ShowAuthorPMLink,
    ShowNameInQuestionsList,
    ShowNameInTop24QuestionsList,
    ShowTagsInQuestionsList,
    ShowTagsInTop24QuestionsList,
    SwapAnswerAndSolutionButtons,
    UnreadNotifications,
    UseKeyboardSubmitForm,
    UserProfilePreview,
    WrapSpoilerCodeBlocks,
} from '@/features';

const featuresUpdateEvent: IObservableEvent = {
    parent: null,
    name: EventType.FEATURES_UPDATE,
};
const questionsUpdateEvent: IObservableEvent = {
    parent: null,
    name: EventType.QUESTIONS_UPDATE,
};
const top24QuestionsUpdateEvent: IObservableEvent = {
    parent: null,
    name: EventType.TOP24_QUESTIONS_UPDATE,
};
const notificationsUpdateEvent: IObservableEvent = {
    parent: null,
    name: EventType.NOTIFICATIONS_UPDATE,
};
const flashMessagesEvent: IObservableEvent = {
    parent: null,
    name: EventType.SHOW_FLASH_MESSAGES,
};

const eventBus = new Observable();

class Toster {
    private get questionsIds (): string[] {
        const questionsList = document.querySelectorAll(
            '.content-list__item[role="content-list_item"]'
        );

        if (questionsList) {
            return Array.from(questionsList).map(
                (question: HTMLElement): string => {
                    const a = question.querySelector(
                        'a.question__title-link_list'
                    );
                    const id = a
                        .getAttribute('href')
                        .split('/')
                        .pop();

                    question.setAttribute('data-question-id', id);

                    return id;
                }
            );
        }

        return [];
    }

    private get top24QuestionsIds (): string[] {
        const questionsList = document.querySelectorAll(
            'aside.column_sidebar [role="most_interest"] .content-list.content-list_sidebar-block > .content-list__item'
        );

        if (questionsList) {
            return Array.from(questionsList)
                .map(
                    (question: HTMLElement): string => {
                        const a = question.querySelector(
                            'a.question__title-link.question__title_thin'
                        );

                        if (a) {
                            const id = a
                                .getAttribute('href')
                                .split('/')
                                .pop();

                            question.setAttribute('data-question-id', id);

                            return id;
                        }

                        return '';
                    }
                )
                .filter(Boolean);
        }

        return [];
    }

    private get onQuestionPage (): boolean {
        return !!document.location.pathname.match(/\/q\/(\d+)/i);
    }

    constructor () {
        browser.runtime.onMessage.addListener((request: MessageData) => {
            if (request && request.type) {
                switch (request.type) {
                    case MessageType.GET_OPTIONS:
                        if (this.onQuestionPage) {
                            const id = document.location.pathname
                                .split('/')
                                .pop();
                            this.setOrUpdateQuestion(id);
                        }
                        eventBus.notify(
                            featuresUpdateEvent,
                            request.data.features
                        );
                        break;
                    case MessageType.GET_QUESTIONS:
                        eventBus.notify(
                            questionsUpdateEvent,
                            request.data.questions
                        );
                        break;
                    case MessageType.GET_TOP24_QUESTIONS:
                        eventBus.notify(
                            top24QuestionsUpdateEvent,
                            request.data.questions
                        );
                        break;
                    case MessageType.NOTIFICATIONS_UPDATE:
                        eventBus.notify(
                            notificationsUpdateEvent,
                            request.data.notifications
                        );
                        break;
                    case MessageType.SHOW_FLASH_MESSAGES:
                        eventBus.notify(
                            flashMessagesEvent,
                            request.data.flashMessages
                        );
                        break;
                }
            }
        });
    }

    async run (): Promise<void> {
        browser.runtime.sendMessage(<MessageData>{
            type: MessageType.GET_OPTIONS,
        });

        const features: Feature[] = [
            new HideSolutionButton(),
            new SwapAnswerAndSolutionButtons(),
            new HideVacanciesAndOrdersBlock(),
            new HideRelatedIssuesBlock(),
            new HideRightSidebarBlock(),
            new DoublePagination(),
            new HideDecisionQuestions(),
            new UseKeyboardSubmitForm(),
            new SaveTextBeforeFormSending(),
            new HideBlacklistTagsQuestions(),
            new ShowNameInQuestionsList(),
            new ShowTagsInQuestionsList(),
            new ShowTagsInTop24QuestionsList(),
            new ShowNameInTop24QuestionsList(),
            new HideBlacklistAuthorsQuestions(),
            new WrapSpoilerCodeBlocks(),
            new MonospaceFont(),
            new QuestionPreview(),
            new UserProfilePreview(),
            new OpenLinksInNewTab(),
            new ShowAuthorPMLink(),
            new UnreadNotifications(),
            new DeleteNotDecisionAnswers(),
            new FlashMessages(),
            new NormalizeDate(),
            new AddSettingsLinkToMenu(),
        ];

        await Promise.all(
            features.map((feature) => {
                feature.setObservers(eventBus);

                return feature.execute();
            })
        );

        browser.runtime.sendMessage(<MessageData>{
            type: MessageType.GET_QUESTIONS,
            data: { questionsIds: this.questionsIds },
        });

        if (this.top24QuestionsIds.length) {
            browser.runtime.sendMessage(<MessageData>{
                type: MessageType.GET_TOP24_QUESTIONS,
                data: { questionsIds: this.top24QuestionsIds },
            });
        }
    }

    private setOrUpdateQuestion (id: string): void {
        browser.runtime.sendMessage(<MessageData>{
            type: MessageType.SET_OR_UPDATE_QUESTION,
            data: { questionId: id },
        });
    }
}

const toster = new Toster();

toster.run();
