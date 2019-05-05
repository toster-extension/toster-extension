import { browser } from 'webextension-polyfill-ts';
import Vue from 'vue';
import VuejsDialog from 'vuejs-dialog';
import Multiselect from 'vue-multiselect';
import App from './app.vue';
import { Storage } from '@/libs/storage';
import { StorageType } from '@/libs/types';
import { defaultFeaturesCollection, FeaturesCollection } from '@/features';
import tagsList from 'assets/tags.json';

Vue.component('Multiselect', Multiselect);
Vue.use(VuejsDialog, {
    html: true,
    loader: false,
    animation: 'bounce',
    okText: browser.i18n.getMessage('buttonOK'),
    cancelText: browser.i18n.getMessage('buttonCancel'),
});
Vue.mixin({
    methods: {
        $i18n (key: string, args: string[] = []) {
            return browser.i18n.getMessage(key, args);
        },
    },
});

const questionsStorage = new Storage(StorageType.APP);
const storage = new Storage(StorageType.OPTIONS);
const config = storage.getAll<FeaturesCollection>();

if (
    Object.keys(config).length !== Object.keys(defaultFeaturesCollection).length
) {
    Object.entries(defaultFeaturesCollection).forEach(([key, value]) => {
        if (key in config) {
            storage.set(key, config[key]);
        } else {
            storage.set(key, value);
        }
    });
}

// tslint:disable-next-line
new Vue({
    provide: {
        tagsList,
        storage,
        questionsStorage,
    },
    render: (h) => h(App),
}).$mount('app');
