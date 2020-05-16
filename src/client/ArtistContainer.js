import React, { Component } from 'react';
import '../css/app.css';
import ReactImage from './react.png';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = { loading: false, artistName: null, editArtist: false };
    }

    editArtist(artist) {
        console.log("EDIT", artist)
        this.setState({ editArtist: true })
    }

    handleChange({ target: { value } }) {   
        this.setState(prevState=> ({ artistName: value }));
    };

    saveArtist() {
        this.setState({ editArtist: false })
    }

    renderEditField() {
        var artist = this.state.artistName;
        return (
            <div>
                <input type="text" className="form-control" ref="phone_number" onChange={ this.handleChange.bind(this) } 
                    value={ this.state.artistName } />
                <a onClick={ this.saveArtist.bind(this, artist) }>Save</a>
            </div>
        )
    }

    renderArtist() {
        var artist = this.state.artistName;
        const soundcloudURL = "https://soundcloud.com/search/people?q=" + artist;
        return (
            <div>
                <a className="artistLink" href={ soundcloudURL } target="_blank">{ artist }</a>
                <a onClick={ this.editArtist.bind(this, artist) }>Edit</a>
            </div>
        )
    }

    componentDidMount() {
        this.setState({ artistName: this.props.artistName })
    }

    render() {
        if (this.state.editArtist) {
            var artistContainer= this.renderEditField();
        } else {
            var artistContainer = this.renderArtist();
        }
        return (
            <div className="artistContainer">
                { artistContainer } 
            </div>       
        )
    }
}