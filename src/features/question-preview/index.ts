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

export class QuestionPreview extends Feature {
    async execute (): Promise<void> {
        this.eventBus.on(
            EventType.FEATURES_UPDATE,
            (features: FeaturesCollection) => {
                this.features = features;

                if (!this.features.questionPreview) {
                    return;
                }

                this.injectCSSToPage(theme);
                this.injectCSSToPage(css);

                if (this.features.replaceCodeInPreview) {
                    this.setBodyAttribute(
                        FeaturesAttribute.REPLACE_CODE_IN_PREVIEW,
                        'enabled'
                    );
                }

                this.setupPreview();
            }
        );
    }

    private setupPreview () {
        tippy('.question__title-link', {
            theme: 'light-border',
            content: browser.i18n.getMessage('previewFirstContent'),
            animateFill: true,
            interactive: true,
            arrow: true,
            maxWidth: 700,
            delay: [this.features.questionPreviewLoadingDelay, 0],
            animation: 'fade',
            flipOnUpdate: true,
            onShow (instance) {
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

                const url = instance.reference.getAttribute('href');

                /* jscpd:ignore-start */
                const http = new HTTP();
                http.get(url).then((html) => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    /* jscpd:ignore-end */
                    const question = doc.querySelector(
                        '.question__text.js-question-text'
                    );
                    let content = question.outerHTML;
                    const replaceEnabled = document.body.getAttribute(
                        'data-feature-replacecodeinpreview'
                    );

                    if (replaceEnabled === 'enabled') {
                        Array.from(question.querySelectorAll('code')).forEach(
                            (code) => {
                                code.innerHTML = '[CODE]';
                            }
                        );
                        content = question.outerHTML;
                    }

                    instance.setContent(content);
                });
            },
            onHidden (instance) {
                (instance.state as any).ajax.canFetch = false;
            },
        });

        this.setBodyAttribute(FeaturesAttribute.QUESTION_PREVIEW, 'enabled');
    }
}
