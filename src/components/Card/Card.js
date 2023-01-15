import React, { Component } from "react";
import './Card.css';
import { Image } from 'antd';
import { format } from 'date-fns'
import { Typography } from 'antd';
const { Title, Paragraph, Text } = Typography;
//import PropTypes from 'prop-types';

const filmPoster = 'https://image.tmdb.org/t/p/w500';

export default class Card extends Component  {
  

  render(){
    const { id, release_date , title, genre_ids ,overview,backdrop_path } = this.props;

    const releaseDate = format(new Date(release_date), 'MMMM dd, yyyy')
    
      return (
        <li key={id} className='card'>
          <Image className="card__photo"
          width={1000}
          height={280}
            src={`${filmPoster}${backdrop_path}`}  alt="movie-zphoto"
        />
        <Typography className="card__description">
          <Title className="card__title"
           level={3}>
            {title}
            </Title>
          <span>{releaseDate} </span><br/>
          <Text keyboard> {genre_ids}</Text>
          <Paragraph className="card__plot">{overview}</Paragraph>
        </Typography>

      </li>
      );
  }
}

Card.defaultProps = {
  title : 'No Title',
  release_date: '01-01-01'
}
