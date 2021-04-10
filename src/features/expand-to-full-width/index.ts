import {
  EventType,
  FeaturesAttribute,
  FeaturesCollection,
} from '@/features/types';
import { Feature } from '@/entity/feature';
import css from './style.scss';

export class ExpandToFullWidth extends Feature {
  async execute (): Promise<void> {
    this.eventBus.on(
      EventType.FEATURES_UPDATE,
      (features: FeaturesCollection) => {
        this.features = features;

        if (!this.features.expandToFullWidth) {
          return;
        }

        this.setBodyAttribute(
          FeaturesAttribute.EXPAND_TO_FULL_WIDTH,
          'enabled'
        );
        this.injectCSSToPage(css);
      }
    );
  }
}
