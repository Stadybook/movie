import React, { Component } from "react";
import './CardList.css';
import Card from "../Card/Card";

export default class CardList extends Component{
   
    
  /*satete(){
    title:null,
    poster: null,
    genre: null,
    date:null
  }*/


    render(){
        const { data } = this.props;
        const elements = data.map((item) => {
        const {id} = item;
            return(
                    <Card 
                    { ...item}
                    key={id}
                    />

            )
        })
        return (
            <section className='card-list'>
              { elements }
            </section>
          );
    }
}