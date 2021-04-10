import {
  EventType,
  FeaturesAttribute,
  FeaturesCollection,
} from '@/features/types';
import { Feature } from '@/entity/feature';

export class HideVacanciesAndOrdersBlock extends Feature {
  async execute (): Promise<void> {
    const vacanciesAndOrdersBlock = document.querySelector(
      '.offered-services'
    );

    this.eventBus.on(
      EventType.FEATURES_UPDATE,
      (features: FeaturesCollection) => {
        this.features = features;

        if (!this.features.hideVacanciesAndOrdersBlock || !vacanciesAndOrdersBlock) {
          return;
        }

        vacanciesAndOrdersBlock.parentElement.removeChild(
          vacanciesAndOrdersBlock
        );

        this.setBodyAttribute(
          FeaturesAttribute.HIDE_VACANCIES_AND_ORDERS_BLOCK,
          'enabled'
        );
      }
    );
  }
}
