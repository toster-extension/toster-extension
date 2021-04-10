import { browser } from 'webextension-polyfill-ts';
import { capitalize } from 'lodash-es';
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

    showNumber = false;
    value = 0;

    get booleanLabelText (): string {
      return browser.i18n.getMessage(
        `options${capitalize(this.booleanName)}`
      );
    }

    get numberLabelText (): string {
      return browser.i18n.getMessage(this.numberLabel);
    }

    get config (): FeaturesCollection {
      return this.storage.getAll<FeaturesCollection>();
    }

    updateBooleanOptions (value: boolean) {
      this.storage.set<typeof value>(this.booleanName, value);
      this.showNumber = value;
    }

    @Watch('value')
    valueChange (value: number) {
      this.$emit('change', value);
    }

    created () {
      this.showNumber = this.config[this.booleanName];
      this.value = this.config[this.numberName];
    }
}
