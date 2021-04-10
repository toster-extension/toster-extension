import { camelCase } from 'lodash-es';
import { Observable } from 'typescript-observable';
import { FeaturesAttribute, FeaturesCollection } from '@/features';
import { EventType } from '@/features/types';
import { User } from '@/entity/user';
import { createElementFromHTML } from '@/libs/utils';
import { Storage } from '@/libs/storage';
import { QuestionId, StorageType, Tag } from '@/libs/types';
import { TOSTER_URL } from '@/libs/constants';

export abstract class Feature {
    protected storage = new Storage(StorageType.CONTENT);
    protected features: FeaturesCollection = {};
    protected eventBus: Observable = null;

    protected get onQuestionPage (): boolean {
      return !!document.location.pathname.match(/\/q\/(\d+)/i);
    }

    protected get onUserQuestionsPage (): boolean {
      return !!document.location.pathname.match(
        /\/user\/([^\\/]+)\/questions/i
      );
    }

    protected get onUserAnswersPage (): boolean {
      const currentUser = this.currentUser;

      if (!currentUser) {
        return false;
      }

      const regexp = new RegExp(`/user/${currentUser.nick}/answers`, 'i');

      return !!document.location.pathname.match(regexp);
    }

    protected get questionsList (): HTMLLIElement[] {
      const questionsList = document.querySelectorAll<HTMLLIElement>(
        '.page__body .content-list[role="content-list"] .content-list__item[role="content-list_item"]'
      );

      return questionsList ? Array.from(questionsList) : [];
    }

    protected get top24QuestionsList (): HTMLLIElement[] {
      const questionsList = document.querySelectorAll<HTMLLIElement>(
        'aside.column_sidebar [role="most_interest"] .content-list.content-list_sidebar-block > .content-list__item'
      );

      return questionsList ? Array.from(questionsList) : [];
    }

    protected get currentUser (): User {
      const userLink = document.querySelector<HTMLAnchorElement>(
        '.user-panel_head a.user-panel__user-name'
      );

      if (!userLink) {
        return null;
      }

      const name = userLink.innerText.trim();
      const nick = userLink
        .getAttribute('href')
        .trim()
        .split('/')
        .pop();
      const user = new User(name, nick);

      return user;
    }

    setObservers (eventBus: Observable): void {
      this.eventBus = eventBus;

      this.eventBus.on(
        EventType.FEATURES_UPDATE,
        (features: FeaturesCollection) => {
          this.features = features;
        }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    async execute (): Promise<void> {}

    protected getAuthorBlock (
      author: User,
      showName = true,
      showNick = true
    ): HTMLElement {
      return createElementFromHTML(`
<div class="user-summary__desc" data-user-url="${author.tosterUserPageUrl}">
    ${
  showName
    ? `<a class="user-summary__name" href="${author.tosterUserPageUrl}">${author.name}</a>`
    : ''
}
    ${
  showNick
    ? `<span class="user-summary__nickname">@${author.nick}</span>`
    : ''
}
</div>
`);
    }

    protected setBodyAttribute (
      featureName: FeaturesAttribute,
      value: string
    ): void {
      document.body.setAttribute(`data-feature-${camelCase(featureName)}`, value);
    }

    protected removeQuestionById (id: QuestionId): void {
      const element = document.querySelector(`[data-question-id="${id}"]`);

      if (element) {
        element.parentElement.removeChild(element);
      }
    }

    protected injectCSSToPage (codeOrUrl: string, inline = true): void {
      if (inline) {
        const style = document.createElement('style');
        style.textContent = codeOrUrl;
        document.head.appendChild(style);
      } else {
        const link = document.createElement('link');
        link.href = codeOrUrl;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
    }

    protected injectJavaScriptToPage (
      codeOrUrl: string,
      inline = true
    ): void {
      const script = document.createElement('script');
      if (inline) {
        script.textContent = codeOrUrl;
      } else {
        script.src = codeOrUrl;
      }
      document.head.appendChild(script);
    }

    protected makeTags (
      tags: Tag[],
      includeImage = true
    ): HTMLUListElement {
      const ul = document.createElement('ul');
      ul.className = 'tags-list';

      tags.forEach((tag: Tag) => {
        const li = document.createElement('li');
        const tagLink = document.createElement('a');

        if (includeImage) {
          const imageLink = document.createElement('a');
          const imageImg = document.createElement('img');

          imageLink.className = 'question__tags-image';
          imageLink.href = `${TOSTER_URL}/tag/${tag.slug}`;
          imageImg.className = 'tag__image tag__image_bg';
          imageImg.src = tag.image;

          if (tag.image) {
            imageLink.appendChild(imageImg);
            li.appendChild(imageLink);
          }
        }

        li.className = 'tags-list__item';
        tagLink.href = `${TOSTER_URL}/tag/${tag.slug}`;
        tagLink.innerText = tag.name;

        li.appendChild(tagLink);
        ul.appendChild(li);
      });

      return ul;
    }
}
