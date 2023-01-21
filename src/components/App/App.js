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
        };  
    
        getFilms = new Service();
        componentDidMount(){
          const { pageNumber } = this.state;
            this.showFilms(pageNumber);
        }

      showFilms(){
        const { pageNumber } = this.state;
        const { inputValue } = this.state;
        this.setState({
          loading:false,
          error:false,
        })

        if(inputValue === ''){
          this.showPopularFilms()
        }
        else{
          this.getFilms
            .getRequestFilms(inputValue,pageNumber )
              .then((body) =>{
                this.setState({
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
        this.getFilms
        .getPopularFilms(pageNumber)
            .then((body) => {
              this.setState({
                movieData: body.results,
                loading:false,
                error:false,
                totalPages: body.total_pages,
                pageNumber
              })
              
            })
            .catch(this.onError);
        }


      onError = () => {

        this.setState({
            error:true,
            loading:false,
        })
      }

      handlerClick = (event) =>{
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
      if (query.length === 0){
          this.showPopularFilms()
          this.setState({
            inputValue: '',
          });
        }
        else{
          this.showFilms(query)
          this.setState({
            inputValue: query,
          });
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
      const { notFound } = this.state;
      const { pageNumber } = this.state;
      const { totalPages } = this.state;
      const {loading} = this.state;
      const {error} = this.state;
      const { inputValue } = this.state;

      const pagination = (totalPages >= 0 && !loading && !notFound) ? (
        <Pagination 
        className="pagination" 
        defaultCurrent={1} 
        current={pageNumber}
        total={totalPages/20} 
        showSizeChanger={false}
        onChange={this.pageChanging}
        />
      ): null;

      const hasData = !(loading || error);
      const warnMessage = notFound ? (<span className="warn-text">No results for your search</span>) : null;
      const errorMessage = error ? <Error /> : null;
      const spiner = loading ? <Spiner /> : null;
      const list = hasData ? (
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
             value={inputValue}
             makeQuery={this.makeQuery}
             />
            {warnMessage}
            <CardList 
            
              data={this.state.movieData}
            />
           
            </React.Fragment>) : null;
        
        return(
            <section className="container" >
                {errorMessage}
                {spiner}
                {list}
                {pagination}
            </section>
            )
    }
   
};


 