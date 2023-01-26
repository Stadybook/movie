import React, { Component } from "react";
import CuttingFn from "../CuttingFn/CuttingFn";
import Error from "../ErrorHanding";
import './Card.css';
import { FilmGenreConsumer } from "../FilmGenreContext";
import { Image, Typography } from 'antd';
import { format } from 'date-fns'
import FilmRating from "../FilmRating";
const { Title, Paragraph, Text } = Typography;

//import PropTypes from 'prop-types';

export default class Card extends Component  {

  state={
    reactError:false,
  }

  componentDidCatch = (error, info) =>{
    this.setState({
      reactError:true
    })
  }

  render(){

    if(this.state.reactError){
      return <Error />
    }

    const {sessionId, id,title, genre_ids ,overview,backdrop_path, release_date,vote_average} = this.props;
    const releaseDate = release_date ? format(new Date(release_date), 'MMMM dd, yyyy') : 'no release date';
    const photoURL = 'https://image.tmdb.org/t/p/original' // `https://image.tmdb.org/t/p/w500
    const src = backdrop_path ? `${photoURL}${backdrop_path}` : 'https://place-hold.it/280x1000/e1eaf1/000/c8c7f7?text=No poster';
    const vote = (Math.floor(vote_average*10)) /10
    const filmGenres = 
    <FilmGenreConsumer>
       {
         (getGenre) => {
          return (
              <React.Fragment>
              {getGenre(genre_ids).map((genre) => {
              return (
                  <Text keyboard key={genre} className='text'>{genre}</Text> 
                );
              })}
             </React.Fragment> 
          )
        }
      }
               
    </FilmGenreConsumer>

    const plot = overview ? CuttingFn(overview,180) : 'No overview';
    

    const mark = Number(vote_average);
    let colorBorder;
    if(0 <= mark && mark <= 3){
      colorBorder = '#E90000';
    }
    else if(3 < mark && mark < 5) {
      colorBorder = '#E97E00';
    }
    else if(5 <= mark && mark < 7){
      colorBorder = '#E9D100';

    }
    else{
      colorBorder='#66E900'
    }
    
      return (
        <li key={id} className='card'>
        <Image 
       
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
        <FilmRating className='card__stars' id={id} sessionId={sessionId} />
        </div>
        <span style={{borderColor:`${colorBorder}`}} className="card__mark">{vote}</span>
      </li>
      );
  }
}
