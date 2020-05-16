import React, { Component } from 'react';
import '../css/app.css';
import ReactImage from './react.png';
import ImageUploader from 'react-images-upload';
import ArtistContainer from './ArtistContainer';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = { loading: false, pictures: [], imgName: null, artists: null };
    }

    onDrop(picture) {
        var imgName = picture[0].name;
        this.setState({
            pictures: this.state.pictures.concat(picture),
            imgName: imgName,
        });
    }

    extractText() {
        fetch('api/extractText?imgName=' + this.state.imgName)
        .then(res => res.json())
        .then(function(text) {
        console.log(text.results)
            this.setState({ artists: text.results})
        }.bind(this))
    }

    editArtist() {
        console.log("EDIT")
    }

    render() {
        var linksDisplay = []
        if (this.state.artists) {
            this.state.artists.map(function(artist) {
                if (artist) {
                    var artistLink = (<ArtistContainer artistName={ artist } key={ Math.random() } />)
                    linksDisplay.push(artistLink)
                }
            }.bind(this))    
        }
        return (
            <div className="locateArtistsContainer">
                <ImageUploader
                    withIcon={ true }
                    buttonText='Choose images'
                    onChange={ this.onDrop.bind(this) }
                    imgExtension={ ['.jpg', '.gif', '.png', '.gif'] }
                    maxFileSize={ 5242880 }
                />
                <button onClick={ this.extractText.bind(this) }>GET TEXT FROM IMAGE</button>
                <div className="linksContainer">{ linksDisplay }</div>
            </div>
        );
    }
}