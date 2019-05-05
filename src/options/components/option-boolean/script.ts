import { Component, Model, Prop, Vue } from 'vue-property-decorator';

@Component
export default class OptionBoolean extends Vue {
    @Prop({ type: String, required: true }) name: string;
    @Model('change', { type: Boolean, required: true }) value: boolean;

    checked: boolean = false;

    change () {
        this.checked = !this.checked;
        this.$emit('change', this.checked);
    }

    // @ts-ignore-line
    private created () {
        this.checked = this.value;
    }
}
