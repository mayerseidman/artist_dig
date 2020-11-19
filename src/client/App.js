const _ = require('underscore')
import React, { Component } from 'react';

import ArtistContainer from './ArtistContainer';
import elementsImage from './images/lineups/elements.png';
import rainbowImage from './images/lineups/rainbow-serpent.png';
import whatImage from './images/lineups/what.png';

import '../css/app.css';
import '../css/artist_container.css';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.state = { 
            loading: false, 
            pictures: [], 
            imgName: null, 
            artists: null, 
            uploadError: false,
            image: "",
            showImage: false
         };
    }

    selectLineup = () =>  {
        console.log("SELECTED")
    }

    submitPhoto = (e) => {
        const file = this.inputElement.files[0];
        this.setState({ loading: true, image: URL.createObjectURL(file) })
        const formData = new FormData();
        formData.append('myImage', file);
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
        this.setState({ deleteArtist: true })
        var artists = _.clone(this.state.artists);
        var artists = _.reject(artists, function(a) { return a === artist; });
        this.setState({ artists: artists })
        setTimeout(() => {
            this.setState({ deleteArtist: false })
        }, 3000);
    }

    saveArtist = (oldName, newName) => {
        this.setState({ saveArtist: true })
        var artists = _.clone(this.state.artists);
        var artists = _.reject(artists, function(a) { return a === oldName });
        artists.push(newName)
        console.log(artists)
        var sortedArtists = _.sortBy(artists, function (name) { return name })
        console.log(sortedArtists)
        this.setState({ artists: sortedArtists })
        setTimeout(() => {
            this.setState({ saveArtist: false })
        }, 3000);
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

    viewImage = () => {
        this.setState({ showImage: true })
        window.scrollTo(0, this.myRef.current.offsetTop);
    }

    hideImage = () => {
        this.setState({ showImage: false })
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

            var startContainer = (
                <div className="viewContainer">
                    <div id="container">
                        <div className="viewRenderer">
                            <div className="content" id="textContainer">
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
                            <div className="content" id="buttonsContainer">
                                <p className="guideText">Select a lineup to see  how it works</p>
                                <button className="btn primary">
                                    <img src={ elementsImage } className="img" aria-hidden="true" />
                                    <div className="lineupText">
                                        <h3>ELEMENTS FESTIVAL</h3>
                                        <p>UNITED STATES</p>
                                    </div>
                                </button>
                                <button className="btn primary">
                                    <img src={ rainbowImage } className="img" aria-hidden="true" />
                                    <div className="lineupText">
                                        <h3>RAINBOW & SERPENT</h3>
                                        <p>AUSTRALIA</p>
                                    </div>
                                </button>
                                <button className="btn primary" onClick={ this.selectLineup.bind(this) }>
                                    <img src={ whatImage } className="img" aria-hidden="true" />
                                    <div className="lineupText">
                                        <h3>WHAT THE FESTIVAL</h3>
                                        <p>UNITED STATES</p>
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
            var loadingText = <p className="loadingText">LOADING YOUR LINEUP...</p>
        } else {
            var artistsDisplay = []
            var artists = this.state.artists;
            if (artists && artists.length > 0) {
                var trimmedArtists = artists.filter(function() { return true; });
                var artistsCount = trimmedArtists.filter(function(e){return e}).length;
                if (artistsCount >= 12) {
                    var longer = "longer";
                }
                var className = longer;
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
                if (this.state.showImage) {
                    var tableClass = "smallTable";
                    var link = (<a onClick={ this.hideImage }>HIDE IMAGE</a>)
                    var visible = "show";
                } else {
                    var link = (<a onClick={ this.viewImage }>VIEW IMAGE</a>)
                }
                var lineupImage = (<img className={ "viewImage " + visible } src={ this.state.image } ref={ this.myRef } />)
                if (this.state.saveArtist) {
                    var notificationText = (
                        <p>You just edited an artist. Nice work 👍!</p>
                    )
                    var notificationClass = "save";
                } else if (this.state.deleteArtist) {
                    var notificationText = (
                        <p>You just deleted an artist 👍!</p>
                    )
                    var notificationClass = "delete";
                }
                if (this.state.saveArtist || this.state.deleteArtist) {
                    var notificationContainer = (
                        <div className={ "notificationContainer " + notificationClass }>
                            { notificationText }
                        </div>
                    )
                }
                var results = (
                    <div className="resultsContainer">
                        <p className="header">
                            YOUR LINEUP
                            { link }
                        </p>
                        <div className={ "our-table " + tableClass}>
                            { artistsDisplay }
                        </div> 
                        { lineupImage }
                        { notificationContainer }
                    </div>
                )
            } else {
                if (artists) {
                    var header = (
                        <p className="header">YOUR LINEUP{ link }</p>
                    )
                    var emptyState = (
                        <p className="emptyText">Oh, where have all the artists gone 😱?</p>
                    )
                    var results = (
                        <div className="resultsContainer">
                            { header }
                            <div className={ "our-table " + tableClass}>
                                { emptyState }
                            </div>
                        </div>
                    )
                }
            }
        }
        return (
            <div className={ "locateArtistsContainer  resultsBackground " + className }>
                { loadingText }
                { startContainer }
                { results }
            </div>
        );
    }
}