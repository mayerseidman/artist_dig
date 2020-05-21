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

    extractText() {
        fetch('api/extractText?imgName=' + this.state.imgName)
        .then(res => res.json())
        .then(function(text) {
        console.log(text.results)
            this.setState({ artists: text.results})
        }.bind(this))
    }

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
        console.log(artist)
        var artists = _.clone(this.state.artists);
        console.log(artists.length)
        var artists = _.reject(artists, function(a) { return a === artist; });
        console.log(artists.length)
        this.setState({ artists: artists })
        // _.each(studentList.students, (student) => {
        //     delete studentsSelectedIDs[student.id];
        // });
    }

    render() {
        var linksDisplay = []
        if (this.state.artists) {
            this.state.artists.map(function(artist) {
                if (artist) {
                    var artistLink = (<ArtistContainer artistName={ artist } key={ Math.random() } deleteArtist={ this.deleteArtist.bind(this, artist) } />)
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
                <button onClick={ this.extractText.bind(this) }>GET TEXT FROM IMAGE</button>
                <div className="linksContainer">{ linksDisplay }</div>
            </div>
        );
    }
}