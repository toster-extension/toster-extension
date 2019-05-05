import { browser } from 'webextension-polyfill-ts';
import uniqBy from 'lodash/uniqBy';
import { Component, Inject, Vue, Watch } from 'vue-property-decorator';
import { OptionBoolean } from '@/options/components/option-boolean';
import { Storage } from '@/libs/storage';
import { Tag } from '@/libs/types';
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
    showList: boolean = false;
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
    }

    cleanBlacklist () {
        this.$dialog
            .confirm(this.$i18n('optionsCleanListText', ['список тегов']))
            .then(() => {
                this.value = [];
            })
            .catch(() => {});
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
    // @ts-ignore-line
    private valueChange (value: Tag[]) {
        this.$emit('change', value);
    }

    // @ts-ignore-line
    private created () {
        this.value = this.config.tagsBlacklist.slice();
        this.showList = this.config.useTagsBlackList;
    }
}
