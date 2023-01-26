import React, { Component } from "react";
import Service from "../../services/Servic";
import CardList from "../CardList";
import './App.css';
import Spiner from "../Spiner";
import Error from "../ErrorHanding";
import SearchFunction from "../Search/Search";
import { Pagination } from 'antd';
import Buttons from "../Buttons";
import { FilmGenreProvider } from "../FilmGenreContext";


export default class App extends Component{
        state = {
          inputValue: '',
          movieData : [],
          ratedMovie: [],
          loading: true,
          notFound:false,
          RenderError:false,
          error: false,
          totalPages: 0,
          pageNumber: 1,
          genresData:[],
          button:'Search',
          sessionId:''
        };  
    
        getInfo = new Service();

      componentDidMount(){
        const { pageNumber } = this.state;
        this.allFillmGenres();
        this.showPopularFilms(pageNumber);
        this.createGuestSession()

      }

      componentDidUpdate(prevProps,prevState){
        const { inputValue ,  button, pageNumber} = prevState
        if(this.state.inputValue !== inputValue || this.state.pageNumber !== pageNumber){
          this.updateSearch()
        }
        if(this.state.button !== button){
          this.changeButton()
        }

      }

      componentDidCatch(error, info){
        this.setState({
          RenderError:true
        })
      }

      updateSearch(){
        const {inputValue} = this.state;
        if(inputValue === ''){
          return this.showPopularFilms()
        }

        this.showFilms();
      }

      changeButton = () => {
        this.setState({
          notFound:false
        })
        const { button } = this.state;
        if(button === 'Search'){
          this.showFilms()
        }
        if(button === 'Rated'){
          this.showRatedMovie()
        }
      }

      showFilms(){  
        const { pageNumber } = this.state;
        const { inputValue } = this.state;
        if(inputValue === ''){
          this.showPopularFilms()
        }

        else{
          this.getInfo
            .getRequestFilms(inputValue,pageNumber )
              .then((body) =>{
                this.setState({
                  loading:false,
                  notFound: false,
                  error:false,
                  totalPages: body.total_pages,
                  pageNumber,
                  movieData:body.results
                })
                if(body.results.length === 0){
                  this.setState({
                    notFound:true
                  })
                }
              })
              .catch(this.onError);
        } 
      }

      showPopularFilms(){
        const { pageNumber } = this.state;
        this.getInfo
        .getPopularFilms(pageNumber)
            .then((body) => {
              this.setState({
                notFound: false,
                loading:false,
                error:false,
                movieData: body.results,
                totalPages: body.total_pages,
                pageNumber
              })
            })
            .catch(this.onError);
        }

        showRatedMovie = () => {
          const { sessionId, pageNumber } = this.state;
          this.getInfo
            .getFilmRate(sessionId, pageNumber)
              .then((body) => {
                this.setState({
                  loading:false,
                  error:false,
                  notFound:false,
                  pageNumber,
                  ratedMovie: body.results,
                  totalPages: body.total_pages
                })
                if(body.results.length === 0){
                  this.setState({
                    notFound:true
                  })
                }
              })
        }

        allFillmGenres = () => {
          this.getInfo
           .getFilmGenre()
            .then((body) => {
            this.setState({
              genresData: [...body],
            });

          })
          .catch(this.onError);
        }

        getGenre = (ids) => {
          const filmGenres = [];
          const { genresData } = this.state;
          ids.forEach((genreId)=>{
            genresData.forEach(element => {
              if(element.id === genreId ){
                filmGenres.push(element.name)
              }
            });
          })
          return filmGenres;
        
        }

      onError = () => {
        this.setState({
            error:true,
            loading:false,
        })
      }

      onButtonChange = (btn) => {
          this.setState(() =>{ 
            return{
              button:btn,
              pageNumber:1,
              loading:true
            }
          }
          )
      };

      makeQuery = (query) => {
        this.setState({
          inputValue: query,
          loading: true,
        });
        
      };

      pageChanging = (page) => {
        this.setState({
          pageNumber: page,
          loading: true,
        })
      }

      createGuestSession = () =>{
        this.getInfo
          .getGuestSessionId()
          .then((body) => {
            sessionStorage.setItem('sessionId',body.guest_session_id )
              this.setState({
                sessionId: sessionStorage.sessionId,
                loading:false
              })
          })
          .catch(this.onError);
      }

    render(){
      if(this.state.RenderError){
        return <Error />
      }

      const {movieData,ratedMovie,sessionId, button,notFound, pageNumber, totalPages, loading, error} = this.state;

      const pagination = (totalPages >= 2 && !loading && !error) ? (
        <Pagination 
        className="pagination" 
        defaultCurrent={1} 
        current={pageNumber}
        total={totalPages} 
        showSizeChanger={false}
        disabled={false}
        onChange={this.pageChanging}
        />
      ): null;


      const hasData = !(error || loading || notFound);
      const warnMessage = notFound ? (<span className="warn-text">No results for your search</span>) : null; 
      const errorMessage = error ? <Error /> : null; 
      const spiner = loading && !error ? <Spiner /> : null; 
      const buttons = !error  ? (<Buttons onButtonChange={this.onButtonChange} />) : null;
      const search = !(error || button === 'Rated') ? (<SearchFunction makeQuery={this.makeQuery} />) : null;
      const dataForShow =  button === 'Rated' ? ratedMovie : movieData;

      const list = hasData ? ( 
            <React.Fragment>
            <CardList 
              data={dataForShow}
              sessionId={sessionId}
            />
            </React.Fragment>) : null;

        
        return(
            <FilmGenreProvider value={this.getGenre}>

              <section className="container" >
                {errorMessage}
                {buttons}
                {search}
                {warnMessage}
                {spiner}
                {list}  
                {pagination}
              </section>

            </FilmGenreProvider>
          
            )
    }
   
};


 