import {
    EventType,
    FeaturesAttribute,
    FeaturesCollection,
} from '@/features/types';
import { Feature } from '@/entity/feature';

export class HideDecisionQuestions extends Feature {
    async execute (): Promise<void> {
        this.eventBus.on(
            EventType.FEATURES_UPDATE,
            (features: FeaturesCollection) => {
                this.features = features;

                if (
                    this.features.hideDecisionQuestions &&
                    !this.onQuestionPage &&
                    !this.onUserQuestionsPage &&
                    this.questionsList.length
                ) {
                    this.questionsList.forEach((question: HTMLElement) => {
                        if (question.querySelector('.icon_svg.icon_check')) {
                            question.parentElement.removeChild(question);
                        }
                    });

                    this.setBodyAttribute(
                        FeaturesAttribute.HIDE_DECISION_QUESTIONS,
                        'enabled'
                    );
                }
            }
        );
    }
}
