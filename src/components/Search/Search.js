import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import './Search.css';
import { Input } from 'antd';

export default class SearchFunction extends Component {
    searching = (e) => {
        const { makeQuery } = this.props;
        const query = e.target.value.trim().replace(/ +/g, '');
        makeQuery(query);
    };

    // eslint-disable-next-line class-methods-use-this
    onSubmit = (e) => {
        e.preventDefault();
    };

    render() {
        return (
            <form className='search' onSubmit={this.onSubmit}>
                <Input
                    className='search__placeholder'
                    placeholder='Type to search...'
                    onChange={debounce(this.searching, 800)}
                    type='text'
                />
            </form>
        );
    }
}
