import {
    EventType,
    FeaturesAttribute,
    FeaturesCollection,
} from '@/features/types';
import { TOSTER_DOMAIN } from '@/libs/constants';
import { Feature } from '@/entity/feature';

export class OpenLinksInNewTab extends Feature {
    async execute (): Promise<void> {
        const links = document.querySelectorAll(
            `.page__body a[href^="http"]:not([href*="${TOSTER_DOMAIN}"])`
        );

        this.eventBus.on(
            EventType.FEATURES_UPDATE,
            (features: FeaturesCollection) => {
                this.features = features;

                if (this.features.openLinksInNewTab && this.onQuestionPage) {
                    links.forEach((link: HTMLAnchorElement) => {
                        link.setAttribute('target', '_blank');
                    });

                    this.setBodyAttribute(
                        FeaturesAttribute.OPEN_LINKS_IN_NEW_TAB,
                        'enabled'
                    );
                }
            }
        );
    }
}
