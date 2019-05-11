import {
    EventType,
    FeaturesAttribute,
    FeaturesCollection,
} from '@/features/types';
import { Feature } from '@/entity/feature';

export class HideTopPanel extends Feature {
    async execute (): Promise<void> {
        const panel = document.querySelector<HTMLDivElement>(
            '.tmservices-panel[role="tm_panel"]'
        );

        this.eventBus.on(
            EventType.FEATURES_UPDATE,
            (features: FeaturesCollection) => {
                this.features = features;

                if (this.features.hideTopPanel && panel) {
                    panel.remove();

                    this.setBodyAttribute(
                        FeaturesAttribute.HIDE_TOP_PANEL,
                        'enabled'
                    );
                }
            }
        );
    }
}
