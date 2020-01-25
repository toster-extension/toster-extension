import {
    EventType,
    FeaturesAttribute,
    FeaturesCollection,
} from '@/features/types';
import { Feature } from '@/entity/feature';

export class DoublePagination extends Feature {
    async execute (): Promise<void> {
        const paginationParent = document.querySelector('.page__body');
        const paginationBlock = document.querySelector('.paginator');

        this.eventBus.on(
            EventType.FEATURES_UPDATE,
            (features: FeaturesCollection) => {
                this.features = features;

                if (
                    !this.features.doublePagination ||
                    !paginationBlock ||
                    !paginationParent ||
                    this.onQuestionPage
                ) {
                    return;
                }

                const clone = paginationBlock.cloneNode(true);
                paginationParent.insertBefore(
                        clone,
                        paginationParent.firstChild
                    );

                this.setBodyAttribute(
                    FeaturesAttribute.DOUBLE_PAGINATION,
                    'enabled'
                );
            }
        );
    }
}
