import uniqBy from 'lodash/uniqBy';
import get from 'lodash/get';
import { Alarms, browser } from 'webextension-polyfill-ts';
import { Timer } from '@/libs/timer';
import { HTTP } from '@/libs/http';
import { Question } from '@/entity/question';
import { User } from '@/entity/user';
import { Storage } from '@/libs/storage';
import { getAllTabs } from '@/libs/utils';
import { defaultFeaturesCollection, FeaturesCollection } from '@/features';
import {
    AlarmsType,
    FlashMessage,
    FlashMessageHandlerType,
    FlashMessageType,
    MessageData,
    MessageType,
    NotificationsData,
    NotificationsType,
    QuestionId,
    StorageType,
    Tag,
    UpdateIconParams,
} from '@/libs/types';
import {
    TOSTER_QUESTION_PATH,
    TOSTER_TRACKER_PATH,
    TOSTER_URL,
} from '@/libs/constants';
import tagsList from 'assets/tags.json';

const http = new HTTP();

export class App {
    private questionsStorage: Storage = new Storage(StorageType.APP);
    private configStorage: Storage = new Storage(StorageType.OPTIONS);
    private notificationsTimer: Timer = null;
    private useNotificationsFlag: boolean = true;

    constructor () {
        browser.runtime.onMessage.addListener(
            async (request: MessageData, sender) => {
                let data: MessageData = null;

                switch (request.type) {
                    case MessageType.SET_OR_UPDATE_QUESTION:
                        await this.getQuestionById(request.data.questionId);
                        break;
                    case MessageType.GET_QUESTIONS:
                        data = await this.getQuestions(
                            request.data.questionsIds
                        );
                        break;
                    case MessageType.GET_TOP24_QUESTIONS:
                        data = await this.getTop24Questions(
                            request.data.questionsIds
                        );
                        break;
                    case MessageType.GET_OPTIONS:
                        data = await this.getOptions();
                        break;
                    case MessageType.UPDATE_OPTIONS:
                        this.updateDataBase();
                        this.syncAndStartAlarms();
                        break;
                    case MessageType.OPEN_OPTIONS_PAGE:
                        browser.runtime.openOptionsPage();
                        break;
                    case MessageType.CLEAR_QUESTIONS:
                        this.clearDataBase();
                        break;
                }

                if (data) {
                    browser.tabs.sendMessage(sender.tab.id, data);
                }
            }
        );

        this.syncAndStartAlarms();

        window.addEventListener('storage', (e) => {
            if (e.key === StorageType.OPTIONS && e.oldValue !== e.newValue) {
                this.sendFlashMessagesToContentSctipt([
                    {
                        id: 0,
                        html: browser.i18n.getMessage(
                            'flashMessagesOptionsChanged',
                            [browser.i18n.getMessage('extension_name')]
                        ),
                        type: FlashMessageType.INFO,
                        handler: {
                            type: FlashMessageHandlerType.CLICK,
                            event: 'window.location.reload();',
                        },
                    },
                ]);
            }
        });
    }

    alarmHandler (alarm: Alarms.Alarm) {
        const config = this.configStorage.getAll<FeaturesCollection>();

        switch (alarm.name) {
            case AlarmsType.CHECK_NOTIFICATIONS:
                if (
                    config.checkNotifications &&
                    config.checkNotificationsInterval &&
                    window.navigator.onLine
                ) {
                    this.checkNotifications();
                }
                this.syncAndStartAlarms();
                break;
            default:
                break;
        }
    }

    async notifyHandler (notifyId: NotificationsType) {
        switch (notifyId) {
            case NotificationsType.UNREAD_NOTIFICATIONS:
                const tabs = await getAllTabs({ url: '*://*.toster.ru/*' });
                const activeTab = get(tabs.filter((tab) => tab.active), null);
                let callback: () => void;

                if (!tabs.length) {
                    callback = () => {
                        browser.tabs.create({
                            url: `${TOSTER_URL}${TOSTER_TRACKER_PATH}`,
                        });
                    };
                } else {
                    const tabId = activeTab ? activeTab.id : tabs[0].id;

                    callback = () => {
                        browser.tabs.update(tabId, {
                            active: true,
                        });
                    };
                }

                await browser.notifications.clear(notifyId);
                callback();
                break;
            default:
                break;
        }
    }

    clearDataBase (): void {
        this.questionsStorage.set<Question[]>('questions', []);
    }

    async checkNotifications () {
        const config = this.configStorage.getAll<FeaturesCollection>();
        const html = await http.get(TOSTER_TRACKER_PATH);
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const navbar = doc.querySelector('aside.layout__navbar[role="navbar"]');

        if (navbar) {
            const newEventsList = navbar.querySelector('ul.events-list');

            if (newEventsList) {
                const items = newEventsList.querySelectorAll('li');
                let count = items.length;
                const tabs = await getAllTabs({ url: '*://*.toster.ru/*' });
                const activeTab = get(tabs.filter((tab) => tab.active), 0);

                if (items.length > 3) {
                    const text = Array.from(items)
                        .slice()
                        .pop()
                        .innerText.replace(/[^\d]/g, '');
                    count = parseInt(text, 10);
                }

                if (!activeTab && this.useNotificationsFlag && count) {
                    if (config.useNotificationSound) {
                        if (config.sound) {
                            const audio = new Audio(
                                browser.runtime.getURL(config.sound)
                            );

                            if (audio) {
                                audio.play();
                            }
                        }
                    }

                    if (config.showNotifications) {
                        this.createUnreadNotify(count);
                    }
                }

                this.useNotificationsFlag = count === 0;

                if (config.showNotificationsCountOnExtensionIcon) {
                    this.updateIcon({
                        count,
                    });
                }

                if (tabs.length) {
                    const notifications: NotificationsData = {
                        html: newEventsList.innerHTML,
                        count,
                    };

                    if (activeTab) {
                        this.sendNotificationsToContentSctipt(
                            activeTab.id,
                            notifications
                        );
                    } else {
                        for (const tab of tabs) {
                            this.sendNotificationsToContentSctipt(
                                tab.id,
                                notifications
                            );
                        }
                    }
                }
            }
        }
    }

