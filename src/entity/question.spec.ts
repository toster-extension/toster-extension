import { Question } from '@/entity/question';
import { User } from '@/entity/user';
import { QuestionId, Tag } from '@/libs/types';

let question: Question;
let author: User;
const questionId: QuestionId = '1';
const name = 'User';
const nick = 'nick';
const tags: Tag[] = [];

const db = {
    authorsBlacklist: [],
    tagsBlacklist: [],
};

describe('Question', () => {
    beforeEach(() => {
        localStorage.setItem('options', JSON.stringify(db));
        author = new User(name, nick);
        question = new Question(questionId, author, tags);
    });

    it('question.id contains only numbers', () => {
        question = new Question('qq1ww', author, tags);
        expect(question.id).toEqual('1');
    });

    describe('question.isHiddenByAuthor', () => {
        it('is false by default', () => {
            expect(question.isHiddenByAuthor).toEqual(false);
        });

        it('is false if authorsBlacklist does not contain the author name', () => {
            db.authorsBlacklist = ['name @nickname'];
            localStorage.setItem('options', JSON.stringify(db));
            expect(question.isHiddenByAuthor).toEqual(false);
        });

        it('is true if authorsBlacklist does contain the author name', () => {
            db.authorsBlacklist = [author.fullName];
            localStorage.setItem('options', JSON.stringify(db));
            expect(question.isHiddenByAuthor).toEqual(true);
        });
    });

    describe('question.isHiddenByTags', () => {
        it('is false by default', () => {
            expect(question.isHiddenByTags).toEqual(false);
        });

        it('is false if tagsBlacklist does not contain any tags', () => {
            db.tagsBlacklist = [{
                name: 'black-name',
                slug: 'black-name-slug',
                image: '',
            }];
            localStorage.setItem('options', JSON.stringify(db));
            question = new Question(questionId, author, [{
                name: 'name',
                slug: 'slug',
                image: '',
            }]);
            expect(question.isHiddenByTags).toEqual(false);
        });

        it('is true if tagsBlacklist does contain any tags', () => {
            db.tagsBlacklist = [{
                name: 'black-name',
                slug: 'black-name-slug',
                image: '',
            }];
            localStorage.setItem('options', JSON.stringify(db));
            question = new Question(questionId, author, db.tagsBlacklist);
            expect(question.isHiddenByTags).toEqual(true);
        });
    });

    it('method toJSON return getters', () => {
        question = new Question('1', author, tags);
        const json = JSON.parse(JSON.stringify(question));
        expect('isHiddenByAuthor' in json).toEqual(true);
        expect('isHiddenByTags' in json).toEqual(true);
        expect('author' in json).toEqual(true);
        expect('fullName' in json.author).toEqual(true);
        expect('tosterUserPageUrl' in json.author).toEqual(true);
        expect('habrProfileUrl' in json.author).toEqual(true);
        expect('habrPMUrl' in json.author).toEqual(true);
    });
});
