import { EventType, FeaturesAttribute } from '@/features/types';
import { QuestionId } from '@/libs/types';
import { Feature } from '@/entity/feature';
import { Question } from '@/entity/question';
import css from './style.scss';

export class ShowTagsInQuestionsList extends Feature {
    async execute (): Promise<void> {
        this.eventBus.on(
            EventType.QUESTIONS_UPDATE,
            (questions: Question[]) => {
                if (
                    this.features &&
                    this.features.showTagsInQuestionsList &&
                    !this.onQuestionPage &&
                    this.questionsList.length
                ) {
                    this.injectCSSToPage(css);
                    this.showTags(questions);
                }
            }
        );
    }

    private showTags (questions: Question[]) {
        this.questionsList.forEach((element) => {
            const id = <QuestionId>element.getAttribute('data-question-id');
            const tagsImage = element.querySelector(
                '.question__tags > .question__tags-image'
            );

            if (tagsImage && this.features.showTagsImagesInQuestionsList) {
                tagsImage.remove();
            }

            const question = questions.find((item) => item.id === id);

            if (question) {
                const tagsDOMElement = this.makeTags(
                    question.tags,
                    this.features.showTagsImagesInQuestionsList
                );
                const tagList = element.querySelector(
                    '.tags-list.tags-list_short'
                );

                tagList.parentElement.replaceChild(tagsDOMElement, tagList);
            }
        });

        if (this.features.showTagsImagesInQuestionsList) {
            this.setBodyAttribute(
                FeaturesAttribute.SHOW_TAGS_IMAGES_IN_QUESTIONS_LIST,
                'enabled'
            );
        }

        this.setBodyAttribute(
            FeaturesAttribute.SHOW_TAGS_IN_QUESTIONS_LIST,
            'enabled'
        );
    }
}
