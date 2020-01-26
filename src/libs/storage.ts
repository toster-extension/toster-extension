import { get, isArray, isObject, set, uniqBy } from 'lodash-es';
import { StorageType } from '@/libs/types';

export class Storage {
    constructor (private storageKey: StorageType) {
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify({}));
        }
    }

    get<T = any> (key: string, defaultValue: any = null): T {
        const storage = this.storage;

        return get(storage, key, defaultValue);
    }

    set<T = any> (key: string, value: T): void {
        const storage = this.storage;
        set(storage, key, value);
        localStorage.setItem(this.storageKey, JSON.stringify(storage));
    }

    push<T = any> (key: string, value: T, uniqueKey: string = 'id'): void {
        const storage = this.storage;
        const oldVal = <T[]>get(storage, key);

        if (Array.isArray(oldVal)) {
            oldVal.push(value);
            set(storage, key, uniqBy<T>(oldVal, uniqueKey));
            localStorage.setItem(this.storageKey, JSON.stringify(storage));
        }
    }

    remove (key: string): void {
        const storage = this.storage;
        try {
            deletePropertyPath(storage, key);
        } finally {
            localStorage.setItem(this.storageKey, JSON.stringify(storage));
        }
    }

    getAll<T = any> (): T {
        return { ...this.storage };
    }

    private get storage () {
        return JSON.parse(localStorage.getItem(this.storageKey));
    }
}

function deletePropertyPath (target: object, path: string) {
    let targetObject: object = {};
    let splittedPath: string[] = [];

    if (!target || !path) {
        return;
    }

    if (target && isObject(target) && !isArray(target)) {
        targetObject = target;
    }

    if (typeof path === 'string') {
        splittedPath = path.split('.');
    }

    for (let i = 0; i < splittedPath.length - 1; i++) {
        const key = splittedPath[i];

        targetObject = targetObject[key];

        if (typeof targetObject === 'undefined') {
            return;
        }
    }

    delete targetObject[splittedPath.pop()];
}
