import { browser } from 'webextension-polyfill-ts';
import { uniqBy } from 'lodash-es';
import { Component, Inject, Vue, Watch } from 'vue-property-decorator';
import { OptionBoolean } from '@/options/components/option-boolean';
import { Storage } from '@/libs/storage';
import { MessageData, MessageType, Tag } from '@/libs/types';
import { FeaturesCollection } from '@/features';

@Component({
  components: {
    OptionBoolean,
  },
})
export default class TagsBlackist extends Vue {
    @Inject() tagsList: Tag[];
    @Inject() storage: Storage;

    placeholder: string = browser.i18n.getMessage('addTagPlaceholder');
    cleanButonText: string = browser.i18n.getMessage('buttonClean');
    labelText: string = browser.i18n.getMessage('optionsUseTagsBlackList');
    showList = false;
    value: Tag[] = [];

    get config (): FeaturesCollection {
      return this.storage.getAll<FeaturesCollection>();
    }

    get options () {
      return uniqBy<Tag>(this.tagsList.concat(this.value), 'name');
    }

    updateBooleanOptions (value: boolean) {
      this.storage.set<typeof value>('useTagsBlackList', value);
      this.showList = value;

      browser.runtime.sendMessage(<MessageData>{
        type: MessageType.UPDATE_OPTIONS,
      });
    }

    cleanBlacklist () {
      this.$dialog
        .confirm(this.$i18n('optionsCleanListText', ['список тегов']))
        .then(() => {
          this.value = [];
        });
    }

    addTag (name: string) {
      const tag = {
        name,
        slug: decodeURIComponent(name)
          .replace(/\d+/g, '-')
          .toLowerCase(),
        image: '',
      };
      this.options.push(tag);
      this.value.push(tag);
    }

    @Watch('value', { deep: true })
    valueChange (value: Tag[]) {
      this.$emit('change', value);
    }

    created () {
      this.value = this.config.tagsBlacklist.slice();
      this.showList = this.config.useTagsBlackList;
    }
}
