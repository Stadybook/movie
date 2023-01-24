
const apiKey = '1c69cefe62ed9734e109dd76f6bc4f93'
const baseURL = `https://api.themoviedb.org/3/`
export default class Service{
    async getResource(url) {
        const res = await fetch(url);
        if(!res.ok){
            throw new Error('invalid', res.status)
        }
        const body = await res.json();
        return body;
    };

    getPopularFilms = async (pageNumber) => {
        const url = `${baseURL}movie/popular?api_key=${apiKey}&language=en-US&page=${pageNumber}`;
        const body = await this.getResource(url);
     
        return body;
    }

    getRequestFilms = async (valueSearch,  pageNumber) => {
        const url = `${baseURL}search/movie?api_key=${apiKey}&include_adult=false&query=${valueSearch}&page=${pageNumber}`;
        const body = await this.getResource(url);
 
        return body;
    };

    getFilmGenre = async () => {
        const url = `${baseURL}genre/movie/list?api_key=${apiKey}&language=en-US`
        const body =await this.getResource(url)
        return body.genres;
    }

}

