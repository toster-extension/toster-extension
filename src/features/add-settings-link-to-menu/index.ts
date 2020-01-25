import template from 'lodash/template';
import { browser } from 'webextension-polyfill-ts';
import {
    EventType,
    FeaturesAttribute,
    FeaturesCollection,
} from '@/features/types';
import { Feature } from '@/entity/feature';
import { createElementFromHTML } from '@/libs/utils';
import { MessageData, MessageType } from '@/libs/types';
import { TOSTER_URL } from '@/libs/constants';
import css from './style.scss';
import menuItemHtml from './menu-item.html';

export class AddSettingsLinkToMenu extends Feature {
    async execute (): Promise<void> {
        const mainMenu = document.querySelector(
            '.layout__navbar[role="navbar"] ul.main-menu:not(.main-menu_dropdown)'
        );

        this.eventBus.on(
            EventType.FEATURES_UPDATE,
            (features: FeaturesCollection) => {
                this.features = features;

                if (!this.features.addSettingsLinkToMenu || !mainMenu) {
                    return;
                }

                const compiled = template(menuItemHtml);
                const html = compiled({TOSTER_URL});
                const menuItem = createElementFromHTML(html);
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
        );
    }
}
