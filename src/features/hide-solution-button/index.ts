import {
    EventType,
    FeaturesAttribute,
    FeaturesCollection,
} from '@/features/types';
import { Feature } from '@/entity/feature';

export class HideSolutionButton extends Feature {
    async execute (): Promise<void> {
        this.eventBus.on(
            EventType.FEATURES_UPDATE,
            (features: FeaturesCollection) => {
                /* jscpd:ignore-start */
                this.features = features;

                const buttonsGroup = document.querySelectorAll(
                    '.buttons-group_answer'
                );
                /* jscpd:ignore-end */

                if (this.features.hideSolutionButton && buttonsGroup) {
                    buttonsGroup.forEach((group: HTMLElement) => {
                        const button: HTMLButtonElement = group.querySelector(
                            'span.btn_solution'
                        );

                        if (button) {
                            group.removeChild(button);
                        }
                    });

                    this.setBodyAttribute(
                        FeaturesAttribute.HIDE_SOLUTION_BUTTON,
                        'enabled'
                    );
                }
            }
        );
    }
}
