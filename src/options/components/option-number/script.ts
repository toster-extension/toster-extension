import { Component, Model, Prop, Vue } from 'vue-property-decorator';

@Component
export default class OptionNumber extends Vue {
    @Model('input', { type: Number, required: true }) value: number;
    @Prop({ type: String, required: true }) name: string;
    @Prop({ type: Number, default: 0 }) min: number;
    @Prop({ type: Number, default: 3600000 }) max: number; // 1 hour in milliseconds
    @Prop({ type: Number, default: 500 }) step: number; // default step is 0.5 second

    input ($event: Event) {
      const value = +($event.target as any).value;
      this.$emit('input', value);
    }
}
