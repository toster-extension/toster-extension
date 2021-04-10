import {
  EventType,
  FeaturesAttribute,
  FeaturesCollection,
} from '@/features/types';
import { Feature } from '@/entity/feature';

export class HidePartnerMaterialsBlock extends Feature {
  async execute (): Promise<void> {
    const partnerMaterialsBlock = document.querySelector(
      '.habr-block-megaposts__container'
    );

    this.eventBus.on(
      EventType.FEATURES_UPDATE,
      (features: FeaturesCollection) => {
        this.features = features;

        if (
          !this.features.hidePartnerMaterialsBlock ||
                    !partnerMaterialsBlock
        ) {
          return;
        }

        partnerMaterialsBlock.parentElement.remove();

        this.setBodyAttribute(
          FeaturesAttribute.HIDE_PARTNER_MATERIALS_BLOCK,
          'enabled'
        );
      }
    );
  }
}
