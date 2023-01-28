import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import './Search.css';
import { Input } from 'antd';

export default class SearchFunction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            label: '',
        };
    }

    onChangeLabel = (e) => {
        if (e.target.value.length === 1) {
            const query = e.target.value.trim().replace(/ +/g, ' ');
            this.setState({
                label: query,
            });
        } else {
            this.setState(
                {
                    label: e.target.value,
                },
                debounce(this.searching, 800)
            );
        }
    };

    onSubmit = (e) => {
        this.setState({
            label: '',
        });
        e.preventDefault();
    };

    searching = () => {
        const { makeQuery } = this.props;
        const { label } = this.state;
        makeQuery(label);
    };

    render() {
        const { label } = this.state;
        return (
            <form className='search' onSubmit={this.onSubmit}>
                <Input
                    className='search__placeholder'
                    placeholder='Type to search...'
                    onChange={this.onChangeLabel}
                    type='text'
                    value={label}
                />
            </form>
        );
    }
}
