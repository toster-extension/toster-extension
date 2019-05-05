import { browser } from 'webextension-polyfill-ts';

export class Timer {
    private intervalMs: number = 10000;

    constructor (public name: string, seconds: number) {
        this.setInterval(seconds);
    }

    private get when (): number {
        return Date.now() + this.intervalMs;
    }

    setInterval (seconds: number) {
        this.intervalMs = seconds;
    }

    start () {
        browser.alarms.create(this.name, {
            when: this.when,
        });
    }

    stop () {
        browser.alarms.clear(this.name);
    }
}
