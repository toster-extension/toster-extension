import { browser } from 'webextension-polyfill-ts';
import { Component, Inject, Vue, Watch } from 'vue-property-decorator';
import { OptionBoolean } from '@/options/components/option-boolean';
import { Storage } from '@/libs/storage';
import { FeaturesCollection } from '@/features';

@Component({
  components: {
    OptionBoolean,
  },
})
export default class SoundsList extends Vue {
    @Inject() storage: Storage;
    @Inject() questionsStorage: Storage;

    labelText: string = browser.i18n.getMessage('optionsUseNotificationSound');
    playSoundText: string = browser.i18n.getMessage('playSound');
    showList = false;
    value = '';

    get config (): FeaturesCollection {
      return this.storage.getAll<FeaturesCollection>();
    }

    get options (): string[] {
      return Array.from({ length: 7 }, (_, i) => i + 1).map(
        (index) => `sounds/${index}.mp3`
      );
    }

    play (): void {
      if (this.value) {
        const audio = new Audio(browser.runtime.getURL(this.value));

        if (audio) {
          audio.play();
        }
      }
    }

    updateBooleanOptions (value: boolean): void {
      this.storage.set<typeof value>('useNotificationSound', value);
      this.showList = value;
    }

    @Watch('value', { deep: true })
    valueChange (value: string): void {
      if (value) {
        this.$emit('change', value);
      } else {
        this.value = this.options[0];
      }
    }

    created (): void {
      const { sound } = this.config;
      const index = this.options.findIndex((name) => name === sound);

      if (index > -1) {
        this.value = sound;
      } else {
        this.value = this.options[0];
      }

      this.showList = this.config.useNotificationSound;
    }
}
