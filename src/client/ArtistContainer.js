import React, { Component } from 'react';

import SoundcloudImage from './images/icons/soundcloud.png';
import SpotifyImage from './images/icons/spotify.png';
import YoutubeImage from './images/icons/youtube.png';

import '../css/app.css';

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
        const spotifyURL = "https://open.spotify.com/search/" + artist;
        const youtubeURL = "https://www.youtube.com/results?search_query=" + artist + "music artist";
        var editLink = (<a className="editLink" onClick={ this.openEditArtist.bind(this, artist) }>EDIT</a>)
        var deleteLink = (<a className="deleteLink" onClick={ this.deleteArtist.bind(this, artist) }>DELETE</a>)
        if (this.state.editArtist) {
            var artistField = (
                <div className="our-cell artistName editContainer editMobile">
                    <input type="text" className="form-control" ref="artistName" onChange={ this.handleChange.bind(this) } 
                        value={ this.state.artistName } />
                    <a onClick={ this.saveArtist.bind(this) }>Save</a>
                </div>
            )
            var className = "hidden";
            var pullLeft = "pullLeft";
        } else {
            var artistField = <div className="our-cell artistName">{ artist}</div>
        }
        var soundcloudField = (
            <div className={ "our-cell soundcloud " + className }>
                <a className="artistLink" href={ soundcloudURL } target="_blank">
                    <img src={ SoundcloudImage } />
                </a>
            </div>
        )
        var spotifyField = (
            <div className={ "our-cell serviceField " + className }>
                <a className="artistLink" href={ spotifyURL } target="_blank">
                    <img src={ SpotifyImage } />
                </a>
            </div>
        )
        var youtubeField = (
            <div className={ "our-cell serviceField " + className }>
                <a className="artistLink" href={ youtubeURL } target="_blank">
                    <img src={ YoutubeImage } />
                </a>
            </div>
        )
        var actionsField = (
            <div className="our-cell editContainer hideOnMobile">
                { editLink }
                { deleteLink }
            </div>
        )
        var mobileActionsField = (
            <div className={ "mobileActions " + pullLeft }>
                <a href="#">...</a>
                <div class="popover__content">
                    <p class="popover__message">
                        { editLink }
                        { deleteLink }
                    </p>
                </div>
            </div>
        )
        return (
            <div className="our-row">
                { artistField }
                { soundcloudField }
                { spotifyField }
                { youtubeField }
                { actionsField }
                { mobileActionsField }
            </div>
        )
    }

    componentDidMount() {
        this.setState({ originalName: this.props.artistName, artistName: this.props.artistName })
    }

    render() {
        var artistContainer = this.renderArtist();
        return artistContainer;
    }
}