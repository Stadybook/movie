import React, { Component } from "react";
import Service from "../../services/Servic";
import CardList from "../CardList";
import './App.css';
import Spiner from "../Spiner";
import Error from "../ErrorHanding";
import SearchFunction from "../Search/Search";
import { Pagination } from 'antd';
import Buttons from "../Buttons";

export default class App extends Component{
        state = {
          inputValue: '',
          movieData : [],
          //ratedMovie: [],
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
        console.log('componentDidUpdate')
        const { inputValue ,  button, pageNumber} = prevState
        if(this.state.inputValue !== inputValue || this.state.pageNumber !== pageNumber){
          this.updateSearch()
        }
        if(this.state.button !== button){
          this.changeButton()
          //this.updateSearch()
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
        const { button } = this.state;
        if(button === 'Search'){
          this.showFilms()
        }
        if(button === 'Rated'){
          this.showRatedMovie()
        }
      }

      showFilms(){  
        const { pageNumber, button } = this.state;
        const { inputValue } = this.state;
        if(inputValue === ''){
          this.showPopularFilms()
        }
        else if( button === 'Rated'){
          this.showRatedMovie()
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
          const { sessionId } = this.state;
          console.log(sessionId)
          this.getInfo
            .getFilmRate(sessionId)
              .then((body) => {
                this.setState({
                  loading:false,
                  error:false,
                  notFound:false,
                  movieData: body.results,
                  totalPages: body.total_pages
                })
                console.log(body.results)
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
              loading:true
            }
          }
          )
      };

      makeQuery = (query) => {
        console.log(query)
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
              this.setState({
                sessionId: body.guest_session_id,
                loading:false
              })
              sessionStorage.setItem('sessionId',body.guest_session_id )
          })
          .catch(this.onError);
      }

      postFilmRate = (movieId, sessionId, rating) => {
        this.getInfo
          .postFilmRate(movieId, sessionId, rating)
            .then((body) => {
                console.log('Success')
            })
          // console.log(this.state.sessionId)
      }

    render(){
      if(this.state.RenderError){
        return <Error />
      }

      const {movieData,sessionId, button,notFound, pageNumber, totalPages, loading, error} = this.state;

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


      const list = hasData ? ( 
            <React.Fragment>
            <CardList 
              data={movieData}
              getGenre={this.getGenre}
              postFilmRate={this.postFilmRate}
              sessionId={sessionId}
            />
            </React.Fragment>) : null;

        
        return(
            <section className="container" >
            {errorMessage}
            {buttons}
            {search}
            {warnMessage}
            {spiner}
            {list}  
            {pagination}
            </section>
            )
    }
   
};


 