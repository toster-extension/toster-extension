import { browser } from 'webextension-polyfill-ts';
import {
    EventType,
    FeaturesAttribute,
    FeaturesCollection,
} from '@/features/types';
import { Feature } from '@/entity/feature';
import { createElementFromHTML } from '@/libs/utils';
import { MessageData, MessageType } from '@/libs/types';
import css from './style.scss';

export class AddSettingsLinkToMenu extends Feature {
    async execute (): Promise<void> {
        const mainMenu = document.querySelector(
            '.layout__navbar[role="navbar"] ul.main-menu:not(.main-menu_dropdown)'
        );

        this.eventBus.on(
            EventType.FEATURES_UPDATE,
            (features: FeaturesCollection) => {
                this.features = features;

                if (this.features.addSettingsLinkToMenu && mainMenu) {
                    const menuItem = createElementFromHTML(`
<li class="main-menu__item">
  <a class="main-menu__link open-options-tab">
    <svg class="icon_svg icon_menu_settings" viewBox="0 0 32 32">
      <use xlink:href="https://qna.habr.com/images/sprite_0.1.svg#icon_menu_settings"></use>
    </svg>
    Toster Extension
  </a>
</li>`);
                    menuItem.querySelector('a').addEventListener('click', (e) => {
                        e.preventDefault();
                        browser.runtime.sendMessage(<MessageData>{
                            type: MessageType.OPEN_OPTIONS_PAGE,
                        });
                    });

                    mainMenu.appendChild(menuItem);

                    this.setBodyAttribute(
                        FeaturesAttribute.ADD_SETTINGS_LINK_TO_MENU,
                        'enabled'
                    );
                    this.injectCSSToPage(css);
                }
            }
        );
    }
}
