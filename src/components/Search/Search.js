import React, { Component } from "react";
import debounce from "lodash.debounce"
import './Search.css';
import { Input } from 'antd'; 


export default class SearchFunction extends Component{

    searching = (e) => {
        const { makeQuery} = this.props;
        let query = e.target.value.trim().replace(/ +/g, '');
        makeQuery(query);
    }

    onSubmit= (e)=>{
        e.preventDefault();
      }

    render(){
        return(
            <form className="search" onSubmit={this.onSubmit}>
                  <Input 
                        className='search__placeholder'
                        placeholder="Type to search..." 
                        onChange={debounce(this.searching,800)}
                        type='text'   
                    />
            </form>
        )
    }
}
