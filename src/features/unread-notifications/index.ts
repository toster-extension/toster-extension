import Favico from 'favico.js';
import { EventType, FeaturesAttribute } from '@/features/types';
import { Feature } from '@/entity/feature';
import { NotificationsData } from '@/libs/types';

let lastCount = 0;

export class UnreadNotifications extends Feature {
    private favicon = new Favico({
        animation: 'popFade',
    });

    async execute (): Promise<void> {
        this.eventBus.on(
            EventType.NOTIFICATIONS_UPDATE,
            (notifications: NotificationsData) => {
                if (this.features.checkNotifications) {
                    this.updateNotifications(notifications);
                }
            }
        );
    }

    private showNotificationsCountOnFavicon (count: number) {
        if (count && count !== lastCount) {
            this.favicon.badge(count);
        } else if (!count) {
            this.favicon.reset();
        }

        lastCount = count;
    }

    private async updateNotifications (notifications: NotificationsData) {
        const eventsList = document.querySelector('ul.events-list');

        if (eventsList) {
            eventsList.innerHTML = notifications ? notifications.html : '';
        }

        if (this.features.showNotificationsCountOnFavicon) {
            this.showNotificationsCountOnFavicon(
                notifications ? notifications.count : 0
            );
        }

        this.setBodyAttribute(FeaturesAttribute.CHECK_NOTIFICATIONS, 'enabled');
    }
}
