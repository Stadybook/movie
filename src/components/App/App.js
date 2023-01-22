import React, { Component } from "react";
import Service from "../../services/Servic";
import CardList from "../CardList";
import './App.css';
import Spiner from "../Spiner";
import Error from "../ErrorHanding";
import SearchFunction from "../Search/Search";
import { Pagination } from 'antd';




export default class App extends Component{
        state = {
          inputValue: '',
          movieData : [],
          loading: true,
          notFound:false,
          error: false,
          totalPages: 0,
          pageNumber: 1,
          genresData:[]
        };  
    
        getFilms = new Service();


      componentDidMount(){
        const { pageNumber } = this.state;
        this.allFillmGenres();
        this.showFilms(pageNumber);
      
      }

      showFilms(){
        const { pageNumber } = this.state;
        const { inputValue } = this.state;
        this.setState({
          isLoading: true,
          notFound: false,
          isError: false,
        })
        if(inputValue === ''){
          this.showPopularFilms()
        }
        else{
          this.getFilms
            .getRequestFilms(inputValue,pageNumber )
              .then((body) =>{
                this.setState({
                  loading:false,
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
        this.setState({
          isLoading: true,
          notFound: false,
          isError: false,
        })
        this.getFilms
        .getPopularFilms(pageNumber)
            .then((body) => {
              this.setState({
                loading:false,
                error:false,
                movieData: body.results,
                totalPages: body.total_pages,
                pageNumber
              })
              
            })
            .catch(this.onError);
        }

        
  

        allFillmGenres = () => {
          this.getFilms
           .getFilmGenre()
            .then((body) => {
            this.setState({
              genresData: [...body],
            });

          })
          .catch(this.onError);
        }

        getGenre= (ids) => {
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

      handlerClick = (event) => {
        const buttons = document.querySelectorAll(".toggle__button");
        buttons.forEach(button => {
         button.classList.remove('active');
         });
      
        if (event.target.classList.contains('active')) {
        return;
        }
    
        event.target.classList.add('active');

      }

      makeQuery = (query) => {
        this.setState({
          isLoading: true,
        })
      if (query.length === 0){
          this.setState({
            inputValue: '',
            notFound:false,
            pageNumber:1
          });
          this.showPopularFilms()
        }
        else{
          this.setState({
            inputValue: query,
          });
          this.showFilms(query)
        }
       
      };

    pageChanging = (page) => {
      this.setState({
        pageNumber: page,
      },
      () => this.showFilms()
      )
    }


    render(){
      const {movieData, notFound, pageNumber, totalPages, loading, error} = this.state;

      const pagination = (totalPages > 1 && !loading) ? (
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

      const hasData = !(error && loading);
      const warnMessage = notFound ? (<span className="warn-text">No results for your search</span>) : null; 
      const errorMessage = error ? <Error /> : null; 
      const spiner = loading && !error ? <Spiner /> : null; 
      const service = !error ? (
        <React.Fragment>
      <div className="toggle">
      <button 
        type='button'
        className='toggle__button active'
        onClick={this.handlerClick}
      >
      Search
      </button>
      <button 
        type='button'
        className='toggle__button'
        onClick={this.handlerClick}
      >
      Rated
      </button>
    </div>
    <SearchFunction 
      makeQuery={this.makeQuery}
    />
     </React.Fragment>) : null;

      const list = hasData ? ( 
            <React.Fragment>
            {warnMessage}
            <CardList 
              data={movieData}
              getGenre={this.getGenre}
            />
            
            </React.Fragment>) : null;
        
        return(
            <section className="container" >
            {errorMessage}
            {service}
            {spiner}
            {list}  
            {pagination}
            </section>
            )
    }
   
};


 