import capitalize from 'lodash/capitalize';
import { Component, Inject, Prop, Vue, Watch } from 'vue-property-decorator';
import { Storage } from '@/libs/storage';
import { FeaturesCollection } from '@/features';
import { ListItem } from './types';

@Component
export default class OptionList extends Vue {
    @Inject() storage: Storage;

    @Prop({ type: String, required: true }) optionKey: string;
    @Prop({ type: Array, default: () => [] }) options: ListItem[];

    value = null;

    private get config (): FeaturesCollection {
        return this.storage.getAll<FeaturesCollection>();
    }

    @Watch('value', { deep: true })
    // @ts-ignore-line
    private valueChange (value) {
        if (value) {
            this.$emit('change', value.name);
        } else {
            this.value = this.options[0];
        }
    }

    // @ts-ignore-line
    private created () {
        const name = this.config[this.optionKey];

        this.value = {
            name,
            label: this.$i18n(
                `options${capitalize(`${this.optionKey}${name}`)}`
            ),
        };
    }
}
