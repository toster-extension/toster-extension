import {
    EventType,
    FeaturesAttribute,
    FeaturesCollection,
} from '@/features/types';
import { Feature } from '@/entity/feature';

export class HideRelatedIssuesBlock extends Feature {
    async execute (): Promise<void> {
        const relatedIssuesBlock = document.querySelector(
            '[id^="related_questions_"]'
        );

        this.eventBus.on(
            EventType.FEATURES_UPDATE,
            (features: FeaturesCollection) => {
                this.features = features;

                if (
                    !this.features.hideRelatedIssuesBlock ||
                    !relatedIssuesBlock
                ) {
                    return;
                }

                relatedIssuesBlock.parentElement.removeChild(
                    relatedIssuesBlock.previousElementSibling
                );
                relatedIssuesBlock.parentElement.removeChild(
                    relatedIssuesBlock
                );

                this.setBodyAttribute(
                    FeaturesAttribute.HIDE_RELATED_ISSUES_BLOCK,
                    'enabled'
                );
            }
        );
    }
}
