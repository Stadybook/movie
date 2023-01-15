import React, { Component } from "react";
import CardList from "../CardList";
import './App.css'



export default class App extends Component{
    constructor(props){
        super(props)
        this.state = {
          todoData : [
            {id:1,poster:'1', title:'The way back', date:'March 5, 2020', genre:'Action Drama'},
            {id:2,poster:'1', title:'The way back', date:'March 5, 2020', genre:'Action Drama'},
            {id:3,poster:'1', title:'The way back', date:'March 5, 2020', genre:'Action Drama'},
            {id:4,poster:'1', title:'The way back', date:'March 5, 2020', genre:'Action Drama'},
            {id:5,poster:'1', title:'The way back', date:'March 5, 2020', genre:'Action Drama'},
            {id:6,poster:'1', title:'The way back', date:'March 5, 2020', genre:'Action Drama'}
        ],
        };  
    
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



