import { browser } from 'webextension-polyfill-ts';
import capitalize from 'lodash/capitalize';
import { Component, Inject, Prop, Vue, Watch } from 'vue-property-decorator';
import { OptionBoolean } from '@/options/components/option-boolean';
import { OptionNumber } from '@/options/components/option-number';
import { Storage } from '@/libs/storage';
import { FeaturesCollection } from '@/features';

@Component({
    components: {
        OptionBoolean,
        OptionNumber,
    },
})
export default class OptionBooleanNumber extends Vue {
    @Inject() storage: Storage;
    @Prop({ type: String, required: true }) booleanName: string;
    @Prop({ type: String, required: true }) numberName: string;
    @Prop({ type: String, default: 'msDelay' }) numberLabel: string;

    booleanLabelText: string = browser.i18n.getMessage(
        `options${capitalize(this.booleanName)}`
    );
    numberLabelText: string = browser.i18n.getMessage(this.numberLabel);
    showNumber: boolean = false;
    value: number = 0;

    get config (): FeaturesCollection {
        return this.storage.getAll<FeaturesCollection>();
    }

    updateBooleanOptions (value: boolean) {
        this.storage.set<typeof value>(this.booleanName, value);
        this.showNumber = value;
    }

    @Watch('value')
    // @ts-ignore-line
    private valueChange (value: number) {
        this.$emit('change', value);
    }

    // @ts-ignore-line
    private created () {
        this.showNumber = this.config[this.booleanName];
        this.value = this.config[this.numberName];
    }
}
