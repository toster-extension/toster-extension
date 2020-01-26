import { asyncForEach, createElementFromHTML } from '@/libs/utils';

describe('Utils', () => {
    describe('createElementFromHTML', () => {
        it('return is HTMLElement', () => {
            const div = createElementFromHTML('<div class="test"></div>');
            expect('classList' in div).toBe(true);
            expect(div.classList.contains('test')).toEqual(true);
        });
    });

    describe('asyncForEach', () => {
        it('multiplies each number in the array by 2', async () => {
            const numbers = [1, 2, 3, 4, 5];
            const result = [];
            const callback = async (n: number) => result.push(n * 2);
            await asyncForEach<number>(numbers, callback);
            expect(result).toEqual([2, 4, 6, 8, 10]);
        });
    });
});
