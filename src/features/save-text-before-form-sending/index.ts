import { isEmpty } from 'lodash-es';
import { EventType, FeaturesAttribute, FeaturesCollection } from '@/features/types';
import { Feature } from '@/entity/feature';

export class SaveTextBeforeFormSending extends Feature {
    private questionId: string;

    async execute (): Promise<void> {
        this.eventBus.on(
            EventType.FEATURES_UPDATE,
            (features: FeaturesCollection) => {
                this.features = features;

                if (
                    !this.features.saveTextBeforeFormSending ||
                    !this.onQuestionPage
                ) {
                    return;
                }

                this.questionId = document
                    .querySelector('input[name="question_id"]')
                    .getAttribute('value');

                this.restoreFormFromStorage();

                document.addEventListener(
                    'submit',
                    this.removeFormFromStorage()
                );

                document.addEventListener(
                    'input',
                    this.saveFormToStorage()
                );

                this.setBodyAttribute(
                    FeaturesAttribute.SAVE_TEXT_BEFORE_FORM_SENDING,
                    'enabled'
                );
            }
        );
    }

    private saveFormToStorage () {
        return (event) => {
            const form = getForm(event.target);

            if (!form) {
                return;
            }

            const fieldName = getFieldName(form);
            const value = (event.target as HTMLTextAreaElement).value;

            if (value) {
                this.storage.set<typeof value>(
                    `${this.questionId}.${fieldName}`,
                    value
                );
            } else {
                this.removeFormFromStorage()({ target: form });
            }
        };
    }

    private restoreFormFromStorage () {
        const formsData = this.storage.get(this.questionId);
        if (formsData) {
            Object.entries(formsData).forEach(([key, value]) => {
                const form: HTMLFormElement =
                    document.querySelector(`form#${key}`) ||
                    document.querySelector(`form[role="${key}"]`);
                if (form) {
                    const textarea: HTMLTextAreaElement = form.querySelector(
                        'textarea.textarea'
                    );
                    textarea.value = <string>value;
                }
            });
        }
    }

    private removeFormFromStorage () {
        return (event) => {
            const form = <HTMLFormElement>event.target;

            if (!form) {
                return;
            }

            const fieldName = getFieldName(form);

            this.storage.remove(`${this.questionId}.${fieldName}`);

            const formsData = this.storage.get(this.questionId);

            if (isEmpty(formsData)) {
                this.storage.remove(this.questionId);
            }
        };
    }
}

function getForm (target: HTMLElement): HTMLFormElement {
    if (target.tagName.toLowerCase() !== 'textarea') {
        return;
    }

    const form = <HTMLFormElement>(event.target as any).closest('form');

    if (!form) {
        return;
    }

    return form;
}

function getFieldName (form: HTMLFormElement): string {
    return form.getAttribute('id') || form.getAttribute('role') || '';
}
