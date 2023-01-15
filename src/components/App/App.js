import React, { Component } from "react";
import Service from "../../services/Servic";
import CardList from "../CardList";
import './App.css';
import ErrorIndicator from "../ErrorIndicator";
import { Spin } from 'antd';



export default class App extends Component{

    getFilms = new Service();


        state = {
          todoData : [],
          loading: true,
          error: false
        };  
    
        constructor(){
            super()
            this.showFilms();
        }

      showFilms(){
        this.getFilms
        .getFilmsDetails()
            .then((body) => {
                    this.setState({
                       todoData: body.results,
                       loading:false,

                })
            })
            .catch(this.onError);
        }

      onError = (err) => {
        this.setState({
            error:true,
            loading:false,
        })
      }

    render(){

        const Spiner = () => (
                <div className="spiner">
                  <Spin />
                </div>
              )


        const FilmList = () => {
            return(
            <React.Fragment>
                 <CardList 
                 data={this.state.todoData}
                 loading={this.state.loading}
            />
            </React.Fragment>
            )
        }
        
        const {loading} =this.state;
        const {error} =this.state;

        const hasData = !(loading || error);

        const errorMessage = error ? <ErrorIndicator /> : null;
        const spiner = loading ? <Spiner /> : null;
        const list = hasData ? <FilmList /> : null;
        
        
        return(
            <section className="container" >
                {errorMessage}
                {spiner}
                {list}
            </section>
            )
    }
   
};



