import { EventType, FeaturesAttribute } from '@/features/types';
import { Feature } from '@/entity/feature';
import { Question } from '@/entity/question';

export class HideBlacklistTagsQuestions extends Feature {
    async execute (): Promise<void> {
        this.eventBus.on(
            EventType.QUESTIONS_UPDATE,
            (questions: Question[]) => {
                if (
                    this.features &&
                    this.features.useTagsBlackList &&
                    this.questionsList.length
                ) {
                    this.hideQuestions(questions);
                }
            }
        );

        this.eventBus.on(
            EventType.TOP24_QUESTIONS_UPDATE,
            (questions: Question[]) => {
                if (
                    this.features &&
                    this.features.useTagsBlackList &&
                    this.questionsList.length
                ) {
                    this.hideQuestions(questions);
                }
            }
        );
    }

    private hideQuestions (questions: Question[]) {
        const filtered = questions.filter(
            (question: Question) => question.isHiddenByTags
        );

        filtered.forEach((question: Question) => {
            this.removeQuestionFromListById(question.id);
        });

        this.setBodyAttribute(FeaturesAttribute.USE_TAGS_BLACKLIST, 'enabled');
    }
}
