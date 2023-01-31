/* eslint-disable consistent-return */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-plusplus */
import React, { Component } from 'react';
import { Pagination } from 'antd';

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
            RenderError: false,
            error: false,
            totalPages: 1,
            pageNumber: 1,
            genresData: [],
            button: 'Search',
            sessionId: '',
            renderList: [],
        };
    }

    getInfo = new Service();

    componentDidMount() {
        sessionStorage.clear();
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
                    loading: false,
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
        const { movieData } = this.state;
        if (body.results.length === 0) {
            this.setState(() => {
                return {
                    notFound: true,
                    error: false,
                    loading: false,
                };
            });
        } else {
            this.setState(
                () => {
                    return {
                        movieData: [...movieData, ...films],
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

    onRenderList = (films = this.state.movieData) => {
        const newRender = [];
        if (films.length > 10) {
            for (let i = 0; i < 10; i++) {
                newRender.push(films[i]);
            }
            this.setState({
                renderList: newRender,
            });
        } else {
            this.setState({
                renderList: films,
            });
        }
    };

    onPageChange = (page) => {
        const { movieData } = this.state;
        if (page % 2 !== 0) {
            this.setState(
                {
                    movieData: [],
                    pageNumber: page,
                    loading: true,
                },
                () => this.onRenderList(movieData)
            );
        } else if (page === 1) {
            this.setState(
                {
                    movieData: [],
                    pageNumber: page,
                    loading: true,
                },
                () => this.onRenderList(movieData)
            );
        } else {
            const newRender = [];
            for (let i = 10; i < 20; i++) {
                newRender.push(movieData[i]);
            }
            this.setState({
                movieData: newRender,
                pageNumber: page,
                loading: true,
            });
        }
    };

    makeQuery = (query) => {
        this.setState({
            inputValue: query,
            pageNumber: 1,
            loading: true,
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

    showRatedMovie = () => {
        const { sessionId } = this.state;
        this.getInfo
            .getFilmRate(sessionId)
            .then((body) => {
                this.setState({
                    loading: false,
                    error: false,
                    notFound: false,
                    renderList: body.results,
                    totalPages: body.total_pages,
                });

                if (body.results.length === 0) {
                    this.setState({
                        notFound: true,
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
            this.setState(
                () => {
                    return {
                        pageNumber: 1,
                        movieData: [],
                    };
                },
                () => this.showPopularFilms()
            );
        } else {
            return this.showRequesFilm();
        }
    }

    render() {
        const { RenderError } = this.state;
        if (RenderError) {
            return <Error />;
        }

        const {
            renderList,
            sessionId,
            button,
            notFound,
            pageNumber,
            totalPages,
            loading,
            error,
        } = this.state;

        const pagination =
            totalPages >= 2 && !loading && !error && !notFound ? (
                <Pagination
                    className='pagination'
                    defaultCurrent={1}
                    current={pageNumber}
                    total={Math.ceil(totalPages / 10)}
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
