import { Component, Model, Prop, Vue } from 'vue-property-decorator';

@Component
export default class OptionBoolean extends Vue {
    @Prop({ type: String, required: true }) name: string;
    @Model('change', { type: Boolean, required: true }) value: boolean;

    checked = false;

    change () {
      this.checked = !this.checked;
      this.$emit('change', this.checked);
    }

    created () {
      this.checked = this.value;
    }
}
