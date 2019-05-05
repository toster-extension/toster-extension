import { TOSTER_URL } from '@/libs/constants';

export class HTTP {
    constructor (private baseUrl: string = TOSTER_URL) {}

    async get (url: string) {
        const requestUrl = this.makeUrl(url);
        const config = this.getConfig('GET');

        try {
            const response = await fetch(requestUrl, config);

            return Promise.resolve(response.text());
        } catch (error) {
            throw error;
        }
    }

    async post (url: string, headers: Headers = null, body: BodyInit = '') {
        const requestUrl = this.makeUrl(url);
        const config = this.getConfig('POST', headers, body);

        try {
            const response = await fetch(requestUrl, config);

            return Promise.resolve(response.text());
        } catch (error) {
            throw error;
        }
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
