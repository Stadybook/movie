import React, { Component } from "react";
import './CardList.css';
import Card from "../Card/Card";

export default class CardList extends Component{

    render(){
        const { data, getGenre, postFilmRate, sessionId } = this.props;
  
        const elements = data.map((item) => {
        
        const {id} = item;
            return(
              <Card 
              getGenre={(ids) => getGenre(ids)}
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