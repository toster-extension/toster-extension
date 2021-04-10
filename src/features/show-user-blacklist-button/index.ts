import { template } from 'lodash-es';
import { browser } from 'webextension-polyfill-ts';
import { EventType, FeaturesAttribute, FeaturesCollection } from '@/features/types';
import { User } from '@/entity/user';
import { Feature } from '@/entity/feature';
import { createElementFromHTML } from '@/libs/utils';
import { MessageData, MessageType } from '@/libs/types';
import css from './style.scss';
import addIconHtml from './add-icon.html';
import returnIconHtml from './return-icon.html';

export class ShowUserBlacklistButton extends Feature {
  async execute (): Promise<void> {
    const userBlock = document.querySelector('.user-summary__desc');

    /* jscpd:ignore-start */
    this.eventBus.on(
      EventType.FEATURES_UPDATE,
      (features: FeaturesCollection) => {
        this.features = features;

        if (
          !this.features.showUserBlacklistButton ||
                    !this.onQuestionPage ||
                    !userBlock
        ) {
          return;
        }

        const name = (userBlock.querySelector(
          '.user-summary__name'
        ) as HTMLDivElement).innerText.trim();
        const nick = (userBlock.querySelector(
          '.user-summary__nickname'
        ) as HTMLDivElement).innerText
          .trim()
          .replace(/\s+/g, '')
          .replace(/^@/, '');
        const user = new User(name, nick);
        /* jscpd:ignore-end */

        let icon: HTMLElement = null;

        if (!this.features.authorsBlacklist.includes(user.fullName)) {
          const title = browser.i18n.getMessage('addUserBlacklistButtonTitle');
          const compiled = template(addIconHtml);
          const html = compiled({title});
          icon = createElementFromHTML(html);

          icon.addEventListener('click', () => {
            browser.runtime.sendMessage(<MessageData>{
              type: MessageType.ADD_USER_TO_BLACKLIST,
              data: {user},
            });
          });

        } else {
          const title = browser.i18n.getMessage('removeUserBlacklistButtonTitle');
          const compiled = template(returnIconHtml);
          const html = compiled({title});
          icon = createElementFromHTML(html);

          icon.addEventListener('click', () => {
            browser.runtime.sendMessage(<MessageData>{
              type: MessageType.REMOVE_USER_FROM_BLACKLIST,
              data: {user},
            });
          });
        }

        this.injectCSSToPage(css);

        userBlock.insertBefore(
          icon,
          userBlock.querySelector('.user-summary__nickname')
            .nextElementSibling
        );

        this.setBodyAttribute(
          FeaturesAttribute.SHOW_USER_BLACKLIST_BUTTON,
          'enabled'
        );
      }
    );
  }
}
