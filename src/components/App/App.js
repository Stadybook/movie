/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { Pagination } from 'antd';

import Service from '../../services/Servic';
import CardList from '../CardList';
import './App.css';
import Spiner from '../Spiner';
import Error from '../ErrorHanding';
import SearchFunction from '../Search/Search';
import Buttons from '../Buttons';
import { FilmGenreProvider } from '../FilmGenreContext';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            movieData: [],
            loading: true,
            notFound: false,
            RenderError: false,
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
        // sessionStorage.clear()
        const { pageNumber } = this.state;
        this.allFillmGenres();
        this.showPopularFilms(pageNumber);
        this.createGuestSession();
    }

    componentDidUpdate(prevProps, prevState) {
        const { inputValue, button, pageNumber } = prevState;
        if (
            this.state.inputValue !== inputValue ||
            this.state.pageNumber !== pageNumber
        ) {
            this.updateSearch();
        }
        if (this.state.button !== button) {
            this.togglePage();
        }
    }

    componentDidCatch() {
        this.setState({
            RenderError: true,
        });
    }

    togglePage = () => {
        this.setState({
            notFound: false,
            pageNumber: 1,
        });
        const { button } = this.state;
        if (button === 'Search') {
            this.showFilms();
        }
        if (button === 'Rated') {
            this.showRatedMovie();
        }
    };

    createGuestSession = () => {
        this.getInfo
            .getGuestSessionId()
            .then((body) => {
                sessionStorage.setItem('sessionId', body.guest_session_id);
                this.setState({
                    sessionId: sessionStorage.sessionId,
                    loading: false,
                });
            })
            .catch(this.onError);
    };

    pageChanging = (page) => {
        this.setState({
            pageNumber: page,
            loading: true,
        });
    };

    onError = () => {
        this.setState({
            error: true,
            loading: false,
        });
    };

    onButtonChange = (btn) => {
        this.setState(() => {
            return {
                button: btn,
                pageNumber: 1,
                loading: true,
            };
        });
    };

    makeQuery = (query) => {
        this.setState({
            inputValue: query,
            pageNumber: 1,
            loading: true,
        });
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

    showRatedMovie = () => {
        const { sessionId, pageNumber } = this.state;
        this.getInfo
            .getFilmRate(sessionId)
            .then((body) => {
                this.setState({
                    loading: false,
                    error: false,
                    notFound: false,
                    movieData: body.results,
                    totalPages: body.total_pages,
                    pageNumber,
                });

                if (body.results.length === 0) {
                    this.setState({
                        notFound: true,
                    });
                }
            })
            .catch(this.onError);
    };

    showPopularFilms() {
        const { pageNumber } = this.state;
        this.getInfo
            .getPopularFilms(pageNumber)
            .then((body) => {
                this.setState({
                    notFound: false,
                    loading: false,
                    error: false,
                    movieData: body.results,
                    totalPages: body.total_pages,
                    pageNumber,
                });
            })
            .catch(this.onError);
    }

    showFilms() {
        const { pageNumber, inputValue, button } = this.state;
        if (inputValue === '') {
            this.showPopularFilms();
        } else if (button === 'Rated') {
            this.showRatedMovie();
        } else {
            this.getInfo
                .getRequestFilms(inputValue, pageNumber)
                .then((body) => {
                    this.setState({
                        loading: false,
                        notFound: false,
                        error: false,
                        totalPages: body.total_pages,
                        pageNumber,
                        movieData: body.results,
                    });
                    if (body.results.length === 0) {
                        this.setState({
                            notFound: true,
                        });
                    }
                })
                .catch(this.onError);
        }
    }

    updateSearch() {
        const { inputValue, button } = this.state;
        if (inputValue === '' && button === 'Search') {
            return this.showPopularFilms();
        }
        return this.showFilms();
    }

    render() {
        const { RenderError } = this.state;
        if (RenderError) {
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
            totalPages >= 2 && !loading && !error ? (
                <Pagination
                    className='pagination'
                    defaultCurrent={1}
                    current={pageNumber}
                    total={Math.ceil(totalPages / 10)}
                    showSizeChanger={false}
                    disabled={false}
                    onChange={this.pageChanging}
                />
            ) : null;

        const hasData = !(error || loading || notFound);
        const warnMessage = notFound ? (
            <span className='warn-text'>No results for your search</span>
        ) : null;
        const errorMessage = error ? <Error /> : null;
        const spiner = loading && !error ? <Spiner /> : null;
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
