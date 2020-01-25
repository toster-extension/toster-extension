import debounce from 'lodash/debounce';
import {
    EventType,
    FeaturesAttribute,
    FeaturesCollection,
} from '@/features/types';
import { createElementFromHTML } from '@/libs/utils';
import { Feature } from '@/entity/feature';
import css from './style.scss';
import buttonHtml from './button.html';

export class ScrollToTop extends Feature {
    async execute (): Promise<void> {
        this.eventBus.on(
            EventType.FEATURES_UPDATE,
            (features: FeaturesCollection) => {
                this.features = features;

                if (!this.features.scrollToTop) {
                    return;
                }

                this.injectCSSToPage(css);
                this.setupButton();
            }
        );
    }

    private setupButton () {
        const body = document.querySelector('body');
        const button = createElementFromHTML(buttonHtml);

        body.appendChild(button);

        button.addEventListener('click', (e: Event) => {
            e.preventDefault();
            this.scrollToTop();
        });

        document.addEventListener('scroll', debounce(() => {
            if (window.pageYOffset > 100) {
                button.classList.remove('hidden');
            } else {
                button.classList.add('hidden');
            }
        },                                           200));

        document.dispatchEvent(new Event('scroll'));

        this.setBodyAttribute(FeaturesAttribute.SCROLL_TO_TOP, 'enabled');
    }

    private scrollToTop () {
        const offsetY = document.documentElement.scrollTop || document.body.scrollTop;

        if (offsetY > 0) {
            window.requestAnimationFrame(() => this.scrollToTop());
            window.scrollTo(0, offsetY - offsetY / 8);
        }
    }
}
