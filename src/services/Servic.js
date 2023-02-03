/* eslint-disable class-methods-use-this */
const apiKey = '1c69cefe62ed9734e109dd76f6bc4f93';
const baseURL = 'https://api.themoviedb.org/3/';
export default class Service {
    async getResource(url) {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error('invalid responce', res.status);
        }
        const body = await res.json();
        return body;
    }

    getPopularFilms = async (pageNumber) => {
        const url = `${baseURL}movie/popular?api_key=${apiKey}&language=en-US&page=${pageNumber}`;
        const body = await this.getResource(url);
        return body;
    };

    getRequestFilms = async (valueSearch, pageNumber) => {
        const url = `${baseURL}search/movie?api_key=${apiKey}&include_adult=false&query=${valueSearch}&page=${pageNumber}`;
        const body = await this.getResource(url);

        return body;
    };

    getFilmGenre = async () => {
        const url = `${baseURL}genre/movie/list?api_key=${apiKey}&language=en-US`;
        const body = await this.getResource(url);
        return body.genres;
    };

    getGuestSessionId = async () => {
        const url = `${baseURL}authentication/guest_session/new?api_key=${apiKey}`;
        const body = await this.getResource(url);
        return body;
    };

    postFilmRate = async (movieId, sessionId, rating) => {
        const url = `https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=${apiKey}&guest_session_id=${sessionId}`;

        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                value: rating,
            }),
        }).catch((err) => {
            throw new Error('unsuccessful fetch request', err.message);
        });
    };

    getFilmRate = async (sessionId, pageNumber) => {
        const url = `${baseURL}guest_session/${sessionId}/rated/movies?api_key=${apiKey}&page=${pageNumber}`;
        const body = await this.getResource(url);
        return body;
    };
}
