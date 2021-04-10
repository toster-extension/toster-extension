import { browser } from 'webextension-polyfill-ts';
import {
  EventType,
  FeaturesAttribute,
  FeaturesCollection,
} from '@/features/types';
import { Feature } from '@/entity/feature';
import css from './style.scss';

export class HideRightSidebarBlock extends Feature {
  async execute (): Promise<void> {
    const sidebar = document.querySelector<HTMLDivElement>(
      'aside.column_sidebar'
    );

    this.eventBus.on(
      EventType.FEATURES_UPDATE,
      (features: FeaturesCollection) => {
        this.features = features;

        if (!sidebar) {
          return;
        }

        if (this.features.hideMostInterestingBlock) {
          this.hideMostInterestingBlock(sidebar);
        }

        if (this.features.hideRecomendationsBlock) {
          this.hideRecomendationsBlock(sidebar);
        }

        if (this.features.hideAdvertisingBlock) {
          this.hideAdvertisingBlock(sidebar);
        }

        const bodyDataset = document.body.dataset;

        if (
          bodyDataset.featureHiderecomendationsblock !== 'enabled'
          || bodyDataset.featureHidemostinterestingblock !== 'enabled'
        ) {
          return;
        }

        this.injectCSSToPage(css);
      }
    );
  }

  private hideMostInterestingBlock (sidebar: HTMLDivElement) {
    const block = sidebar.querySelector('[role="most_interest"]');

    if (!block) {
      return;
    }

    const title = block.querySelector('.panel-heading__title_underline');
    const blockTitle = browser.i18n.getMessage('mostInterestingBlockTitle');
    const text = blockTitle.toLowerCase();

    if (!title) {
      return;
    }

    const isMostInterestingBlock =
            title &&
            title.firstChild.textContent
              .trim()
              .toLowerCase()
              .includes(text);

    if (isMostInterestingBlock) {
      sidebar.removeChild(block);

      this.setBodyAttribute(
        FeaturesAttribute.HIDE_MOST_INTERESTING_BLOCK,
        'enabled'
      );
    }
  }

  private hideRecomendationsBlock (sidebar: HTMLDivElement) {
    const block = sidebar.querySelector(':not([role="most_interest"])');

    if (!block) {
      return;
    }

    const title = block.querySelector('.panel-heading__title_underline');
    const blockTitle = 'Рекомендуем';
    const text = blockTitle.toLowerCase();

    if (!title) {
      return;
    }

    const isRecomendationsBlock =
            title &&
            title.firstChild.textContent
              .trim()
              .toLowerCase()
              .includes(text);

    if (isRecomendationsBlock) {
      sidebar.removeChild(block);

      this.setBodyAttribute(
        FeaturesAttribute.HIDE_RECOMENDATIONS_BLOCK,
        'enabled'
      );
    }
  }

  private hideAdvertisingBlock (sidebar: HTMLDivElement) {
    const banner = sidebar.querySelector('[data-dfp-banner]');

    if (!banner) {
      return;
    }

    const link = sidebar.querySelector('a.dfp_label');

    if (!link) {
      return;
    }

    sidebar.removeChild(banner);
    sidebar.removeChild(link);

    this.setBodyAttribute(
      FeaturesAttribute.HIDE_ADVERTISING_BLOCK,
      'enabled'
    );
  }
}
