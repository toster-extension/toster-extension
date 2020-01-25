import {
    EventType,
    FeaturesAttribute,
    FeaturesCollection,
} from '@/features/types';
import { Feature } from '@/entity/feature';

export class SwapAnswerAndSolutionButtons extends Feature {
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

                if (
                    !this.features.swapAnswerAndSolutionButtons ||
                    !buttonsGroup
                ) {
                    return;
                }

                buttonsGroup.forEach((group: HTMLElement) => {
                    const buttonSolution: HTMLButtonElement = group.querySelector(
                        'span.btn_solution'
                    );
                    const buttonLike: HTMLButtonElement = group.querySelector(
                        'a.btn_like'
                    );

                    if (buttonSolution && buttonLike) {
                        group.insertBefore(buttonLike, buttonSolution);

                        this.setBodyAttribute(
                            FeaturesAttribute.SWAP_ANSWER_AND_SOLUTION_BUTTONS,
                            'enabled'
                        );
                    }
                });
            }
        );
    }
}
