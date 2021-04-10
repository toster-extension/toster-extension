import { browser } from 'webextension-polyfill-ts';
import { uniqBy } from 'lodash-es';
import { Component, Inject, Vue, Watch } from 'vue-property-decorator';
import { OptionBoolean } from '@/options/components/option-boolean';
import { Question } from '@/entity/question';
import { Storage } from '@/libs/storage';
import { BlackListAuthor, MessageData, MessageType } from '@/libs/types';
import { FeaturesCollection } from '@/features';

@Component({
  components: {
    OptionBoolean,
  },
})
export default class AuthorsBlackist extends Vue {
    @Inject() storage: Storage;
    @Inject() questionsStorage: Storage;

    placeholder: string = browser.i18n.getMessage('addAuthorPlaceholder');
    cleanButtonText: string = browser.i18n.getMessage('buttonClean');
    labelText: string = browser.i18n.getMessage('optionsUseAuthorsBlackList');
    labelAnswersAndCommentsText: string = browser.i18n.getMessage(
      'optionsUseAuthorsBlackListForAnswersAndComments'
    );
    showList = false;
    value: BlackListAuthor[] = [];

    get config (): FeaturesCollection {
      return this.storage.getAll<FeaturesCollection>();
    }

    get options () {
      return uniqBy<BlackListAuthor>(
        this.authorsList.concat(this.value),
        'name'
      );
    }

    get authorsList () {
      return this.questionsStorage
        .get<Question[]>('questions', [])
        .map((question: Question) => ({
          name: question.author.fullName,
        }));
    }

    getName (name: string): string {
      return name
        .split('@')
        .slice(0, -1)
        .join(' ');
    }

    getNick (name: string): string {
      return `@${name.split('@').pop()}`;
    }

    updateBooleanOptions (key: string, value: boolean) {
      this.storage.set<typeof value>(key, value);

      if (key === 'useAuthorsBlackList') {
        this.showList = value;
      }

      browser.runtime.sendMessage(<MessageData>{
        type: MessageType.UPDATE_OPTIONS,
      });
    }

    cleanBlacklist () {
      this.$dialog
        .confirm(
          this.$i18n('optionsCleanListText', ['список пользователей'])
        )
        .then(() => {
          this.value = [];
        });
    }

    addAuthor (newAuthor: string) {
      const author = {
        name: newAuthor,
      };
      this.options.push(author);
      this.value.push(author);
    }

    @Watch('value', { deep: true })
    valueChange (value: BlackListAuthor[]) {
      this.$emit(
        'change',
        value.map((author: BlackListAuthor) => author.name)
      );
    }

    created () {
      this.value = this.config.authorsBlacklist.map((name: string) => ({
        name,
      }));
      this.showList = this.config.useAuthorsBlackList;
    }
}
