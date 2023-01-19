
const filmDetails = `https://api.themoviedb.org/3/movie/popular?api_key=1c69cefe62ed9734e109dd76f6bc4f93&language=en-US&page=1`
const filmRequest = `https://api.themoviedb.org/3/search/movie?api_key=1c69cefe62ed9734e109dd76f6bc4f93&language=en-US&page=1&include_adult=false`

export default class Service{
async getResource(url) {

    const res = await fetch(url);

    if(!res.ok){
        throw new Error('invalid')
    }

    const body = await res.json();
        return body;
    }

    getPopularFilms(){
        return this.getResource(filmDetails)
    }

    getRequestFilms(value){
        return this.getResource(`${filmRequest}&query=${value}`)
    }

}

