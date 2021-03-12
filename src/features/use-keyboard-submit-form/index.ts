import { browser } from 'webextension-polyfill-ts';
import {
    EventType,
    FeaturesAttribute,
    FeaturesCollection,
} from '@/features/types';
import { Feature } from '@/entity/feature';

export class UseKeyboardSubmitForm extends Feature {
    private placeholder = browser.i18n.getMessage('submitFormPlaceholder');

    async execute (): Promise<void> {
        this.eventBus.on(
            EventType.FEATURES_UPDATE,
            (features: FeaturesCollection) => {
                this.features = features;

                if (
                    !this.features.useKeyboardSubmitForm ||
                    !this.onQuestionPage
                ) {
                    return;
                }

                document.addEventListener('keydown', (event) => {
                    if (
                        (event.ctrlKey || event.metaKey) &&
                        (event.keyCode === 13 || event.keyCode === 10)
                    ) {
                        this.ctrlEnterHandler(event);
                    }
                });

                document.addEventListener('click', (event) =>
                    this.deleteButtonClickHandler(event)
                );

                this.setPlaceholder();

                this.setBodyAttribute(
                    FeaturesAttribute.USE_KEYBOARD_SUBMIT_FORM,
                    'enabled'
                );
            }
        );
    }

    private ctrlEnterHandler (event) {
        if (event.target.classList.contains('textarea')) {
            const form = <HTMLFormElement>event.target.form;
            const button = <HTMLButtonElement>(
                form.querySelector('button[type="submit"]')
            ) || <HTMLButtonElement>(
                form.querySelector('button[role="btn_submit"]')
            );
            if (button) {
                button.removeAttribute('disabled');
                button.click();
                this.setPlaceholder();
            }
        }
    }

    private deleteButtonClickHandler (event) {
        if (event.target.classList.contains('menu__item-link_delete')) {
            this.setPlaceholder();
        }
    }

    private setPlaceholder () {
        setTimeout(() => {
            const textareas = document.querySelectorAll('textarea.textarea');
            if (textareas) {
                textareas.forEach((textarea) => {
                    textarea.setAttribute('placeholder', this.placeholder);
                });
            }
        },         1000);
    }
}
