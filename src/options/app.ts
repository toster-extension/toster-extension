import { browser } from 'webextension-polyfill-ts';
import { capitalize, isEmpty } from 'lodash-es';
import { Component, Inject, Vue } from 'vue-property-decorator';
import {
    AuthorsBlackist,
    OptionBoolean,
    OptionBooleanNumber,
    OptionList,
    OptionNumber,
    Social,
    SoundsList,
    Tab,
    Tabs,
    TagsBlackist,
} from './components';
import { ListItem } from './components/option-list/types';
import { Storage } from '@/libs/storage';
import { Question } from '@/entity/question';
import { MessageData, MessageType, Tag } from '@/libs/types';
import { defaultFeaturesCollection, FeaturesCollection, IconClickEvents } from '@/features';
import { TOSTER_URL } from '@/libs/constants';

const manifest = browser.runtime.getManifest();

@Component({
    components: {
        OptionBoolean,
        OptionNumber,
        OptionList,
        Social,
        SoundsList,
        Tab,
        Tabs,
        TagsBlackist,
        AuthorsBlackist,
        OptionBooleanNumber,
    },
})
export default class OptionsApp extends Vue {
    @Inject() tagsList: Tag[];
    @Inject() storage: Storage;
    @Inject() questionsStorage: Storage;

    title: string = browser.i18n.getMessage('extension_name');
    cleanQuestionsButtonText: string = browser.i18n.getMessage(
        'buttonCleanQuestions'
    );
    saveBackupButtonText: string = browser.i18n.getMessage('buttonSaveBackup');
    loadBackupButtonText: string = browser.i18n.getMessage('buttonLoadBackup');

    get tosterUrl (): string {
        return TOSTER_URL;
    }

    get tagsCountText (): string {
        return this.$i18n('optionsToolbarTagsCount', [String(this.tagsCount)]);
    }

    get questionsCountText (): string {
        return this.$i18n('optionsToolbarQuestionsCount', [
            String(this.questionsCount),
        ]);
    }

    get version (): string {
        return manifest.version;
    }

    get config (): FeaturesCollection {
        return this.storage.getAll<FeaturesCollection>();
    }

    get questionPageBooleanOptions (): string[] {
        return [
            'useKeyboardSubmitForm',
            'saveTextBeforeFormSending',
            'wrapSpoilerCodeBlocks',
            'monospaceFont',
            'openLinksInNewTab',
            'hideRelatedIssuesBlock',
            'hideSolutionButton',
            'swapAnswerAndSolutionButtons',
            'hiddenQuestionStub',
        ];
    }

    get questionsListBooleanOptions (): string[] {
        return [
            'doublePagination',
            'hideDecisionQuestions',
            'showNameInQuestionsList',
            'showNickInQuestionsList',
            'showTagsInQuestionsList',
            'showTagsImagesInQuestionsList',
        ];
    }

    get questionsTop24ListBooleanOptions (): string[] {
        return [
            'hideMostInterestingBlock',
            'showNameInTop24QuestionsList',
            'showNickInTop24QuestionsList',
            'showTagsInTop24QuestionsList',
        ];
    }

    get hideExcessBooleanOptions (): string[] {
        return [
            'hideRecomendationsBlock',
            'hideVacanciesAndOrdersBlock',
            'hideTopPanel',
            'hideAdvertisingBlock',
            'hidePartnerMaterialsBlock',
            'hideMegapostsBlock',
        ];
    }

    get previewBooleanOptions (): string[] {
        return ['replaceCodeInPreview'];
    }

    get userBooleanOptions (): string[] {
        return [
            'showAuthorPMLink',
            'showUserBlacklistButton',
        ];
    }

    get notificationsBooleanOptions (): string[] {
        return [
            'showNotifications',
            'showNotificationsCountOnExtensionIcon',
            'showNotificationsCountOnFavicon',
        ];
    }

