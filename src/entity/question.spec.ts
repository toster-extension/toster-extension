import { Question } from '@/entity/question';
import { User } from '@/entity/user';
import { QuestionId, StorageType, Tag } from '@/libs/types';
import { Storage } from '@/libs/storage';

let storage: Storage;
let question: Question;
let author: User;
const questionId: QuestionId = '1';
const name = 'User';
const nick = 'nick';
const tags: Tag[] = [];

describe('Question', () => {
  beforeEach(() => {
    storage = new Storage(StorageType.OPTIONS);
    storage.set<string[]>('authorsBlacklist', []);
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

    it('is false if useAuthorsBlackList is false', () => {
      storage.set<boolean>('useAuthorsBlackList', false);
      storage.set<string[]>('authorsBlacklist', [author.fullName]);
      expect(question.isHiddenByAuthor).toEqual(false);
    });

    it('is false if authorsBlacklist does not contain the author name and useAuthorsBlackList is true', () => {
      storage.set<boolean>('useAuthorsBlackList', true);
      storage.set<string[]>('authorsBlacklist', ['name @nickname']);
      expect(question.isHiddenByAuthor).toEqual(false);
    });

    it('is true if authorsBlacklist does contain the author name and useAuthorsBlackList is true', () => {
      storage.set<boolean>('useAuthorsBlackList', true);
      storage.set<string[]>('authorsBlacklist', [author.fullName]);
      expect(question.isHiddenByAuthor).toEqual(true);
    });
  });

  describe('question.isHiddenByTags', () => {
    it('is false by default', () => {
      expect(question.isHiddenByTags).toEqual(false);
    });

    it('is false if useTagsBlackList is false', () => {
      storage.set<boolean>('useTagsBlackList', false);
      const tagsBlacklist = [{
        name: 'black-name',
        slug: 'black-name-slug',
        image: '',
      }];
      storage.set<Tag[]>('tagsBlacklist', tagsBlacklist);
      question = new Question(questionId, author, tagsBlacklist);
      expect(question.isHiddenByTags).toEqual(false);
    });

    it('is false if tagsBlacklist does not contain any tags and useTagsBlackList is true', () => {
      storage.set<boolean>('useTagsBlackList', true);
      storage.set<Tag[]>('tagsBlacklist', [{
        name: 'black-name',
        slug: 'black-name-slug',
        image: '',
      }]);
      question = new Question(questionId, author, [{
        name: 'name',
        slug: 'slug',
        image: '',
      }]);
      expect(question.isHiddenByTags).toEqual(false);
    });

    it('is true if tagsBlacklist does contain any tags and useTagsBlackList is true', () => {
      storage.set<boolean>('useTagsBlackList', true);
      const tagsBlacklist = [{
        name: 'black-name',
        slug: 'black-name-slug',
        image: '',
      }];
      storage.set<Tag[]>('tagsBlacklist', tagsBlacklist);
      question = new Question(questionId, author, tagsBlacklist);
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