    private async sendFlashMessagesToContentSctipt (
        flashMessages: FlashMessage[]
    ) {
        const tabs = await getAllTabs({ url: '*://*.toster.ru/*' });

        if (tabs.length) {
            for (const tab of tabs) {
                try {
                    browser.tabs.sendMessage(tab.id, {
                        type: MessageType.SHOW_FLASH_MESSAGES,
                        data: {
                            flashMessages,
                        },
                    });
                } catch {
                    // TODO: may by saved to log
                }
            }
        }
    }

    private syncAndStartAlarms () {
        const restartNotificationTimer = (config: FeaturesCollection) => {
            this.notificationsTimer = new Timer(
                AlarmsType.CHECK_NOTIFICATIONS,
                config.checkNotificationsInterval ||
                    defaultFeaturesCollection.checkNotificationsInterval
            );
            this.notificationsTimer.stop();
            this.notificationsTimer.start();
        };

        restartNotificationTimer(
            this.configStorage.getAll<FeaturesCollection>()
        );
    }

    private updateIcon (params: UpdateIconParams = {}) {
        if (!params.count) {
            browser.browserAction.setBadgeText({
                text: '',
            });

            return;
        }

        browser.browserAction.setBadgeBackgroundColor({
            color: '#ff0000',
        });
        browser.browserAction.setBadgeText({
            text: String(params.count),
        });
    }

    private sendNotificationsToContentSctipt (
        tabId: number,
        notifications: NotificationsData
    ) {
        try {
            browser.tabs.sendMessage(tabId, {
                type: MessageType.NOTIFICATIONS_UPDATE,
                data: {
                    notifications,
                },
            });
        } catch {
            // TODO: may by saved to log
        }
    }

    private createUnreadNotify (count: number) {
        browser.notifications.create(NotificationsType.UNREAD_NOTIFICATIONS, {
            type: 'basic',
            title: browser.i18n.getMessage('notificationsUnreadTitle'),
            iconUrl: browser.runtime.getURL('images/toster_logo_24.png'),
            message: browser.i18n.getMessage('notificationsUnreadMessage', [
                String(count),
            ]),
            priority: 2,
        });
    }

    private async getQuestionById (id: QuestionId): Promise<Question> {
        const questions = this.questionsStorage.get<Question[]>('questions', []);
        let question: Question = questions.find((item) => item.id === id);

        if (question) {
            return question;
        }

        const url = `${TOSTER_QUESTION_PATH}/${id}`;
        const html = await http.get(url);
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const name = (doc.querySelector(
            '.user-summary__desc > .user-summary__name'
        ) as HTMLDivElement).innerText.trim();
        const nick = (doc.querySelector(
            '.user-summary__desc > .user-summary__nickname'
        ) as HTMLDivElement).innerText
            .trim()
            .replace(/\s+/g, '')
            .replace(/^@/, '');
        const user = {
            name,
            nick,
        };
        const tagsElements = doc
            .querySelector('.question__tags')
            .querySelectorAll('.tags-list__item');
        const tags: Tag[] = Array.from(tagsElements).map(
            (item: HTMLDivElement): Tag => {
                const tagName = item.innerText.trim();
                const tagSlug = item.getAttribute('data-tagname');
                const foundedTag = tagsList.find(
                    (tag: Tag) => tag.name === tagName
                );
                const tagImage = foundedTag ? foundedTag.image : '';

                return {
                    name: tagName,
                    slug: tagSlug,
                    image: tagImage,
                };
            }
        );
        const author = new User(user.name, user.nick).toJSON();

        question = new Question(id, author, tags);

        this.questionsStorage.push<Question>('questions', question);

        return question;
    }

    private async getQuestions (
        questionsIds: QuestionId[]
    ): Promise<MessageData> {
        const questions = await Promise.all(
            questionsIds.map((id: QuestionId) => this.getQuestionById(id))
        );

        return <MessageData>{
            type: MessageType.GET_QUESTIONS,
            data: { questions },
        };
    }

    private async getTop24Questions (
        questionsIds: QuestionId[]
    ): Promise<MessageData> {
        const { data } = await this.getQuestions(questionsIds);

        return <MessageData>{
            type: MessageType.GET_TOP24_QUESTIONS,
            data: { questions: data.questions },
        };
    }

    private async getOptions (): Promise<MessageData> {
        const storage = new Storage(StorageType.OPTIONS);

        return <MessageData>{
            type: MessageType.GET_OPTIONS,
            data: {
                features: storage.getAll(),
            },
        };
    }

    private updateDataBase (): void {
        const questions = this.questionsStorage.get<Question[]>('questions', []);
        const newQuestions = questions.map((question: Question) => {
            const user = new User(question.author.name, question.author.nick);

            return new Question(question.id, user, question.tags);
        });

        this.questionsStorage.set('questions', [
            ...uniqBy<Question>(newQuestions, 'id'),
        ]);
    }
}
