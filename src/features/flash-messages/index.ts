import { EventType, FeaturesAttribute } from '@/features/types';
import { Feature } from '@/entity/feature';
import { FlashMessage, FlashMessageType } from '@/libs/types';
import { createElementFromHTML } from '@/libs/utils';

export class FlashMessages extends Feature {
    async execute (): Promise<void> {
        this.eventBus.on(
            EventType.SHOW_FLASH_MESSAGES,
            (flashMessages: FlashMessage[]) => {
                this.showFlashMessages(flashMessages);
            }
        );
    }

    protected showFlashMessage (message: FlashMessage) {
        const container = document.querySelector(
            '.flash-notices[role="notices_container_flash"]'
        );

        if (container) {
            const existsMessage = !!container.querySelector(
                `[data-flash-id="${message.id}"]`
            );

            if (existsMessage) {
                return;
            }

            let className = '';
            switch (message.type) {
                case FlashMessageType.INFO:
                default:
                    className = 'alert_info';
                    break;
                case FlashMessageType.WARNING:
                    className = 'alert_warning';
                    break;
                case FlashMessageType.ERROR:
                    className = 'alert_error';
                    break;
                case FlashMessageType.SUCCESS:
                    className = 'alert_success';
                    break;
            }
            const html = `
<div class="alert alert_sticky ${className}" data-flash-id="${message.id}">${message.html}</div>`;

            container.appendChild(createElementFromHTML(html));

            if (message.handler) {
                document
                    .querySelector(`[data-flash-id="${message.id}"]`)
                    .addEventListener(message.handler.type, () =>
                        this.injectJavaScriptToPage(message.handler.event)
                    );
            }
        }
    }

    private async showFlashMessages (flashMessages: FlashMessage[]) {
        flashMessages.forEach((flashMessage) => {
            this.showFlashMessage(flashMessage);
        });

        if (flashMessages.length) {
            this.setBodyAttribute(FeaturesAttribute.FLASH_MESSAGES, 'enabled');
        }
    }
}
