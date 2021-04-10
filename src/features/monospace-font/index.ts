import {
  EventType,
  FeaturesAttribute,
  FeaturesCollection,
} from '@/features/types';
import { Feature } from '@/entity/feature';
import css from './style.scss';

export class MonospaceFont extends Feature {
  async execute (): Promise<void> {
    this.eventBus.on(
      EventType.FEATURES_UPDATE,
      (features: FeaturesCollection) => {
        this.features = features;

        if (!this.features.monospaceFont) {
          return;
        }

        this.injectCSSToPage(css);
        this.setBodyAttribute(
          FeaturesAttribute.MONOSPACE_FONT,
          'enabled'
        );
      }
    );
  }
}
