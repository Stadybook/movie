/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Rate } from 'antd';

import './FilmRating.css';
import Service from '../../services/Servic';

export default class FilmRating extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stars: 0,
        };
    }

    getFn = new Service();

    onChange = (e) => {
        const { id, sessionId } = this.props;
        sessionStorage.setItem(id, e);
        this.setState({
            stars: e,
        });
        this.getFn.postFilmRate(id, sessionId, e);
    };

    render() {
        // sessionStorage.clear()
        const { id } = this.props;
        return (
            <Rate
                className='card__stars'
                count={10}
                defaultValue='0'
                onChange={this.onChange}
                value={sessionStorage.getItem(`${id}`)}
            />
        );
    }
}
