import {
  EventType,
  FeaturesAttribute,
  FeaturesCollection,
} from '@/features/types';
import { Feature } from '@/entity/feature';

export class HideMegapostsBlock extends Feature {
  async execute (): Promise<void> {
    this.eventBus.on(
      EventType.FEATURES_UPDATE,
      (features: FeaturesCollection) => {
        this.features = features;
      }
    );

    setTimeout(() => {
      const megapostsBlock = document.querySelector<HTMLDivElement>(
        '.habr-block-megaposts__container'
      );

      this.removeBlock(megapostsBlock);
    },         2000);
  }

  removeBlock (block: HTMLDivElement): void {
    if (
      !this.features.hideMegapostsBlock ||
            !block
    ) {
      return;
    }

    block.parentElement.remove();

    this.setBodyAttribute(
      FeaturesAttribute.HIDE_MEGAPOSTS_BLOCK,
      'enabled'
    );
  }
}
