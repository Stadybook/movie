import React, { Component } from "react";
import './Card.css';
import { Image } from 'antd';
import { format } from 'date-fns'
import { Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const { Title, Paragraph, Text } = Typography;
//import PropTypes from 'prop-types';

const filmPoster = 'https://image.tmdb.org/t/p/w500';

export default class Card extends Component  {

  render(){

    const { id, release_date,loading} = this.props;

    const releaseDate = format(new Date(release_date), 'MMMM dd, yyyy');

    const Spiner = (
           <LoadingOutlined
              style={{
                fontSize: 24,
              }}
              spin
            />
    )

    const Content = () => {
      const {title, genre_ids ,overview,backdrop_path } = this.props;
      return(
        <React.Fragment>
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
        </React.Fragment>
      )
    }

   
    
   
    const spiner = loading ?  <Spin indicator={Spiner} /> : null;
    const content = !loading ? <Content /> : null;


      return (
        <li key={id} className='card'>
          {spiner}
          {content}
        </li>
      );
  }
}

Card.defaultProps = {
  title : 'No Title',
  release_date: '01-01-01'
}
