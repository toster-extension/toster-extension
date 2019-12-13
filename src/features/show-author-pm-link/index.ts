import { browser } from 'webextension-polyfill-ts';
import {
    EventType,
    FeaturesAttribute,
    FeaturesCollection,
} from '@/features/types';
import { Feature } from '@/entity/feature';
import { User } from '@/entity/user';
import { createElementFromHTML } from '@/libs/utils';
import css from './style.scss';

export class ShowAuthorPMLink extends Feature {
    async execute (): Promise<void> {
        const userBlock = document.querySelector('.user-summary__desc');

        this.eventBus.on(
            EventType.FEATURES_UPDATE,
            (features: FeaturesCollection) => {
                this.features = features;

                if (
                    this.features.showAuthorPMLink &&
                    this.onQuestionPage &&
                    userBlock
                ) {
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
                    const title = browser.i18n.getMessage('pmLinkTitle');
                    const text = browser.i18n.getMessage('pmLinkText');
                    const link = createElementFromHTML(
                        `<a href="${user.habrPMUrl}" class="habr-pm-link" target="_blank" title="${title}">${text}</a>`
                    );

                    this.injectCSSToPage(css);

                    userBlock.insertBefore(
                        link,
                        userBlock.querySelector('.user-summary__nickname')
                            .nextElementSibling
                    );

                    this.setBodyAttribute(
                        FeaturesAttribute.SHOW_AUTHOR_PM_LINK,
                        'enabled'
                    );
                }
            }
        );
    }
}
