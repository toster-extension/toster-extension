import { User } from '@/entity/user';
import { Question } from '@/entity/question';
import { FeaturesCollection } from '@/features';

interface Branding<BrandT> {
    _type?: BrandT;
}
type Brand<T, BrandT> = T & Branding<BrandT>;

export enum StorageType {
    APP = 'app',
    POPUP = 'popup',
    OPTIONS = 'options',
    CONTENT = 'content',
}

export enum AlarmsType {
    CHECK_NOTIFICATIONS = 'checkNotifications',
}

export enum NotificationsType {
    UNREAD_NOTIFICATIONS = 'unreadNotifications',
}

export interface MessageData {
    type: MessageType;
    data?: Data;
}

export enum MessageType {
    UPDATE_OPTIONS = 1,
    GET_OPTIONS = 2,
    GET_QUESTIONS = 3,
    GET_TOP24_QUESTIONS = 4,
    SET_OR_UPDATE_QUESTION = 5,
    NOTIFICATIONS_UPDATE = 6,
    SHOW_FLASH_MESSAGES = 7,
    OPEN_OPTIONS_PAGE = 8,
    CLEAR_QUESTIONS = 9,
    ADD_USER_TO_BLACKLIST = 10,
}

export interface Data {
    user?: User;
    questions?: Question[];
    questionId?: QuestionId;
    questionsIds?: QuestionId[];
    features?: FeaturesCollection;
    notifications?: NotificationsData;
    flashMessages?: FlashMessage[];
}

export type QuestionId = Brand<string, Question>;

export interface NotificationsData {
    html: string;
    count: number;
}

export interface FlashMessage {
    id: number;
    html: string;
    type: FlashMessageType;
    handler?: FlashMessageHandler;
}

export enum FlashMessageType {
    INFO = 1,
    WARNING = 2,
    ERROR = 3,
    SUCCESS = 4,
}

export interface FlashMessageHandler {
    type: FlashMessageHandlerType;
    event: string;
}

export enum FlashMessageHandlerType {
    CLICK = 'click',
    DBLCLICK = 'dblclick',
    MOUSEOVER = 'mouseover',
    MOUSEOUT = 'mouseout',
}

export interface UpdateIconParams {
    count?: number;
    loading?: true;
}

export interface Tag {
    name: string;
    slug: string;
    image: string;
}

export interface BlackListAuthor {
    name: string;
}
