import { EventType, FeaturesCollection } from '@/features/types';
import { Feature } from '@/entity/feature';

export class NormalizeDate extends Feature {
    async execute (): Promise<void> {
        const dateBlocks = document.querySelectorAll('time[datetime]');

        this.eventBus.on(
            EventType.FEATURES_UPDATE,
            (features: FeaturesCollection) => {
                this.features = features;

                if (!this.features.normalizeDate) {
                    return;
                }

                const blocks = <HTMLTimeElement[]>Array.from(dateBlocks);

                this.normalize(blocks);
            }
        );
    }

    private normalize (dateBlocks: HTMLTimeElement[]) {
        const currentYear = new Date().getFullYear();

        Array.from(dateBlocks).forEach((block: HTMLTimeElement) => {
            const dateTime = block.getAttribute('title');

            if (!dateTime) {
                return;
            }

            let dateString = dateTime
                .replace(/^([^\d]+)/i, '')
                .replace(/,/g, '')
                .trim();
            const yearFromDateString = dateString.match(
                /\d{4}/
            );

            if (
                String(yearFromDateString) ===
                String(currentYear)
            ) {
                dateString = dateString.replace(
                    new RegExp(
                        String(yearFromDateString),
                        'ig'
                    ),
                    ''
                );
            }

            if (this.onQuestionPage) {
                const span = <HTMLSpanElement>block.closest('span');

                if (span) {
                    span.firstChild.remove();
                }
            }

            block.innerHTML = dateString;
        });
    }
}
