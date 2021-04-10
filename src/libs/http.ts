import { TOSTER_URL } from '@/libs/constants';

export class HTTP {
  constructor (private baseUrl: string = TOSTER_URL) {}

  async get (url: string, responseType: ResponseType = 'html') {
    const requestUrl = this.makeUrl(url);
    const config = this.getConfig('GET');
    const response = await fetch(requestUrl, config);

    return Promise.resolve(responseType === 'html' ? response.text() : response.json());
  }

  async post (
    url: string,
    headers: Headers = null,
    body: BodyInit = '',
    responseType: ResponseType = 'html'
  ) {
    const requestUrl = this.makeUrl(url);
    const config = this.getConfig('POST', headers, body);
    const response = await fetch(requestUrl, config);

    return Promise.resolve(responseType === 'html' ? response.text() : response.json());
  }

  private makeUrl (url: string): string {
    return url.startsWith('http') ? url : `${this.baseUrl}${url}`;
  }

  private getConfig (
    method = 'GET',
    headers: Headers = null,
    body: BodyInit = ''
  ): RequestInit {
    const _headers = new Headers();

    if (headers) {
      headers.forEach((value, name) => {
        _headers.append(name, value);
      });
    }

    _headers.append('Pragma', 'No-cache');
    _headers.append('Cache-Control', 'No-cache');
    _headers.append('X-Requested-With', 'XMLHttpRequest');

    const config: RequestInit = {
      method,
      headers: _headers,
      credentials: 'include',
      cache: 'no-store',
    };

    if (method === 'POST') {
      config.body = body;
    }

    return config;
  }
}

export type ResponseType = 'html' | 'json';
