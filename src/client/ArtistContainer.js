import React, { Component } from 'react';
import '../css/app.css';
import ReactImage from './react.png';
import SoundcloudImage from './soundcloud.png';
import SpotifyImage from './spotify.png';
import YoutubeImage from './youtube.png';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = { loading: false, artistName: null, originalName: null, editArtist: false };
    }

    openEditArtist() {
        this.setState({ editArtist: true })
    }

    handleChange({ target: { value } }) {
        this.setState({ originalArtist: this.state.artistName })
        this.setState(prevState=> ({ artistName: value }));
    }

    // Really should be doing the saving at top level and then it automatically adjusts everything in here too...
    saveArtist(e) {
        console.log(this.refs.artistName.value)
        var newName = this.refs.artistName.value;
        var oldName = this.state.originalName;
        this.props.saveArtist(oldName, newName)
        this.setState({ editArtist: false })
    }

    deleteArtist(artist) {
        this.props.deleteArtist(artist);
    }

    renderEditField() {
        var artist = this.state.artistName;
        return (
            <div>
                <input type="text" className="form-control" ref="artistName" onChange={ this.handleChange.bind(this) } 
                    value={ this.state.artistName } />
                <a onClick={ this.saveArtist.bind(this) }>Save</a>
            </div>
        )
    }

    renderArtist() {
        var artist = this.props.artistName;
        const soundcloudURL = "https://soundcloud.com/search/people?q=" + artist;
        const spotifyURL = "https://open.spotify.com/search/people?q=" + artist;
        const youtubeURL = "https://www.youtube.com/results?search_query=" + artist + "music artist";
        var editLink = (<a onClick={ this.openEditArtist.bind(this, artist) }>Edit</a>)
        var deleteLink = (<a onClick={ this.deleteArtist.bind(this, artist) }>Delete</a>)
        return (
            <tr>
                <td data-label="Edit" className="artistName">{ artist}</td>
                <td data-label="Soundcloud" className="soundcloud">
                    <a className="artistLink" href={ soundcloudURL } target="_blank">
                        <img src={ SoundcloudImage } />
                    </a>
                </td>
                <td data-label="Spotify">
                    <a className="artistLink" href={ spotifyURL } target="_blank">
                        <img src={ SpotifyImage } />
                    </a>
                </td>
                <td data-label="Youtube">
                    <a className="artistLink" href={ youtubeURL } target="_blank">
                        <img src={ YoutubeImage } />
                    </a>
                </td>
                <td data-label="Edit" className="actions">...</td>
            </tr>
        )
    }

    componentDidMount() {
        this.setState({ originalName: this.props.artistName, artistName: this.props.artistName })
    }

    render() {
        if (this.state.editArtist) {
            var artistContainer= this.renderEditField();
        } else {
            var artistContainer = this.renderArtist();
        }
        return artistContainer;
    }
}