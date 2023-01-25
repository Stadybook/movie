import React, { Component } from "react";
import './CardList.css';
import Card from "../Card/Card";


export default class CardList extends Component{

    render(){
        const { data, postFilmRate, sessionId } = this.props;
  
        const elements = data.map((item) => {
        
        const {id} = item;
            return(
              <Card 
              postFilmRate={(id, sessionId, e) => postFilmRate(id, sessionId, e)}
              sessionId={sessionId}
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