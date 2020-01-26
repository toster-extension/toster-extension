import { Storage } from '@/libs/storage';
import { StorageType } from '@/libs/types';

let storage: Storage;

describe('Storage', () => {
    beforeEach(() => {
        storage = new Storage(StorageType.OPTIONS);
    });

    it('should add record to storage', () => {
        storage.set<string>('key', 'value');
        const value = storage.get('key');
        expect(value).toEqual('value');
    });

    it('should remove record from storage', () => {
        storage.set<string>('key', 'value');
        storage.remove('key');
        const value = storage.get('key');
        expect(value).toEqual(null);
    });

    it('should push record to storage if storage element is array', () => {
        storage.set<Record<string, number>[]>('key', [{id: 1}]);
        storage.push<Record<string, number>>('key', {id: 1}, 'id');
        storage.push<Record<string, number>>('key', {id: 2}, 'id');
        const value = storage.get('key');
        expect(value).toEqual([{id: 1}, {id: 2}]);
    });

    it('should return all records from storage', () => {
        storage.set<string>('key', 'value');
        storage.set<string>('key2', 'value2');
        const value = storage.getAll<Record<string, string>>();
        expect(value).toEqual({
            key: 'value',
            key2: 'value2',
        });
    });
});
