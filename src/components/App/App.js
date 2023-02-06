/* eslint-disable no-plusplus */
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
            renderList: [],
            paginationPage: 1,
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
            this.setState(
                () => {
                    return {
                        movieData: films,
                        loading: false,
                        error: false,
                        totalPages: body.total_pages,
                        notFound: false,
                    };
                },
                () => this.onRenderList(this.state.movieData)
            );
        }
    };

    onRenderList = (films) => {
        const { paginationPage } = this.state;
        const newRender = [];
        if (films.length > 10) {
            if (paginationPage % 2 === 0) {
                for (let i = 10; i < films.length; i++) {
                    newRender.push(films[i]);
                }
            } else {
                for (let i = 0; i < 10; i++) {
                    newRender.push(films[i]);
                }
            }
            this.setState({
                renderList: newRender,
            });
        } else {
            for (let i = 0; i < films.length; i++) {
                newRender.push(films[i]);
            }
            this.setState({
                renderList: newRender,
                loading: false,
            });
        }
    };

    onPageChange = (page) => {
        if (page === 1) {
            this.setState(
                {
                    movieData: [],
                    paginationPage: 1,
                    pageNumber: page,
                    loading: true,
                },
                () => this.updateSearch()
            );
        } else if (page % 2 !== 0) {
            const requestPage = Math.ceil((page + 1) / 2);
            this.setState(
                {
                    movieData: [],
                    pageNumber: requestPage,
                    paginationPage: page,
                    loading: true,
                },
                () => this.updateSearch()
            );
        } else {
            const requestPage = page / 2;
            this.setState(
                {
                    movieData: [],
                    pageNumber: requestPage,
                    paginationPage: page,
                    loading: true,
                },
                () => this.updateSearch()
            );
        }
    };

    makeQuery = (query) => {
        const { button } = this.state;
        if (query === '' && button === 'Search') {
            this.setState(
                {
                    inputValue: query,
                    pageNumber: 1,
                    paginationPage: 1,
                    loading: true,
                    movieData: [],
                },
                () => this.showPopularFilms()
            );
        } else {
            this.setState(
                {
                    inputValue: query,
                    pageNumber: 1,
                    paginationPage: 1,
                    loading: true,
                    movieData: [],
                },
                () => this.showRequesFilm()
            );
        }
    };

    onButtonChange = (btn) => {
        this.setState(
            {
                button: btn,
                pageNumber: 1,
                loading: true,
                paginationPage: 1,
            },
            () => this.togglePage()
        );
    };

    showRatedMovie = () => {
        const { sessionId, pageNumber } = this.state;
        this.getInfo
            .getFilmRate(sessionId, pageNumber)
            .then((body) => this.onFilmListItem(body))
            .catch(this.onError);
    };

    showRequesFilm = () => {
        const { inputValue, pageNumber } = this.state;
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
        if (button === 'Rated') {
            return this.showRatedMovie();
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
            renderList,
            movieData,
            sessionId,
            button,
            notFound,
            paginationPage,
            totalPages,
            loading,
            error,
        } = this.state;

        let pageALl;
        if (movieData.length % 20 === 0) {
            pageALl = totalPages * 2;
        } else if (totalPages === 1 && movieData.length > 10) {
            pageALl = 2;
        } else if (totalPages !== 1 && movieData.length % 20 > 10) {
            pageALl = totalPages * 2;
        } else if (totalPages !== 1 && movieData.length % 20 <= 10) {
            pageALl = totalPages * 2 - 1;
        } else {
            pageALl = 1;
        }

        const pagination =
            movieData.length >= 11 && !loading && !error && !notFound ? (
                <Pagination
                    className='pagination'
                    defaultCurrent={1}
                    current={paginationPage}
                    total={pageALl * 10}
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
            <CardList data={renderList} sessionId={sessionId} />
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
