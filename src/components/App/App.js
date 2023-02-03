/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */

import React, { Component } from 'react';
import { Pagination } from 'antd';

import DisconnectIndicator from '../DisconnectIndicator';
import { FilmGenreProvider } from '../FilmGenreContext';
import Service from '../../services/Servic';
import CardList from '../CardList';
import './App.css';
import Spiner from '../Spiner';
import Error from '../ErrorHanding';
import SearchFunction from '../Search/Search';
import Buttons from '../Buttons';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            movieData: [],
            loading: true,
            notFound: false,
            renderError: false,
            error: false,
            totalPages: 1,
            pageNumber: 1,
            genresData: [],
            button: 'Search',
            sessionId: '',
        };
    }

    getInfo = new Service();

    componentDidMount() {
        const { pageNumber } = this.state;
        this.allFillmGenres();
        this.showPopularFilms(pageNumber);
        if (sessionStorage.getItem('sessionId') === null) {
            this.createGuestSession();
        } else {
            this.setState({
                sessionId: sessionStorage.getItem('sessionId'),
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { button, pageNumber } = prevState;
        if (this.state.pageNumber !== pageNumber) {
            this.updateSearch();
        }
        if (this.state.button !== button) {
            this.togglePage();
        }
    }

    componentDidCatch() {
        this.setState({
            renderError: true,
        });
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false,
        });
    };

    createGuestSession = () => {
        this.getInfo
            .getGuestSessionId()
            .then((body) => {
                sessionStorage.setItem('sessionId', body.guest_session_id);
                this.setState({
                    sessionId: sessionStorage.sessionId,
                });
            })
            .catch(this.onError);
    };

    getGenre = (ids) => {
        const filmGenres = [];
        const { genresData } = this.state;
        ids.forEach((genreId) => {
            genresData.forEach((element) => {
                if (element.id === genreId) {
                    filmGenres.push(element.name);
                }
            });
        });
        return filmGenres;
    };

    allFillmGenres = () => {
        this.getInfo
            .getFilmGenre()
            .then((body) => {
                this.setState({
                    genresData: [...body],
                });
            })
            .catch(this.onError);
    };

    togglePage = () => {
        this.setState({
            notFound: false,
            pageNumber: 1,
            movieData: [],
        });
        const { button } = this.state;
        if (button === 'Search') {
            this.showPopularFilms();
        }
        if (button === 'Rated') {
            this.showRatedMovie();
        }
    };

    onFilmListItem = (body) => {
        const films = body.results;
        if (body.results.length === 0) {
            this.setState({
                notFound: true,
                error: false,
                loading: false,
            });
        } else {
            this.setState(() => {
                return {
                    movieData: films,
                    loading: false,
                    error: false,
                    totalPages: body.total_pages,
                    notFound: false,
                };
            });
        }
    };

    onPageChange = (page) => {
        this.setState({
            pageNumber: page,
            loading: true,
        });
    };

    makeQuery = (query) => {
        this.setState(
            {
                inputValue: query,
                pageNumber: 1,
                loading: true,
            },
            () => this.updateSearch()
        );
    };

    onButtonChange = (btn) => {
        this.setState({
            button: btn,
            pageNumber: 1,
            loading: true,
        });
    };

    showRatedMovie = () => {
        const { sessionId, pageNumber } = this.state;
        this.getInfo
            .getFilmRate(sessionId, pageNumber)
            .then((body) => {
                this.setState({
                    error: false,
                    loading: false,
                    notFound: false,
                    movieData: body.results,
                    totalPages: body.total_pages,
                });
                if (body.results.length === 0) {
                    this.setState({
                        notFound: true,
                        loading: false,
                    });
                }
            })
            .catch(this.onError);
    };

    showRequesFilm = () => {
        const { inputValue, pageNumber } = this.state;
        this.setState({
            movieData: [],
        });
        this.getInfo
            .getRequestFilms(inputValue, pageNumber)
            .then((body) => this.onFilmListItem(body))
            .catch(this.onError);
    };

    showPopularFilms() {
        const { pageNumber } = this.state;
        this.getInfo
            .getPopularFilms(pageNumber)
            .then((body) => this.onFilmListItem(body))
            .catch(this.onError);
    }

    updateSearch() {
        const { inputValue, button } = this.state;
        if (inputValue === '' && button === 'Search') {
            return this.showPopularFilms();
        }
        return this.showRequesFilm();
    }

    render() {
        if (!navigator.onLine) {
            return <DisconnectIndicator />;
        }

        const { renderError } = this.state;
        if (renderError) {
            return <Error />;
        }

        const {
            movieData,
            sessionId,
            button,
            notFound,
            pageNumber,
            totalPages,
            loading,
            error,
        } = this.state;

        const pagination =
            totalPages > 1 && !loading && !error && !notFound ? (
                <Pagination
                    className='pagination'
                    defaultCurrent={1}
                    current={pageNumber}
                    total={totalPages}
                    showSizeChanger={false}
                    disabled={false}
                    onChange={this.onPageChange}
                />
            ) : null;

        const hasData = !(error || loading || notFound);
        const warnMessage = notFound ? (
            <span className='warn-text'>No results for your search</span>
        ) : null;
        const errorMessage = error && !notFound ? <Error /> : null;
        const spiner = loading && !error && !notFound ? <Spiner /> : null;
        const buttons = !error ? (
            <Buttons onButtonChange={this.onButtonChange} />
        ) : null;
        const search = !(error || button === 'Rated') ? (
            <SearchFunction makeQuery={this.makeQuery} />
        ) : null;

        const list = hasData ? (
            <CardList data={movieData} sessionId={sessionId} />
        ) : null;
        return (
            <FilmGenreProvider value={this.getGenre}>
                <section className='container'>
                    {errorMessage}
                    {buttons}
                    {search}
                    {warnMessage}
                    {spiner}
                    {list}
                    {pagination}
                </section>
            </FilmGenreProvider>
        );
    }
}
