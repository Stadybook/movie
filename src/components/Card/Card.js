import React, { Component } from 'react';
import { format } from 'date-fns';
import { Image, Typography } from 'antd';

import CuttingFn from '../CuttingFn/CuttingFn';
import Error from '../ErrorHanding';
import './Card.css';
import { FilmGenreConsumer } from '../FilmGenreContext';
import FilmRating from '../FilmRating';

const { Title, Paragraph, Text } = Typography;

export default class Card extends Component {
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

        const {
            sessionId,
            id,
            title,
            genre_ids: genreIds,
            overview,
            backdrop_path: backdropPath,
            release_date: releasDate,
            vote_average: voteAverage,
        } = this.props;
        const releaseDate = releasDate
            ? format(new Date(releasDate), 'MMMM dd, yyyy')
            : 'no release date';
        const photoURL = 'https://image.tmdb.org/t/p/original'; // `https://image.tmdb.org/t/p/w500
        const src = backdropPath
            ? `${photoURL}${backdropPath}`
            : 'https://place-hold.it/280x1000/e1eaf1/000/c8c7f7?text=No poster';
        const vote = Math.floor(voteAverage * 10) / 10;
        const filmGenres = (
            <FilmGenreConsumer>
                {(getGenre) => {
                    return (
                        <>
                            {getGenre(genreIds).map((genre) => {
                                return (
                                    <Text keyboard key={genre} className='text'>
                                        {genre}
                                    </Text>
                                );
                            })}
                        </>
                    );
                }}
            </FilmGenreConsumer>
        );

        const plot = overview ? CuttingFn(overview, 180) : 'No overview';

        const mark = Number(voteAverage);
        let colorBorder;
        if (mark >= 0 && mark <= 3) {
            colorBorder = '#E90000';
        } else if (mark > 3 && mark < 5) {
            colorBorder = '#E97E00';
        } else if (mark >= 5 && mark < 7) {
            colorBorder = '#E9D100';
        } else {
            colorBorder = '#66E900';
        }

        return (
            <li key={id} className='card'>
                <Image src={src} alt='movie-zphoto' />
                <div className='card__info'>
                    <Typography className='card__description'>
                        <Title className='card__title' level={4}>
                            {title}
                        </Title>
                        <span className='card__date'>{releaseDate} </span>
                        <br />
                        <div className='card__genres'>{filmGenres}</div>
                        <Paragraph className='card__plot'>{plot}</Paragraph>
                    </Typography>
                    <FilmRating
                        className='card__stars'
                        id={id}
                        sessionId={sessionId}
                    />
                </div>
                <span
                    style={{ borderColor: `${colorBorder}` }}
                    className='card__mark'
                >
                    {vote}
                </span>
            </li>
        );
    }
}
