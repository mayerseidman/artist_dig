const _ = require('underscore')
import React, { Component } from 'react';

import ArtistContainer from './ArtistContainer';
import elementsImage from './images/lineups/elements.png';
import dayZeroImage from './images/lineups/day-zero.png';
import whatImage from './images/lineups/what.png';
import checkImage from './images/icons/check.png';

import lineupThree from './LineupThree.json';
const lineups = { "one": lineupThree, "two": lineupThree, "three": lineupThree };

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

    selectLineup = (event) =>  {
        const lineup = event.target.closest("button").getAttribute("lineup");
        this.setState({ loading: true })
        setTimeout(() => {
            this.setState({ artists: lineups[lineup], loading: false })
        }, 500) 
    }

    fetchResults = (formData) => {
        fetch("/api/uploadFile", {
            method: 'POST',
            body: formData
        }).then(response => {
            if (response.status == 200) {
                return response.json()
            } else {
                this.setState({ loading: false, uploadError: true });
            }
        }).then((value) => {
            console.log(value)
            this.setState({ artists: value, loading: false });
            return value;
        })
    }

    submitPhoto = (e) => {
        const file = this.inputElement.files[0];
        this.setState({ loading: true, image: URL.createObjectURL(file) });
        const formData = new FormData();
        formData.append('myImage', file);
        formData.append('fileType', "PNG")
        this.fetchResults(formData);
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
        var sortedArtists = _.sortBy(artists, function (name) { return name })
        this.setState({ artists: sortedArtists })
        setTimeout(() => {
            this.setState({ saveArtist: false })
        }, 3000);
    }

    handleClick = (e) => {
      this.inputElement.click();
    }

    viewImage = () => {
        this.setState({ showImage: true })
        console.log(this.myRef.current)
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.myRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
            })
        })
    }

    hideImage = () => {
        this.setState({ showImage: false })
    }

    renderLeftContent = () => {
        var header = <h1 className="header">Discover new artists by uploading an image!</h1>
        var text =  <p className="tagline">Turn an event or festival lineup into new music by uploading the lineup image.</p>
        var button =  <button className="uploadBTN" onClick={ this.handleClick }>UPLOAD LINEUP</button>
        var inputField = (
            <input id="dot" type="file" name="myImage" accept="image/*" 
                ref={input => this.inputElement = input}
                onChange= {this.submitPhoto.bind(this) }
                style={{ "display" : "none" }}/>
        )
        if (this.state.uploadError) {
            var errorStatus = "error";
        }
        var requirementsText = <p className={ "requirementsText " + errorStatus }>Images must be smaller than 1MB.</p>
        return (
            <div className="content" id="textContainer">
                { header }
                { text }
                { button }
                { inputField }
                { requirementsText }              
            </div>
        )
    }
    renderRightContent = () => {
        return (
            <div className="content" id="buttonsContainer">
                <p className="guideText">Select a lineup to see  how it works</p>
                <button className="btn primary" lineup="one" onClick={ this.selectLineup.bind(this) }>
                    <img src={ elementsImage } className="img" aria-hidden="true" />
                    <div className="lineupText">
                        <h3>ELEMENTS FESTIVAL</h3>
                        <p>UNITED STATES</p>
                    </div>
                </button>
                <button className="btn primary" lineup="two" onClick={ this.selectLineup.bind(this) }>
                    <img src={ dayZeroImage } className="img" aria-hidden="true" />
                    <div className="lineupText">
                        <h3>DAY ZERO</h3>
                        <p>MEXICO</p>
                    </div>
                </button>
                <button className="btn primary" lineup="three" onClick={ this.selectLineup.bind(this) }>
                    <img src={ whatImage } className="img" aria-hidden="true" />
                    <div className="lineupText">
                        <h3>WHAT THE FESTIVAL</h3>
                        <p>UNITED STATES</p>
                    </div>
                </button>
            </div>
        )
    }
    renderContent = () => {
        var leftContent = this.renderLeftContent();
        var rightContent = this.renderRightContent();
        return (
            <div className="viewContainer">
                <div id="container">
                    <div className="viewRenderer">
                        { leftContent }
                        <div className="vl"></div>
                        { rightContent }
                    </div>
                </div>
            </div>
        )
    }
    renderArtists = () => {
        var artistsDisplay = []
        var artists = this.state.artists;
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
        return artistsDisplay;
    }
    renderNotification = () => {
        if (this.state.saveArtist) {
            var texts = ["You edited an artist. That is legit.", "You edited an artist. Feels good right?", "You edited an artist. Change is good."];
            var notificationStatus = (
                <p className="status">Artist Edited 👍!</p>
            )
            var notificationText = (
                <p className="text">{ _.sample(texts) }</p>
            )
            var notificationClass = "save";
        } else if (this.state.deleteArtist) {
            var texts = ["You deleted an artist. Nice job.", "You deleted an artist. Exhale.", "You deleted an artist. Goodbyes can be hard.", "You deleted an artist. Au revoir."];
            var notificationStatus = (
                <p className="status">Artist Deleted 👋!</p>
            )
            var notificationText = (
                <p className="text">{ _.sample(texts) }</p>
            )
            var notificationClass = "delete";
        }
        if (this.state.saveArtist || this.state.deleteArtist) {
            var notificationContainer = (
                <div className={ "notificationContainer " + notificationClass }>
                    <span className="line"></span>
                    <img className="check" src={ checkImage } />
                    <div className="notificationText">
                        { notificationStatus }
                        { notificationText }
                    </div>
                </div>
            )
        }
        return notificationContainer;
    }
    renderLineup = () => {
        if (this.state.showImage) {
            var link = <a onClick={ this.hideImage }>HIDE IMAGE</a>
            var visible = "show";
            var tableClass = "smallTable";
        } else {
            var link = <a onClick={ this.viewImage }>VIEW IMAGE</a>
        }
        var lineupImage = <img className={ "viewImage " + visible } src={ this.state.image } ref={ this.myRef } />
        var header = <p className="header">YOUR LINEUP{ link }</p>
        var table = (
            <div className={ "ourTable " + tableClass }>
                { this.renderArtists() }
            </div> 
        )
        var notification = this.renderNotification();
        var results = (
            <table>
            <thead>
            <tr>
            <th>Your Lineup</th>
            <th></th>
            <th></th>
            <th></th>
            <th>View Image</th>
            </tr>
            </thead>
            <tbody>
            {
                this.state.artists.map(function(artist) {
          return artist &&
        
                    ( <tr>
                    <td>
                    {artist}
                   
                    </td>
                    <td>S</td>
                    <td>S</td>
                    <td>Y</td>
                    <td>Edit | Delete</td>
                    </tr>)

            }.bind(this))

        }
            </tbody>
                
            </table>
        )
        return results;
    }
    renderEmptyState = () => {
        var header = (
            <p className="header">YOUR LINEUP</p>
        )
        var emptyState = (
            <p className="emptyText">Oh, where have all the artists gone 😱?</p>
        )
        var content = (
            <div className="ourTable ">
                { emptyState }
            </div>
        )
        var results = (
            <div className="resultsContainer">
                { header }
                { content }
            </div>
        )
        return results;
    }
    render() {
        if (!this.state.artists && !this.state.loading) {
            var content = this.renderContent();
        }
        if (this.state.loading) {
            var className = "loadingBackground";
            var loadingText = <p className="loadingText">LOADING YOUR LINEUP...</p>
        } else {
            var artists = this.state.artists;
            if (artists && artists.length > 0) {
                var trimmedArtists = artists.filter(function() { return true; });
                var artistsCount = trimmedArtists.filter(function(e){return e}).length;
                if (artistsCount >= 12) {
                    var longer = "longer";
                }
                var className = longer;
                var results = this.renderLineup()
            } else {
                // RENDER EMPTY STATE
                if (artists) {
                   var results = this.renderEmptyState();
                }
            }
        }
        return (
            <div className={ "locateArtistsContainer  resultsBackground " + className }>
                { loadingText }
                { content }
                { results }
            </div>
        );
    }
}