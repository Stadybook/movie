const filmPoster = 'https://image.tmdb.org/t/p/w500';
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

    /*getFilmsPosters(){
        return this.getResource(filmDetails)
            .then((body) => {
              body.results.map((film) => {
                    return film.backdrop_path
                },[])    
        })
    }*/
}

const swapi = new Service();

swapi.getFilmsDetails().then((body)=>{
console.log(body.results)

})

swapi.getFilmsDetails().then((body)=>{
body.results.map((film) => {
   // console.log(`${filmPoster}${film.backdrop_path}`)
})

})

swapi.getFilmsDetails().then((body)=>{
body.results.map((film) => {
  //  console.log(film.title)
 })
})

swapi.getFilmsDetails().then((body)=>{
body.results.map((film) => {
     //console.log(film.release_date)
   })

})


swapi.getFilmsDetails().then((body)=>{
body.results.map((film) => {
     //console.log(film.overview)
   })

})

swapi.getFilmsDetails().then((body)=>{
body.results.map((film) => {
    // console.log(film.genre_ids)
   })

})
