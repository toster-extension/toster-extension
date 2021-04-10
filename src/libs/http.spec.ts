import {FetchMock} from 'jest-fetch-mock';
import { TOSTER_URL } from '@/libs/constants';
import { HTTP } from '@/libs/http';

declare const fetchMock: FetchMock;

let http: HTTP;

describe('HTTP', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    http = new HTTP(TOSTER_URL);
  });

  describe('method "get"', () => {
    it('return HTML string by default', async () => {
      fetchMock.mockResponseOnce('<h1>title</h1>');
      const result = await http.get('/my/feed');
      expect(result).toEqual('<h1>title</h1>');
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual(`${TOSTER_URL}/my/feed`);
    });

    it('return HTML string if responceType is "html"', async () => {
      fetchMock.mockResponseOnce('<h1>title</h1>');
      const result = await http.get('/my/feed', 'html');
      expect(result).toEqual('<h1>title</h1>');
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual(`${TOSTER_URL}/my/feed`);
    });

    it('return JSON if responceType is "json"', async () => {
      fetchMock.mockResponseOnce('{"data": 1}');
      const result = await http.get('/my/feed', 'json');
      expect(result).toEqual({data: 1});
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual(`${TOSTER_URL}/my/feed`);
    });
  });

  describe('method "post"', () => {
    it('return HTML string by default', async () => {
      fetchMock.mockResponseOnce('<h1>title</h1>');
      const result = await http.post('/my/feed');
      expect(result).toEqual('<h1>title</h1>');
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual(`${TOSTER_URL}/my/feed`);
    });

    it('return HTML string if responceType is "html"', async () => {
      fetchMock.mockResponseOnce('<h1>title</h1>');
      const result = await http.post('/my/feed', null, '', 'html');
      expect(result).toEqual('<h1>title</h1>');
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual(`${TOSTER_URL}/my/feed`);
    });

    it('return JSON if responceType is "json"', async () => {
      fetchMock.mockResponseOnce('{"data": 1}');
      const result = await http.post('/my/feed', null, '', 'json');
      expect(result).toEqual({data: 1});
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual(`${TOSTER_URL}/my/feed`);
    });
  });
});
