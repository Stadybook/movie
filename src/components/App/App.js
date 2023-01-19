import React, { Component } from "react";
import Service from "../../services/Servic";
import CardList from "../CardList";
import './App.css';
import { Spin } from 'antd';
import { Alert, Space } from 'antd';
import { Input } from 'antd';




export default class App extends Component{

    getFilms = new Service();

        state = {
          InputValue: '',
          todoData : [],
          loading: true,
          error: false
        };  
    
        constructor(){
            super()
            this.showFilms();
        }

      showFilms(){
        this.getFilms
        .getPopularFilms()
            .then((body) => {
                    this.setState({
                       todoData: body.results,
                       loading:false,

                })
            })
            .catch(this.onError);
        }

      showRequest(value){
        this.getFilms
        .getRequestFilms(value)
          .then((body) => {
            this.setState({
              todoData : body.results,
              loading: false
            })
          })
          .catch(this.onError)
      }

      onError = (err) => {
        console.log(err)
        this.setState({
            error:true,
            loading:false,
        })
      }

      handlerClick = (event) =>{
        const buttons = document.querySelectorAll(".toggle__button");
        buttons.forEach(button => {
         button.classList.remove('active');
         });
      
        if (event.target.classList.contains('active')) {
        return;
        }
    
        event.target.classList.add('active');

      }

      onLabelChange = (e) => {
          if (e.target.value.length === 1) {
          const InputValue = e.target.value.trim().replace(/ +/g, ' ');
          this.setState({
            InputValue,
          });
        }else if (e.target.value.length === 0){
          this.showFilms()
          this.setState({
            InputValue: '',
          });
        }
        else{
          this.showRequest(e.target.value)
          this.setState({
            InputValue: e.target.value,
          });
        }
       
      };

      onSubmit = (e) => {
          e.preventDefault();
          this.setState({
          labelState: '',
      });

    };


    render(){
    
      const {loading} = this.state;
      const {error} = this.state;
      const { InputValue } = this.state;

      const hasData = !(loading || error);

      const errorMessage = error ? <Error /> : null;
      const spiner = loading ? <Spiner /> : null;
      const list = hasData ? (
            <React.Fragment>
            <div className="toggle">
              <button 
                type='button'
                className='toggle__button active'
                onClick={this.handlerClick}
              >
              Search
              </button>
              <button 
                type='button'
                className='toggle__button'
                onClick={this.handlerClick}
              >
              Rated
              </button>
            </div>
            <form className="search" onSubmit={this.onSubmit}>
              <Input 
                    className='search__placeholder'
                    placeholder="Type to search..." 
                    onChange={this.onLabelChange}
                    type='text'
                    value={ InputValue }    
                    />
              </form>
            <CardList 
              data={this.state.todoData}
            />
            </React.Fragment>) : null;
        return(
            <section className="container" >
                {errorMessage}
                {spiner}
                {list}
            </section>
            )
    }
   
};

const Error = () => { 
  return(
    <React.Fragment>
       <Space direction="vertical" style={{ width: '100%' }}>
       <Alert
          message="Error"
          description="Somthing has gone wrong! Unable to load data. Check your Internet connection"
          type="error"
          showIcon
        />
       </Space>
    </React.Fragment>
  )
 }
  const Spiner = () => {  
    return ( 
          <div className="spiner">
            <Spin />
          </div>
        )
  }

