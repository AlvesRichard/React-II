import React from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Albums from '../components/Albums';
import SingleAlbum from '../components/SingleAlbum';
import audio from '../audio';
import {Switch, Route, Redirect} from 'react-router-dom';
import Artists from "../components/Artists"
import SingleArtist from "../components/Artist";



export default class Main extends React.Component {
  constructor(){
    super();
    this.state = {
      albums: [],
      selectedAlbum: {},
      selectedSong: {},
      isPlaying: false,
      currentSongList: [],
      progress: 0,
      artists: [],
      selectedArtist : [],
    };
    this.selectAlbum = this.selectAlbum.bind(this);
    this.start = this.start.bind(this);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.selectArtist = this.selectArtist.bind(this);
  }
  
  componentDidMount() {
    axios.get('/api/albums')
      .then(res => res.data)
      .then(serverAlbums => this.setState({ albums: serverAlbums }));
    audio.addEventListener('ended', () => {
      this.next();
    });
    audio.addEventListener('timeupdate', () => {
      this.setState({
        progress: 100 * audio.currentTime / audio.duration
      });
    });
    axios.get("/api/artists")
    .then(res => res.data)
    .then(serverArtists => this.setState({ artists: serverArtists }));
  }
  
  selectAlbum(albumId) {
    let arr=[]
    axios.get(`/api/albums/${albumId}`)
      .then(res => res.data)
      .then(serverAlbum => this.setState({ selectedAlbum: serverAlbum }));
  }

  selectArtist(artistId) {
    let artist = axios.get(`/api/artists/${artistId}`)
    let artistAlbum = axios.get(`/api/artists/${artistId}/albums`)
    let artistSongs = axios.get(`/api/artists/${artistId}/songs`)
      Promise.all([artist,artistAlbum,artistSongs])
      .then(serverArtist => this.setState({ selectedArtist: serverArtist }));
  }

  start(song, songs) {
    this.setState({ selectedSong: song, currentSongList: songs })
    this.loadSong(song.audioUrl);
  }

  loadSong(audioUrl) {
    audio.src = audioUrl;
    audio.load();
    this.play();
  }

  play() {
    audio.play();
    this.setState({ isPlaying: true })
  }

  pause() {
    audio.pause();
    this.setState({ isPlaying: false })
  }
  
  findSongIndex() {
    return this.state.currentSongList.findIndex(song => song.id === this.state.selectedSong.id);
  }

  next() {
    let index = this.findSongIndex() + 1;
    if (index >= this.state.currentSongList.length) {
      index = 0 
    }
    const song = this.state.currentSongList[index];
    this.setState({ selectedSong: song })
    this.loadSong(song.audioUrl)
  }

  previous() {
    let index = this.findSongIndex() - 1;
    if (index < 0) {
      index = this.state.currentSongList.length - 1 
    }
    const song = this.state.currentSongLists[index];
    this.setState({ selectedSong: song })
    this.loadSong(song.audioUrl)
  }

  render() {
    const  { albums, selectedAlbum, selectedSong, isPlaying, progress, artists, selectedArtist } = this.state;
    return (
      <div id="main" className="container-fluid">
        <Sidebar/>
        <div className="col-xs-10">
          <Switch>
            <Route exact path="/albums" render={()=><Albums albums={albums} selectAlbum={this.selectAlbum} />} />
            <Route exact path="/albums/:id" render={({match})=> <SingleAlbum selectedSong={selectedSong} start={this.start} album={selectedAlbum} albumId={match.params.id} selectAlbum={this.selectAlbum}/>} />
            <Route exact path="/artists" render={()=> <Artists artists={artists}/>}/>
            <Route path="/artists/:id" render={({match}) => <SingleArtist artist={selectedArtist} artistId={match.params.id} selectArtist={this.selectArtist}/>} />
            <Redirect from="/" to="/albums" />
          </Switch>
          
        </div>
        <Footer 
          selectedSong={selectedSong}
          isPlaying={isPlaying} 
          play={this.play} 
          pause={this.pause}
          next={this.next}
          previous={this.previous}
          progress={progress}
        />
      </div>
    );
  }
};