    get othersBooleanOptions (): string[] {
        return [
            'deleteNotDecisionAnswers',
            'normalizeDate',
            'addSettingsLinkToMenu',
            'expandToFullWidth',
            'scrollToTop',
        ];
    }

    get tabs (): Record<string, string> {
        const tabsNames = [
            'tabQuestionPage',
            'tabQuestionsList',
            'tabQuestionsTop24List',
            'tabHideExcess',
            'tabNotifications',
            'tabPreview',
            'tabUser',
            'tabBlackLists',
            'tabOthers',
        ];

        return tabsNames.reduce<Record<string, string>>((names, name) => {
            names[name] = this.$i18n(name);

            return names;
        },                                              {});
    }

    get eventClickOptions (): ListItem[] {
        return Object.values(IconClickEvents).map((option) => ({
            name: option,
            label: this.$i18n(`optionsIconClickEvent${capitalize(option)}`),
        }));
    }

    private get tagsCount (): number {
        return this.tagsList.length;
    }

    private get questionsCount (): number {
        return this.questionsStorage.get<Question[]>('questions', []).length;
    }

    saveBackup (): void {
        const json = JSON.stringify(
            this.storage.getAll<FeaturesCollection>(),
            null,
            2
        );
        const blob = new Blob([json], { type: 'application/json' });
        const a = document.createElement('a');
        a.download = 'toster-extension.json';
        a.href = window.URL.createObjectURL(blob);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    loadBackup (): void {
        const input = <HTMLInputElement>(
            document.querySelector('input[type="file"][name="backup"]')
        );
        input.click();
    }

    handleFileSelect (event) {
        const files = event.target.files;

        if (!files.length) {
            return;
        }

        const file = files[0];
        const reader = new FileReader();

        const isEqual = (defObj: object, obj: object): boolean => {
            const map = Object.keys(defObj).map((key) => {
                const keyInObject = key in obj;
                const typesCompared = typeof defObj[key] === typeof obj[key];
                const valueIsNotEmpty =
                    typeof obj[key] === 'string' ? !isEmpty(obj[key]) : true;

                return keyInObject && typesCompared && valueIsNotEmpty;
            });

            return map.length === map.filter(Boolean).length;
        };

        reader.onload = (() => {
            return (e) => {
                try {
                    const json = JSON.parse(e.target.result);

                    if (!isEqual(defaultFeaturesCollection, json)) {
                        throw new Error('Not equal');
                    }

                    Object.entries(json).forEach(([key, value]) => {
                        this.storage.set(key, value);
                    });

                    window.location.reload();
                } catch {
                    this.$dialog
                        .alert(this.$i18n('backupErrorFormatFile'))
                        .then(() => {})
                        .catch(() => {});
                } finally {
                    event.target.value = null;
                }
            };
        })();

        reader.readAsText(file);
    }

    cleanQuestions (): void {
        this.$dialog
            .confirm(this.$i18n('optionsCleanListText', ['базу вопросов']))
            .then(() => {
                browser.runtime.sendMessage(<MessageData>{
                    type: MessageType.CLEAR_QUESTIONS,
                });
                setTimeout(() => window.location.reload(), 1000);
            })
            .catch(() => {});
    }

    optionPhrases (optionName: string): string {
        return this.$i18n(`options${capitalize(optionName)}`);
    }

    updatePrimitiveOption (value: boolean, optionKey: string): void {
        this.storage.set<typeof value>(optionKey, value);
        this.emitToApp();
        this.$nextTick(() => {
            this.$forceUpdate();
        });
    }

    updateListOptions (value: string[], optionKey: string): void {
        this.storage.set<typeof value>(optionKey, value);
        this.emitToApp();
        this.$nextTick(() => {
            this.$forceUpdate();
        });
    }

    private emitToApp (): void {
        browser.runtime.sendMessage(<MessageData>{
            type: MessageType.UPDATE_OPTIONS,
        });
    }
}
