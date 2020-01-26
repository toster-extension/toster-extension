import { EventType, FeaturesAttribute } from '@/features/types';
import { QuestionId } from '@/libs/types';
import { Feature } from '@/entity/feature';
import { Question } from '@/entity/question';
import css from './style.scss';

export class ShowTagsInTop24QuestionsList extends Feature {
    async execute (): Promise<void> {
        this.eventBus.on(
            EventType.TOP24_QUESTIONS_UPDATE,
            (questions: Question[]) => {
                if (
                    !this.features ||
                    !this.features.showTagsInTop24QuestionsList ||
                    !this.top24QuestionsList.length
                ) {
                    return;
                }

                this.injectCSSToPage(css);
                this.showTags(questions);
            }
        );
    }

    private showTags (questions: Question[]) {
        this.top24QuestionsList.forEach((element: HTMLLIElement) => {
            const id = <QuestionId>element.getAttribute('data-question-id');
            const question = questions.find((item) => item.id === id);

            if (!question) {
                return;
            }

            const tagsDOMElement = this.makeTags(question.tags, false);

            element.insertBefore(
                tagsDOMElement,
                element.querySelector(
                    'a.question__title-link.question__title_thin'
                )
            );
        });

        this.setBodyAttribute(
            FeaturesAttribute.SHOW_TAGS_IN_TOP24_QUESTIONS_LIST,
            'enabled'
        );
    }
}
