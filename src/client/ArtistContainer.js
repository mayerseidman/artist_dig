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
    // renderEditField = () => {
    //     var artist = this.state.artistName;
    //     var editField = (
    //         <td>
    //             <input type="text" className="form-control" ref="artistName" onChange={ this.handleChange.bind(this) } 
    //                 value={ this.state.artistName } />
    //             <a onClick={ this.saveArtist.bind(this) }>Save</a>
    //         </td>
    //     )
    //     return editField;
    // }
    renderArtistField = () => {
        var artist = this.props.artistName;
        if (this.state.editArtist) {
            var className = "editContainer";
            var artistField = (
                <div className={ className }>
                    <input type="text" className="form-control" ref="artistName" onChange={ this.handleChange.bind(this) } 
                        value={ this.state.artistName } style={{width: `${(this.state.artistName.length + 1) * 8}px`}} />
                    <a className="editLink" onClick={ this.saveArtist.bind(this) }>Save</a>
                </div>
            )
        } else {
            var artistField = <td className="cell artistName">{ artist}</td>
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
            <div className={ "cell soundcloud " + className }>
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
            <div className={ "cell serviceField " + className }>
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
            <div className={ "cell serviceField " + className }>
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
            <div className="cell editContainer hideOnMobile">
                { editLink }
                { deleteLink }
            </div>
        )
        return actionsField;
    }
    renderMobileActions = () => {
        var artist = this.props.artistName;
        var editLink = (<a className="editLink" onClick={ this.openEditArtist.bind(this, artist) }>EDIT</a>)
        var deleteLink = (<a className="deleteLink" onClick={ this.deleteArtist.bind(this, artist) }>DELETE</a>)
        var mobileActionsField = (
            <div>
                <a className="options">...</a>
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
        if (this.state.editArtist) {
            var editClass = "edit";
            var hideClass = "hide";
        }
        return (
            <div className="tr">
                <div className="td name">{ this.renderArtistField() }</div>
                <div className={ "td right " + hideClass }>{ this.renderSoundcloudField() }</div>
                <div className={ "td center " + hideClass }>{ this.renderSpotifyField() }</div>
                <div className={ "td " + hideClass }>{ this.renderYouTubeField() }</div>
                <div className="td right actions">{ this.renderActions() }</div>
                <div className={ "td right mobileActions "  + editClass }>{ this.renderMobileActions() }</div>
            </div>
        )
        // return (
        //     <tr>
        //         { this.renderArtistField() }
        //         { this.renderSoundcloudField() }
        //         { this.renderSpotifyField() }
        //         { this.renderYouTubeField() }
        //         { this.renderActions() }
        //         { this.renderMobileActions() }
        //     </tr>
        // )
    }
    componentDidMount() {
        this.setState({ originalName: this.props.artistName, artistName: this.props.artistName })
    }
    render() {
        var artistContainer = this.renderArtist();
        return artistContainer;
    }
}