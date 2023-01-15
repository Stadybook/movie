import React, { Component } from "react";
import Service from "../../services/Servic";
import CardList from "../CardList";
import './App.css'



export default class App extends Component{

    getFilms = new Service();


        state = {
          todoData : [],
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
                       todoData: body.results
                })
            })
      }


   

    render(){
        return(
            <section >
            <CardList 
            data={this.state.todoData}
            />
            </section>
            )
    }
   
};



