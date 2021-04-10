import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Tab extends Vue {
    @Prop({ type: String, required: true }) name: string;
    @Prop({ type: String, default: '' }) id: string;
    @Prop({ type: String, default: '' }) prefix: string;
    @Prop({ type: String, default: '' }) suffix: string;
    @Prop({ type: Boolean, default: false }) isDisabled: boolean;

    isActive = false;
    isVisible = true;

    get header (): string {
      return this.prefix + this.name + this.suffix;
    }

    get computedId (): string {
      return this.id || this.name.toLowerCase().replace(/ /g, '-');
    }

    get hash (): string {
      if (this.isDisabled) {
        return '#';
      }

      return `#${this.computedId}`;
    }
}
