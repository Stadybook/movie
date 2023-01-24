import React, { Component } from "react";
import CuttingFn from "../CuttingFn/CuttingFn";
import Error from "../ErrorHanding";
import './Card.css';
import { Image, Rate, Typography } from 'antd';
import { format } from 'date-fns'
const { Title, Paragraph, Text } = Typography;
//import PropTypes from 'prop-types';

export default class Card extends Component  {

  state={
    reactError:false
  }

  componentDidCatch(error, info){
    this.setState({
      reactError:true
    })
  }

  render(){

    if(this.state.reactError){
      return <Error />
    }

    const {getGenre, id,title, genre_ids ,overview,backdrop_path, release_date,vote_average} = this.props;
    const releaseDate = release_date ? format(new Date(release_date), 'MMMM dd, yyyy') : 'no release date';
    const photoURL = 'https://image.tmdb.org/t/p/w500'
    
    const src = backdrop_path ? `${photoURL}${backdrop_path}` : 'https://place-hold.it/280x1000/e1eaf1/000/c8c7f7?text=No poster';
    const genres = getGenre(genre_ids)
  
    const filmGenres = (
      <React.Fragment>
      {genres.map((genre) => {
        return (
          <Text keyboard key={genre} className='text'>{genre}</Text> 
        );
      })}
      </React.Fragment>
    )

    const plot = overview ? CuttingFn(overview,180) : 'No overview';
    

    const mark = Number(vote_average);
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
          
          src={src}  alt="movie-zphoto"
        />
        <div className="card__info">
          <Typography className="card__description">
            <Title className="card__title"
            level={4}
           >
              {title}
              </Title>
            <span className="card__date">{releaseDate} </span><br/>
            <div className="card__genres">{filmGenres}</div>
            <Paragraph className="card__plot">{plot}</Paragraph>
          </Typography>
          <Rate className='card__stars' count={10} defaultValue='0' />
          </div>
          <span style={{borderColor:`${colorBorder}`}} className="card__mark">{vote_average}</span>
        </li>
      );
  }
}
