import { BaseEntity } from '@/entity/base-entity';
import { HABR_URL, TOSTER_URL } from '@/libs/constants';

export class User extends BaseEntity {
    constructor (public name: string, public nick: string) {
        super();
    }

    get fullName (): string {
        return `${this.name} @${this.nick}`;
    }

    get tosterUserPageUrl (): string {
        return `${TOSTER_URL}/user/${this.nick}`;
    }

    get habrProfileUrl (): string {
        return `${HABR_URL}/users/${this.nick}`.toLowerCase();
    }

    get habrPMUrl (): string {
        return `${HABR_URL}/conversations/${this.nick}`.toLowerCase();
    }
}
