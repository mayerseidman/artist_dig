import React, { Component } from 'react';
import '../css/app.css';
import ReactImage from './react.png';

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
        const spoitfyURL = "https://open.spotify.com/search/people?q=" + artist;
        return (
            <div>
                <div>
                    <span>Soundcloud: </span>
                    <a className="artistLink" href={ soundcloudURL } target="_blank">{ artist }</a>
                </div>
                <div>
                    <span>Spotify: </span>
                    <a className="artistLink" href={ spoitfyURL } target="_blank">{ artist }</a>
                </div>
                <div>
                    <a onClick={ this.openEditArtist.bind(this, artist) }>Edit</a> 
                    <a onClick={ this.deleteArtist.bind(this, artist) }>Delete</a>
                </div>
            </div>
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
        return (
            <div className="artistContainer">
                { artistContainer } 
            </div>       
        )
    }
}