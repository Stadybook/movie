import React from 'react';

import './CardList.css';
import Card from '../Card/Card';

function CardList({ data, sessionId }) {
    const elements = data.map((item) => {
        const { id } = item;
        return <Card sessionId={sessionId} {...item} key={id} />;
    });
    return <section className='card-list'>{elements}</section>;
}

export default CardList;
