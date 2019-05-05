import { browser } from 'webextension-polyfill-ts';
import { EventType, FeaturesAttribute } from '@/features/types';
import { QuestionId } from '@/libs/types';
import { Feature } from '@/entity/feature';
import { Question } from '@/entity/question';
import css from './style.scss';

export class ShowNameInQuestionsList extends Feature {
    async execute (): Promise<void> {
        this.eventBus.on(
            EventType.QUESTIONS_UPDATE,
            (questions: Question[]) => {
                if (
                    (this.features.showNameInQuestionsList ||
                        this.features.showNickInQuestionsList) &&
                    !this.onQuestionPage &&
                    this.questionsList.length
                ) {
                    this.injectCSSToPage(css);
                    this.showAuthor(questions);
                }
            }
        );
    }

    /* jscpd:ignore-start */
    private showAuthor (questions: Question[]) {
        this.questionsList.forEach((element) => {
            const id = <QuestionId>element.getAttribute('data-question-id');
            const question = questions.find((item) => item.id === id);
            const authorBlock = <HTMLDivElement>this.getAuthorBlock(
                question.author,
                /* jscpd:ignore-end */
                this.features.showNameInQuestionsList,
                this.features.showNickInQuestionsList
            );

            if (this.features.showAuthorPMLink) {
                const pmLink = document.createElement('a');
                pmLink.href = question.author.habrPMUrl;
                pmLink.className = 'habr-pm-link';
                pmLink.setAttribute(
                    'title',
                    browser.i18n.getMessage('pmLinkTitle')
                );
                pmLink.textContent = browser.i18n.getMessage('pmLinkText');
                authorBlock.appendChild(pmLink);
            }

            if (question) {
                element
                    .querySelector('.question__content_fluid')
                    .insertBefore(
                        authorBlock,
                        element.querySelector('.question__title')
                    );
            }
        });

        if (this.features.showNameInQuestionsList) {
            this.setBodyAttribute(
                FeaturesAttribute.SHOW_NAME_IN_QUESTIONS_LIST,
                'enabled'
            );
        }

        if (this.features.showNickInQuestionsList) {
            this.setBodyAttribute(
                FeaturesAttribute.SHOW_NICK_IN_QUESTIONS_LIST,
                'enabled'
            );
        }

        if (this.features.showAuthorPMLink) {
            this.setBodyAttribute(
                FeaturesAttribute.SHOW_AUTHOR_PM_LINK,
                'enabled'
            );
        }
    }
}
