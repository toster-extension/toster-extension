import { Component, Prop, Vue } from 'vue-property-decorator';
import Tab from './tab';

export interface Options {
    useUrlFragment: boolean
    defaultTabHash: string
}

@Component
export default class Tabs extends Vue {
    @Prop({
        type: Object,
        default: () => ({
            useUrlFragment: true,
            defaultTabHash: null,
        }),
    })
    options: Options;

    tabs: Tab[] = [];
    activeTabHash: string = '';
    activeTabIndex: number = 0;
    lastActiveTabHash: string = '';

    findTab (hash: string) {
        return this.tabs.find((tab) => tab.hash === hash);
    }

    selectTab (selectedTabHash: string, event: Event = null) {
        if (event && !this.options.useUrlFragment) {
            event.preventDefault();
        }

        const selectedTab = this.findTab(selectedTabHash);

        if (!selectedTab) {
            return;
        }

        if (selectedTab.isDisabled) {
            event.preventDefault();

            return;
        }

        if (this.lastActiveTabHash === selectedTab.hash) {
            this.$emit('clicked', { tab: selectedTab });

            return;
        }

        this.tabs.forEach((tab) => {
            tab.isActive = tab.hash === selectedTab.hash;
        });

        this.$emit('changed', { tab: selectedTab });

        this.activeTabHash = selectedTab.hash;
        this.activeTabIndex = this.getTabIndex(selectedTabHash);
        this.lastActiveTabHash = this.activeTabHash = selectedTab.hash;
    }

    setTabVisible (hash: string, visible: boolean) {
        const tab = this.findTab(hash);

        if (!tab) {
            return;
        }

        tab.isVisible = visible;

        if (tab.isActive) {
            tab.isActive = visible;

            this.tabs.every((tabItem) => {
                if (tabItem.isVisible) {
                    tabItem.isActive = true;

                    return false;
                }

                return true;
            });
        }
    }

    getTabIndex (hash: string) {
        const tab = this.findTab(hash);

        return this.tabs.indexOf(tab);
    }

    getTabHash (index: number) {
        const tab = this.tabs.find(
            (tabItem) => this.tabs.indexOf(tabItem) === index
        );

        if (!tab) {
            return;
        }

        return tab.hash;
    }

    getActiveTab () {
        return this.findTab(this.activeTabHash);
    }

    getActiveTabIndex () {
        return this.getTabIndex(this.activeTabHash);
    }

    // @ts-ignore-line
    private created () {
        this.tabs = <Tab[]>this.$children;
    }

    // @ts-ignore-line
    private mounted () {
        window.addEventListener('hashchange', () =>
            this.selectTab(window.location.hash)
        );

        if (this.findTab(window.location.hash)) {
            this.selectTab(window.location.hash);

            return;
        }

        const previousSelectedTabHash = this.lastActiveTabHash;

        if (this.findTab(previousSelectedTabHash)) {
            this.selectTab(previousSelectedTabHash);

            return;
        }

        if (
            this.options.defaultTabHash &&
            this.findTab(`#${this.options.defaultTabHash}`)
        ) {
            this.selectTab(`#${this.options.defaultTabHash}`);

            return;
        }

        if (this.tabs.length) {
            this.selectTab(this.tabs[0].hash);
        }
    }
}
