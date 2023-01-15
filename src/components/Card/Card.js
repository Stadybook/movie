import React, { Component } from "react";
import './Card.css';
import { Image } from 'antd';

const filmPoster = 'https://image.tmdb.org/t/p/w500';

export default class Card extends Component  {
  

  render(){
    const { id, release_date, title, genre_ids ,overview,backdrop_path } = this.props;
    
    return (
      <li key={id} className='card'>
        <Image className="card__photo"
          src={`${filmPoster}${backdrop_path}`}  alt="movie-zphoto"
       />
       <div className="card__description">
        <h2>{title}</h2>
        <span>{release_date} </span>
        <p> {genre_ids}</p>
        <p>{overview}</p>
       </div>
    </li>
    );
}
}

