
const filmDetails = `https://api.themoviedb.org/3/trending/all/week?api_key=1c69cefe62ed9734e109dd76f6bc4f93`

export default class Service{
async getResource(url) {

const res = await fetch(url);

if(!res.ok){
    throw new Error('invalid ')
}

const body = await res.json();
    return body;
}

getFilmsDetails(){
    return this.getResource(filmDetails)
}

}

