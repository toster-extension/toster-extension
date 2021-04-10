import { User } from '@/entity/user';
import { HABR_URL, TOSTER_URL } from '@/libs/constants';

let user: User;
const name = 'User';
const nick = 'nick';

describe('User', () => {
  beforeEach(() => {
    user = new User(name, nick);
  });

  it(`user.fullName is "${name} @${nick}"`, () => {
    expect(user.fullName).toEqual(`${name} @${nick}`);
  });

  it(`user.tosterUserPageUrl is "${TOSTER_URL}/user/${nick}"`, () => {
    expect(user.tosterUserPageUrl).toEqual(`${TOSTER_URL}/user/${nick}`);
  });

  it(`user.habrProfileUrl is "${HABR_URL}/users/${nick.toLowerCase()}"`, () => {
    expect(user.habrProfileUrl).toEqual(`${HABR_URL}/users/${nick.toLowerCase()}`);
  });

  it(`user.habrPMUrl is "${HABR_URL}/conversations/${nick.toLowerCase()}"`, () => {
    expect(user.habrPMUrl).toEqual(`${HABR_URL}/conversations/${nick.toLowerCase()}`);
  });

  it('method toJSON return getters', () => {
    const json = JSON.parse(JSON.stringify(user));
    expect('fullName' in json).toEqual(true);
    expect('tosterUserPageUrl' in json).toEqual(true);
    expect('habrProfileUrl' in json).toEqual(true);
    expect('habrPMUrl' in json).toEqual(true);
  });
});
