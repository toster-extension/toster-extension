import { browser } from 'webextension-polyfill-ts';
import {
  EventType,
  FeaturesAttribute,
  FeaturesCollection,
} from '@/features/types';
import { Feature } from '@/entity/feature';
import { TOSTER_URL } from '@/libs/constants';
import css from './style.scss';

export class DeleteNotDecisionAnswers extends Feature {
  async execute (): Promise<void> {
    this.eventBus.on(
      EventType.FEATURES_UPDATE,
      (features: FeaturesCollection) => {
        this.features = features;

        if (!this.features.deleteNotDecisionAnswers || !this.onUserAnswersPage) {
          return;
        }

        this.showButton();
      }
    );
  }

  private removeAnswers (answerIds: string[]) {
    this.injectJavaScriptToPage(`
    (function () {
        [${answerIds}].forEach(id => {
            $.ajax({
                url: '${TOSTER_URL}/answer/cm_remove',
                method: 'post',
                data: {
                    answer_id: String(id)
                },
                headers: {
                    'Accept': 'application/json, text/javascript',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                success: () => {
                    $('#answer_' + id).closest('li.content-list__item').remove();
                }
            });
        });
    })()`);
  }

  private async showButton () {
    const answersList = document.querySelector(
      '.content-list_answers_profile'
    );

    if (!answersList) {
      return;
    }

    const answerIds: string[] = Array.from(
      answersList.querySelectorAll('.content-list__item')
    )
      .filter(
        (answer: HTMLLIElement) =>
          window.getComputedStyle(
            answer.querySelector('.icon_check_answer')
          ).display === 'none'
      )
      .map(
        (answer) =>
          answer
            .querySelector('[id^="answer_"]')
            .getAttribute('id')
            .split('_')[1]
      );

    if (!answerIds.length) {
      return;
    }

    this.setBodyAttribute(
      FeaturesAttribute.DELETE_NOT_DECISION_ANSWERS,
      'enabled'
    );
    this.injectCSSToPage(css);

    const div = document.createElement('div');
    const button = document.createElement('button');
    div.innerHTML = `<div class="remove__all__answers__description">${browser.i18n.getMessage(
      'descriptionDeleteNotDecisionAnswers'
    )}</div>`;
    button.className = 'remove__all__answers';
    button.textContent = browser.i18n.getMessage(
      'buttonDeleteNotDecisionAnswers'
    );
    button.onclick = () => {
      this.removeAnswers(answerIds);
      div.remove();
    };

    div.insertBefore(button, div.firstChild);
    document.querySelector('.page__body').insertBefore(div, answersList);
  }
}
