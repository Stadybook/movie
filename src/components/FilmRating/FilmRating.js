import React, { Component } from "react";
import {Rate } from 'antd';
import './FilmRating.css';

export default class FilmRating extends Component{ 
    state={
        id: this.props.id,
        stars:0
      }
    
      onChange = (e) => {
        const { id, postFilmRate, sessionId } = this.props
        this.setState({
          stars: e
        })

        postFilmRate(id, sessionId, e)
       // localStorage.setItem('rating', e)
      }

    render(){
        const { stars } =this.state;
        return(
            <Rate className='card__stars' count={10} defaultValue='0' onChange={this.onChange} value={stars}/>
        )
    }
}