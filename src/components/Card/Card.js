import React, { Component } from "react";
import './Card.css';
import { Image } from 'antd';
import { format,parseISO } from 'date-fns'
import { Typography } from 'antd';
import { Rate } from 'antd';
const { Title, Paragraph, Text } = Typography;
//import PropTypes from 'prop-types';

export default class Card extends Component  {

  render(){

    const { id,title, genre_ids ,overview,backdrop_path, release_date,vote_average} = this.props;
    const releaseDate = release_date ? format(new Date(release_date), 'MMMM dd, yyyy') : 'no release date';
   
    
    function truncate(text,symbols) {
      if (text.length <= symbols) {
        return text;
      }
      const overview = text.substring(0, symbols - 1);
      return `${overview.substring(0, overview.lastIndexOf(' '))}...`;
    }

    const plot = truncate(overview,250)
    
    const  mark = Number(vote_average)
    let colorBorder;
    if(5 < mark && mark < 7) {
      colorBorder = '#E9D100';
    }
    else if(mark >= 7){
      colorBorder = '#008000';

    }
    else{
      colorBorder='#b41212'
    }
    
      return (
        <li key={id} className='card'>
          <Image className="card__photo"
          width={1000}
          height={280}
          src={`https://image.tmdb.org/t/p/w500${backdrop_path}`}  alt="movie-zphoto"
        />
        <div className="card__info">
          <Typography className="card__description">
            <Title className="card__title"
            level={4}>
              {title}
              </Title>
            <span className="card__date">{releaseDate} </span><br/>
            <Text keyboard> {genre_ids}</Text>
            <Paragraph className="card__plot">{plot}</Paragraph>
          </Typography>
          <Rate className='card__stars' disabled count={10} defaultValue={vote_average} />
          </div>
          <span style={{borderColor:`${colorBorder}`}} className="card__mark">{vote_average}</span>
        </li>
      );
  }// 
}
