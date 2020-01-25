import template from 'lodash/template';
import { browser } from 'webextension-polyfill-ts';
import {
    EventType,
    FeaturesAttribute,
    FeaturesCollection,
} from '@/features/types';
import { Feature } from '@/entity/feature';
import { createElementFromHTML } from '@/libs/utils';
import spoilerHtml from './spoiler.html';

export class WrapSpoilerCodeBlocks extends Feature {
    async execute (): Promise<void> {
        const codeBlocks = document.querySelectorAll('pre > code');

        this.eventBus.on(
            EventType.FEATURES_UPDATE,
            (features: FeaturesCollection) => {
                this.features = features;

                if (
                    !this.features.wrapSpoilerCodeBlocks ||
                    !this.onQuestionPage
                ) {
                    return;
                }

                const blocks = Array.from(codeBlocks);

                this.wrapCodeBlocks(blocks);
            }
        );
    }

    private wrapCodeBlocks (codeBlocks: Element[]) {
        const spoilerText = browser.i18n.getMessage(
            'codeSpoilerText'
        );
        const compiled = template(spoilerHtml);
        const html = compiled({spoilerText});
        const spoiler = createElementFromHTML(html);

        codeBlocks
            .filter(
                (item) =>
                    !(item.parentNode
                        .parentNode as HTMLElement).classList.contains(
                        'spoiler_text'
                    )
            )
            .forEach((block: HTMLElement) => {
                const wrappedBlock = <HTMLElement>(
                    spoiler.cloneNode(true)
                );
                const lastChild = <HTMLElement>(
                    wrappedBlock.lastChild
                );
                lastChild.innerHTML = `<pre>${block.outerHTML}</pre>`;

                block.parentElement.parentElement.replaceChild(
                    wrappedBlock,
                    block.parentElement
                );
            });

        this.setBodyAttribute(
            FeaturesAttribute.WRAP_SPOILER_CODE_BLOCKS,
            'enabled'
        );
    }
}
