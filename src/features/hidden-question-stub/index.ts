import { template } from 'lodash-es';
import { browser } from 'webextension-polyfill-ts';
import {
    EventType,
    FeaturesAttribute,
    FeaturesCollection,
} from '@/features/types';
import { Feature } from '@/entity/feature';
import { createElementFromHTML } from '@/libs/utils';
import { Question } from '@/entity/question';
import css from './style.scss';
import stubHtml from './stub.html';

export class HiddenQuestionStub extends Feature {
    async execute (): Promise<void> {
        this.eventBus.on(
            EventType.FEATURES_UPDATE,
            (features: FeaturesCollection) => {
                this.features = features;
            }
        );

        this.eventBus.on(
            EventType.QUESTIONS_UPDATE,
            (questions: Question[]) => {
                if (!questions.length) {
                    return;
                }

                const questionContainer = document.querySelector<HTMLDivElement>('#question_show');

                if (!this.onQuestionPage
                    || !this.features.hiddenQuestionStub
                    || !questionContainer
                ) {
                    return;
                }

                const question = questions[0];

                if (!question.isHiddenByAuthor && !question.isHiddenByTags) {
                    return;
                }

                questionContainer.classList.add('hidden');

                this.setBodyAttribute(
                    FeaturesAttribute.HIDDEN_QUESTION_STUB,
                    'enabled'
                );
                this.injectCSSToPage(css);

                this.showStub(question);
            }
        );
    }

    private showStub (question: Question) {
        const questionContainer = document.querySelector<HTMLDivElement>('#question_show');

        Array.from(questionContainer.children).forEach((child) => {
            child.remove();
        });

        let message = '';

        if (question.isHiddenByAuthor) {
            message = browser.i18n.getMessage(
                'hiddenQuestionStubHiddenByAuthorText',
                [
                    question.author.tosterUserPageUrl,
                    question.author.fullName,
                ]
            );
        } else if (question.isHiddenByTags) {
            const tagsBlacklist = this.features.tagsBlacklist.map((tag) => tag.name);
            const tags = question.tags.map((tag) => tag.name);
            const intersection = tagsBlacklist.filter((tagName) => tags.includes(tagName));
            const tagsGreatOne = intersection.length > 1;
            const lastTagName = intersection.length > 1 ? intersection.pop() : intersection[0];
            let tagsString = '';

            if (tagsGreatOne) {
                tagsString = `${intersection.map((tagName) => `<b>${tagName}</b>`).join(', ')} и <b>${lastTagName}</b>`;
            } else {
                tagsString = `<b>${lastTagName}</b>`;
            }

            message = browser.i18n.getMessage(
                tagsGreatOne ? 'hiddenQuestionStubHiddenByTags' : 'hiddenQuestionStubHiddenByTag',
                [tagsString]
            );
        }

        const compiled = template(stubHtml);
        const html = compiled({
            message,
        });
        const stubElement = createElementFromHTML(html);

        questionContainer.appendChild(stubElement);
        questionContainer.classList.remove('hidden');
    }
}
