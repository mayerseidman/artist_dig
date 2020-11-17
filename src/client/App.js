const _ = require('underscore')
import React, { Component } from 'react';
import '../css/app.css';
import '../css/artist_container.css';
import ReactImage from './react.png';
// import ImageUploader from 'react-images-upload';
import ArtistContainer from './ArtistContainer';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = { loading: false, pictures: [], imgName: null, artists: null, uploadError: false };
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
        }).then(response => {
            console.log(response)
            if (response.status == 200) {
                console.log("OK!")
                return response.json()
            } else {
                console.log("NOT OK")
                this.setState({ loading: false, uploadError: true })
            }
        }).then((value) => {
            this.setState({ artists: value, loading: false })
            return value;
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
            var pageHeader = (
                <h1 className="pageHeader">Discover new artists by uploading an image!</h1>
            )
            var subHeader = (
                 <p className="subHeader">Turn an event or festival lineup into new music by uploading the lineup image-we’ll take care of the rest.</p>
            )
            if (this.state.uploadError) {
                var errorMessage = (
                    <p className="errorMessage">
                        Try another lineup or <a href="https://compresspng.com/" target="_blank">compress your image</a>.
                    </p>
                )
                var errorStatus = "error";
            }
            var infoContainer = (
                <div className="content" id="infoContainer">
                    { pageHeader }
                    { subHeader }
                    <button onClick={ this.handleClick }>UPLOAD LINEUP</button>                
                    <input id="dot" type="file" name="myImage" accept="image/*" 
                        ref={input => this.inputElement = input}
                        onChange= {this.submitPhoto.bind(this) }
                        style={{ "display" : "none" }}/>
                    { errorMessage }
                </div>
            )
            // var divider = (<div className="divider"></div>)
            // var buttonsContainer = (
            //     <div className="content" id="buttonsContainer">
            //         <div></div>
            //         <div></div>
            //         <div></div>
            //     </div>
            // )
            // var startContainer = (
            //     <div className="modernViewContainer">
            //         <div className="container">
            //             <div className="innerRenderer">
            //                 { infoContainer }
            //                 { divider }
            //                 { buttonsContainer }
            //             </div>             
            //         </div>
            //     </div>
            // )

            var startContainer = (
                <div className="modernViewContainer">
                    <div id="container">
                        <div className="modernViewRenderer">
                            <div className="content" id="textbox">
                                <h1 className="header">Discover new artists by uploading an image!</h1>
                                <p className="tagline">Turn an event or festival lineup into new music by uploading the lineup image.</p>
                                <button className="uploadBTN" onClick={ this.handleClick }>UPLOAD LINEUP</button>                
                                <input id="dot" type="file" name="myImage" accept="image/*" 
                                    ref={input => this.inputElement = input}
                                    onChange= {this.submitPhoto.bind(this) }
                                    style={{ "display" : "none" }}/>
                                <p className={ "requirementsText " + errorStatus }>Images must be smaller than 1MB.</p>
                            </div>
                            <div className="vl"></div>
                            <div className="content" id="buttonsbox">
                                <p className="guideText">Select a lineup to see  how it works</p>
                                <button className="btn primary" data-tid="download">
                                    <img src="https://statics.teams.microsoft.com/hashedassets-launcher/v2/download_primary.4f032ac4490597140fc616ca18480d7e.svg" className="img" aria-hidden="true" />
                                    <div className="text">
                                        <h3>SHAMBALA FESTIVAL</h3>
                                        <p>WESTERN CANADA</p>
                                    </div>
                                </button>
                                <button className="btn primary" data-tid="joinOnWeb">
                                    <img src="https://statics.teams.microsoft.com/hashedassets-launcher/v2/continue_primary.0d5b496c234c245d7dd65c8ebbef5891.svg" className="img" aria-hidden="true" />
                                    <div className="text">
                                        <h3>GREEN MAN FESTIVAL</h3>
                                        <p>UNITED KINGDOM</p>
                                    </div>
                                </button>
                                <button className="btn primary" data-tid="joinInApp">
                                    <img src="https://statics.teams.microsoft.com/hashedassets-launcher/v2/logo_teams.6b4e1ac088270d6bc887d2ae9bcbb04c.svg" className="img" aria-hidden="true" />
                                    <div className="text">
                                        <h3>LET IT ROLL</h3>
                                        <p>CZECH REPUBLIC</p>
                                        </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        if (this.state.loading) {
            var className = "loadingBackground";
        } else {
            var artistsDisplay = []
            var artists = this.state.artists;
            if (artists) {
                var trimmedArtists = artists.filter(function() { return true; });
                var artistsCount = trimmedArtists.filter(function(e){return e}).length;
                if (artistsCount >= 12) {
                    var longer = "longer";
                }
                var className = "resultsBackground " + longer;
                var sortedArtists = _.sortBy(artists, function (artist) {
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
                var results = (
                    <div className="resultsContainer">
                        <p className="header">YOUR LINEUP</p>
                        <div class="our-table">
                            { artistsDisplay }
                        </div> 
                    </div>
                )
            }
        }
        return (
            <div className={ "locateArtistsContainer  " + className }>
                { startContainer }
                { results }
            </div>
        );
    }
}