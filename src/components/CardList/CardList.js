import React, { Component } from 'react';

import './CardList.css';
import Error from '../ErrorHanding';
import Card from '../Card/Card';

class CardList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reactError: false,
        };
    }

    componentDidCatch() {
        this.setState({
            reactError: true,
        });
    }

    render() {
        const { reactError } = this.state;
        if (reactError) {
            return <Error />;
        }
        const { data, sessionId } = this.props;
        const elements = data.map((item) => {
            const { id } = item;
            return <Card sessionId={sessionId} {...item} key={id} />;
        });
        return <section className='card-list'>{elements}</section>;
    }
}

export default CardList;
