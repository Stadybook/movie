import React, { Component } from "react";
import './Buttons.css'

export default class Buttons extends Component{ 

    handlerClick = (event) => {
        const {onButtonChange} = this.props;
        const buttons = document.querySelectorAll(".toggle__button");
        buttons.forEach(button => {
         button.classList.remove('active');
         });
        if (event.target.classList.contains('active')) {
        return;
        }
        event.target.classList.add('active');
        onButtonChange(event.target.textContent);
      }

      render(){

        return(
            <div className="toggle">
            <button 
              type='button'
              className='toggle__button active'
              id='search'
              onClick={this.handlerClick}
            >
            Search
            </button>
            <button 
              type='button'
              className='toggle__button'
              id='rated'
              onClick={this.handlerClick}
            >
            Rated
            </button>
          </div>
        )
      }
   
}


