const _ = require('underscore')
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

    // extractText() {
    //     fetch('api/extractText?imgName=' + this.state.imgName)
    //     .then(res => res.json())
    //     .then(function(text) {
    //     console.log(text.results)
    //         this.setState({ artists: text.results})
    //     }.bind(this))
    // }

    submitPhoto(e) {
        const formData = new FormData();
        formData.append('myImage', this.refs.imageFile.files[0]);
        formData.append('fileType', "PNG")
    
        fetch("/api/uploadFile", {
            method: 'POST',
            body: formData
        }).then(response => response.json())
        .then((value) => {
            this.setState({ artists: value })
        })
    }

    deleteArtist(artist) {
        var artists = _.clone(this.state.artists);
        var artists = _.reject(artists, function(a) { return a === artist; });
        this.setState({ artists: artists })
    }

    saveArtist(oldName, newName) {
        var artists = _.clone(this.state.artists);
        var artists = _.reject(artists, function(a) { return a === oldName });
        artists.push(newName)
        console.log(artists)
        var sortedArtists = _.sortBy(artists, function (name) { return name })
        console.log(sortedArtists)
        this.setState({ artists: sortedArtists })
    }

    render() {
        var linksDisplay = []
        if (this.state.artists) {
            var sortedArtists = _.sortBy(this.state.artists, function (artist) {
               return artist;
            })
            sortedArtists.map(function(artist) {
                if (artist) {
                    var artistLink = (
                        <ArtistContainer artistName={ artist } key={ Math.random() } 
                            deleteArtist={ this.deleteArtist.bind(this) } saveArtist={ this.saveArtist.bind(this) } />
                    )
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

                  <input type="file" name="myImage" accept="image/*" ref="imageFile" />
                  <button type="submit" onClick= {this.submitPhoto.bind(this) }>Upload Photo Doof</button>
                <div className="linksContainer">{ linksDisplay }</div>
            </div>
        );
    }
}