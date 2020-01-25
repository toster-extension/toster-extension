import {
    EventType,
    FeaturesAttribute,
    FeaturesCollection,
} from '@/features/types';
import { Feature } from '@/entity/feature';
import { Question } from '@/entity/question';
import { User } from '@/entity/user';
import { createElementFromHTML } from '@/libs/utils';
import css from './style.scss';

export class HideBlacklistAuthorsQuestions extends Feature {
    async execute (): Promise<void> {
        this.eventBus.on(
            EventType.QUESTIONS_UPDATE,
            (questions: Question[]) => {
                if (!this.features || !this.features.useAuthorsBlackList) {
                    return;
                }

                this.hideQuestions(questions);
            }
        );

        this.eventBus.on(
            EventType.TOP24_QUESTIONS_UPDATE,
            (questions: Question[]) => {
                if (!this.features || !this.features.useAuthorsBlackList) {
                    return;
                }

                this.hideQuestions(questions);
            }
        );

        this.eventBus.on(
            EventType.FEATURES_UPDATE,
            (features: FeaturesCollection) => {
                this.features = features;

                if (
                    !this.onQuestionPage ||
                    !this.features.useAuthorsBlackList ||
                    !this.features.useAuthorsBlackListForAnswersAndComments
                ) {
                    return;
                }

                this.hideAnswers();
                this.hideComments();

                this.setBodyAttribute(
                        FeaturesAttribute.USE_AUTHORS_BLACKLIST,
                        'enabled'
                    );

                this.injectCSSToPage(css);
            }
        );
    }

    private getUser (element: HTMLDivElement) {
        const userName = element
            .querySelector<HTMLMetaElement>(
                'a.user-summary__name meta[itemprop="name"]'
            )
            .getAttribute('content')
            .trim();
        const userNickname = element
            .querySelector<HTMLMetaElement>(
                'span.user-summary__nickname meta[itemprop="alternateName"]'
            )
            .getAttribute('content')
            .trim();
        const user = new User(userName, userNickname);

        return user;
    }

    private hideQuestions (questions: Question[]) {
        const filtered = questions.filter(
            (question: Question) => question.isHiddenByAuthor
        );

        filtered.forEach((question: Question) => {
            this.removeQuestionById(question.id);
        });

        this.setBodyAttribute(
            FeaturesAttribute.USE_AUTHORS_BLACKLIST,
            'enabled'
        );
    }

    private hideAnswers () {
        const answersList = Array.from(
            document.querySelectorAll<HTMLDivElement>(
                '#answers_list .content-list__item[role^="answer_item"]'
            ) || []
        );
        const sectionHeader = document.querySelector<HTMLSpanElement>(
            '#answers .section-header__title'
        );
        const hiddensHtml =
            '<span class="section-header__counter hidden-counter" role="answers_counter"></span>';

        sectionHeader.appendChild(createElementFromHTML(hiddensHtml));

        answersList.forEach((answer) => {
            const hiddenCounter = Number(
                sectionHeader.getAttribute('data-hidden-counter') || 0
            );
            const user = this.getUser(answer);

            if (this.features.authorsBlacklist.includes(user.fullName)) {
                answer.remove();

                sectionHeader.setAttribute(
                    'data-hidden-counter',
                    String(hiddenCounter + 1)
                );
            }
        });
    }

    private hideComments () {
        const questionCommentsList = Array.from(
            document.querySelectorAll<HTMLDivElement>(
                '.content-list_comments[role="question_comments_list"] li.content-list__item[role="comments_item"]'
            )
        );
        const answersCommentsList = Array.from(
            document.querySelectorAll<HTMLDivElement>(
                '.content-list_comments[role="answer_comments_list"] li.content-list__item[role="comments_item"]'
            )
        );
        const commentsList = questionCommentsList.concat(answersCommentsList);

        commentsList.forEach((comment) => {
            const parent =
                comment.closest('.question.question_full') ||
                comment.closest('.content-list__item[role^="answer_item"]');
            const isQuestionComments = !!parent.querySelectorAll<
                HTMLSpanElement
            >('a[role="toggle_question_comments"] > span').length;
            const toggleSpan = Array.from(
                isQuestionComments
                    ? parent.querySelectorAll<HTMLSpanElement>(
                          'a[role="toggle_question_comments"] > span'
                      )
                    : parent.querySelectorAll<HTMLSpanElement>(
                          'a[role="toggle_answer_comments"] > span'
                      )
            ).pop();
            const hiddenCounter = toggleSpan
                ? Number(toggleSpan.getAttribute('data-hidden-counter') || 0)
                : 0;
            const user = this.getUser(comment);

            if (this.features.authorsBlacklist.includes(user.fullName)) {
                comment.remove();

                if (toggleSpan) {
                    toggleSpan.setAttribute(
                        'data-hidden-counter',
                        String(hiddenCounter + 1)
                    );
                }
            }
        });
    }
}
