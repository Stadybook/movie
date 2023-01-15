import React, { Component } from "react";
import './Card.css';
import { Image } from 'antd';



export default class Card extends Component  {

  render(){
    const { id, poster, date,  title, genre  } = this.props;
    
    return (
      <li key={id} className='card'>
        <Image className="card__photo"
          src={poster}  alt="movie-zphoto"
       />
       <div className="card__description">
        <h2>{title}</h2>
        <span>{date} </span>
        <p> {genre}</p>
        <p>A former basketball all-star, who has lost his wife and family foundation in a struggle with addiction attempts to regain his soul  and salvation by becoming the coach of a disparate ethnically mixed high ...</p>
       </div>
    </li>
    );
}
}

