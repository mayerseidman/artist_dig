const _ = require('underscore')
import React, { Component } from 'react';
import '../css/app.css';
import ReactImage from './react.png';
// import ImageUploader from 'react-images-upload';
import ArtistContainer from './ArtistContainer';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = { loading: false, pictures: [], imgName: null, artists: null };
    }
    // onDrop(picture) {
    //     var imgName = picture[0].name;
    //     this.setState({
    //         pictures: this.state.pictures.concat(picture),
    //         imgName: imgName,
    //     });
    // }

    // extractText() {
    //     fetch('api/extractText?imgName=' + this.state.imgName)
    //     .then(res => res.json())
    //     .then(function(text) {
    //     console.log(text.results)
    //         this.setState({ artists: text.results})
    //     }.bind(this))
    // }

    submitPhoto = (e) => {
        this.setState({ loading: true })
        const formData = new FormData();
        formData.append('myImage', this.inputElement.files[0]);
        formData.append('fileType', "PNG")
    
        fetch("/api/uploadFile", {
            method: 'POST',
            body: formData
        }).then(response => response.json())
        .then((value) => {
            this.setState({ artists: value, loading: false })
        })
    }

    deleteArtist = (artist) => {
        var artists = _.clone(this.state.artists);
        var artists = _.reject(artists, function(a) { return a === artist; });
        this.setState({ artists: artists })
    }

    saveArtist = (oldName, newName) => {
        var artists = _.clone(this.state.artists);
        var artists = _.reject(artists, function(a) { return a === oldName });
        artists.push(newName)
        console.log(artists)
        var sortedArtists = _.sortBy(artists, function (name) { return name })
        console.log(sortedArtists)
        this.setState({ artists: sortedArtists })
    }

    componentDidMount = () => {
        this.timer = setTimeout(() => {
        }, 5000);
    }
    componentWillUnmount = () => {
        clearTimeout(this.timer);
    }

    handleClick = (e) => {
      this.inputElement.click();
    }

    render() {
        if (!this.state.artists && !this.state.loading) {
            var startContainer = (
                <div className="buttonsContainer">
                    <div className="innerContainer">
                        <a onClick={ this.handleClick }>Upload Lineup!</a>                
                        <input id="dot" type="file" name="myImage" accept="image/*" 
                            ref={input => this.inputElement = input}
                            onChange= {this.submitPhoto.bind(this) }
                            style={{ "display" : "none" }}/>
                    </div>
                </div>
            )
        }
        if (this.state.loading) {
            var className = "loadingBackground";
        } else {
            var artistsDisplay = []
            if (this.state.artists) {
                var className = "resultsBackground";
                var sortedArtists = _.sortBy(this.state.artists, function (artist) {
                   return artist;
                })
                sortedArtists.map(function(artist) {
                    if (artist) {
                        var artistLink = (
                            <ArtistContainer artistName={ artist } key={ Math.random() } 
                                deleteArtist={ this.deleteArtist.bind(this) } saveArtist={ this.saveArtist.bind(this) } />
                        )
                        artistsDisplay.push(artistLink)
                    }
                }.bind(this))    
            }
        }
        return (
            <div className={ "locateArtistsContainer  " + className }>
                { startContainer }
                <div className="linksContainer">
                    { artistsDisplay }
                </div>
            </div>
        );
    }
}