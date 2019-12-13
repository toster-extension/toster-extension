/* jscpd:ignore-start */
import tippy from 'tippy.js';
import { browser } from 'webextension-polyfill-ts';
import {
    EventType,
    FeaturesAttribute,
    FeaturesCollection,
} from '@/features/types';
import { Feature } from '@/entity/feature';
import { HTTP } from '@/libs/http';
import theme from 'tippy.js/themes/light-border.css';
import css from './style.scss';
/* jscpd:ignore-end */

export class UserProfilePreview extends Feature {
    async execute (): Promise<void> {
        this.eventBus.on(
            EventType.FEATURES_UPDATE,
            (features: FeaturesCollection) => {
                this.features = features;

                if (this.features.userProfilePreview) {
                    this.injectCSSToPage(theme);
                    this.injectCSSToPage(css);

                    this.setupPreview();
                }
            }
        );
    }

    private setupPreview () {
        tippy('.page__body, .content-list_sidebar-block', {
            target: '.user-summary__desc',
            theme: 'light-border',
            content: browser.i18n.getMessage('previewFirstContent'),
            animateFill: true,
            interactive: true,
            arrow: true,
            maxWidth: 500,
            delay: [this.features.userProfilePreviewLoadingDelay, 0],
            animation: 'fade',
            flipOnUpdate: true,
            onShow (instance) {
                let a = null;

                /* jscpd:ignore-start */
                if ((instance.state as any).ajax === undefined) {
                    (instance.state as any).ajax = {
                        isFetching: false,
                        canFetch: true,
                    };
                }

                if (
                    (instance.state as any).ajax.isFetching ||
                    !(instance.state as any).ajax.canFetch
                ) {
                    return;
                }
                /* jscpd:ignore-end */

                a = instance.reference.querySelector('a.user-summary__name');

                if (!a) {
                    a = (instance.reference as HTMLDivElement).dataset.userUrl;
                }

                const url = typeof a === 'string' ? a : a.getAttribute('href');

                /* jscpd:ignore-start */
                const http = new HTTP();
                http.get(url).then((html) => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    /* jscpd:ignore-end */
                    const header = doc.querySelector('header.page-header');

                    instance.setContent(header.outerHTML);
                });
            },
            onHidden (instance) {
                (instance.state as any).ajax.canFetch = false;
            },
        });

        this.setBodyAttribute(
            FeaturesAttribute.USER_PROFILE_PREVIEW,
            'enabled'
        );
    }
}
