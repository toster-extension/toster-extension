import { /*asyncForEach,*/ createElementFromHTML } from '@/libs/utils';

describe('Utils test', () => {
    describe('createElementFromHTML', () => {
        it('returned is HTMLElement', () => {
            const div = createElementFromHTML('<div class="test"></div>');
            expect('classList' in div).toBe(true);
            expect(div.classList.contains('test')).toBe(true);
        });
    });
});
