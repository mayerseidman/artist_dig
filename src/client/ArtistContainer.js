import React, { Component } from 'react';

import SoundcloudImage from './images/icons/soundcloud.png';
import SpotifyImage from './images/icons/spotify.png';
import YoutubeImage from './images/icons/youtube.png';

import '../css/app.css';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = { artistName: null, originalName: null, editArtist: false };
    }
    openEditArtist = () => {
        this.setState({ editArtist: true })
    }
    handleChange({ target: { value } }) {
        this.setState({ originalArtist: this.state.artistName })
        this.setState(prevState=> ({ artistName: value }));
    }
    saveArtist = (e) => {
        var newName = this.refs.artistName.value;
        var oldName = this.state.originalName;
        this.props.saveArtist(oldName, newName)
        this.setState({ editArtist: false })
    }
    deleteArtist = (artist) => {
        this.props.deleteArtist(artist);
    }
    renderEditField = () => {
        var artist = this.state.artistName;
        var editField = (
            <div>
                <input type="text" className="form-control" ref="artistName" onChange={ this.handleChange.bind(this) } 
                    value={ this.state.artistName } />
                <a onClick={ this.saveArtist.bind(this) }>Save</a>
            </div>
        )
        return editField;
    }
    renderArtistField = () => {
        var artist = this.props.artistName;
        if (this.state.editArtist) {
            var artistField = (
                <div className="ourCell artistName editContainer editMobile">
                    <input type="text" className="form-control" ref="artistName" onChange={ this.handleChange.bind(this) } 
                        value={ this.state.artistName } />
                    <a onClick={ this.saveArtist.bind(this) }>Save</a>
                </div>
            )
        } else {
            var artistField = <div className="ourCell artistName">{ artist}</div>
        }
        return artistField;
    }
    renderSoundcloudField = () => {
        var artist = this.props.artistName;
        const soundcloudURL = "https://soundcloud.com/search/people?q=" + artist;
        if (this.state.editArtist) {
            var className = "hidden";
        }
        var soundcloudField = (
            <div className={ "ourCell soundcloud " + className }>
                <a className="artistLink" href={ soundcloudURL } target="_blank">
                    <img src={ SoundcloudImage } />
                </a>
            </div>
        )
        return soundcloudField;
    }
    renderSpotifyField = () => {
        var artist = this.props.artistName;
        const spotifyURL = "https://open.spotify.com/search/" + artist;
        if (this.state.editArtist) {
            var className = "hidden";
        }
        var spotifyField = (
            <div className={ "ourCell serviceField " + className }>
                <a className="artistLink" href={ spotifyURL } target="_blank">
                    <img src={ SpotifyImage } />
                </a>
            </div>
        )
        return spotifyField;
    }
    renderYouTubeField = () => {
        var artist = this.props.artistName;
        const youtubeURL = "https://www.youtube.com/results?search_query=" + artist + "+music+artist";
        if (this.state.editArtist) {
            var className = "hidden";
        }
        var youtubeField = (
            <div className={ "ourCell serviceField " + className }>
                <a className="artistLink" href={ youtubeURL } target="_blank">
                    <img src={ YoutubeImage } />
                </a>
            </div>
        )
        return youtubeField;
    }
    renderActions = () => {
        var artist = this.props.artistName;
        var editLink = (<a className="editLink" onClick={ this.openEditArtist.bind(this, artist) }>EDIT</a>)
        var deleteLink = (<a className="deleteLink" onClick={ this.deleteArtist.bind(this, artist) }>DELETE</a>)
        var actionsField = (
            <div className="ourCell editContainer hideOnMobile">
                { editLink }
                { deleteLink }
            </div>
        )
        return actionsField;
    }
    renderMobileActions = () => {
        var artist = this.props.artistName;
        if (this.state.editArtist) {
            var pullLeft = "pullLeft";
        }
        var editLink = (<a className="editLink" onClick={ this.openEditArtist.bind(this, artist) }>EDIT</a>)
        var deleteLink = (<a className="deleteLink" onClick={ this.deleteArtist.bind(this, artist) }>DELETE</a>)
        var mobileActionsField = (
            <div className={ "mobileActions " + pullLeft }>
                <a href="#">...</a>
                <div class="popoverContent">
                    <p class="popoverMessage">
                        { editLink }
                        { deleteLink }
                    </p>
                </div>
            </div>
        )
        return mobileActionsField;
    }
    renderArtist() {
        return (
            <div className="ourRow">
                { this.renderArtistField() }
                { this.renderSoundcloudField() }
                { this.renderSpotifyField() }
                { this.renderYouTubeField() }
                { this.renderActions() }
                { this.renderMobileActions() }
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