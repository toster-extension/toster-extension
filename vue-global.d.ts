import Vue from 'vue';

declare module 'vue/types/vue' {
    interface Vue {
        $dialog: any
        $i18n: (key: string, args?: string[]) => string
    }

    interface VueConstructor {
        $dialog: any
        $i18n: (key: string, args?: string[]) => string
    }
}
