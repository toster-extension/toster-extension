import { EventType, FeaturesAttribute } from '@/features/types';
import { QuestionId } from '@/libs/types';
import { Feature } from '@/entity/feature';
import { Question } from '@/entity/question';
import css from './style.scss';

export class ShowNameInTop24QuestionsList extends Feature {
  async execute (): Promise<void> {
    this.eventBus.on(
      EventType.TOP24_QUESTIONS_UPDATE,
      (questions: Question[]) => {
        if (
          (this.features.showNameInTop24QuestionsList ||
                        this.features.showNickInTop24QuestionsList) &&
                    this.top24QuestionsList.length
        ) {
          this.injectCSSToPage(css);
          this.showAuthor(questions);
        }
      }
    );
  }

  /* jscpd:ignore-start */
  private showAuthor (questions: Question[]) {
    this.top24QuestionsList.forEach((element: HTMLLIElement) => {
      const id = <QuestionId>element.getAttribute('data-question-id');
      const question = questions.find((item) => item.id === id);
      const authorBlock = <HTMLDivElement>this.getAuthorBlock(
        question.author,
        /* jscpd:ignore-end */
        this.features.showNameInTop24QuestionsList,
        this.features.showNickInTop24QuestionsList
      );

      if (question) {
        element.insertBefore(
          authorBlock,
          element.querySelector(
            'a.question__title-link.question__title_thin'
          )
        );
      }
    });

    if (this.features.showNameInTop24QuestionsList) {
      this.setBodyAttribute(
        FeaturesAttribute.SHOW_NAME_IN_TOP24_QUESTIONS_LIST,
        'enabled'
      );
    }

    if (this.features.showNickInTop24QuestionsList) {
      this.setBodyAttribute(
        FeaturesAttribute.SHOW_NICK_IN_TOP24_QUESTIONS_LIST,
        'enabled'
      );
    }
  }
}
