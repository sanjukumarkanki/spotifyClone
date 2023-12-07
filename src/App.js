import {Component} from 'react'
import {Route, Switch} from 'react-router-dom'

import Home from './components/Home'
import LoginForm from './components/LoginForm'
import Categories from './components/Categories'
import ProtectedRoute from './components/ProtectedRoute'

import SpotifyContext from './SpotifyContext'

import './App.css'
import SpecificPlaylist from './components/SpecificPlaylist'
import EachSongTrack from './components/EachSongTrack'
import Navbar from './components/Navbar'
import CustomAudioPlayer from './components/CustomAudioPlayer'
import Albums from './components/Albums'
import YourMusic from './components/YourMusic'
import YourPlaylist from './components/YourPlaylist'
import YourPlaylistTracks from './components/YourPlaylistTracks'
import SearchComponent from './components/SearchComponent'

class App extends Component {
  state = {
    audioTrack: '',
  }

  audioTrakSong = audioUrl => {
    this.setState({audioTrack: audioUrl})
  }

  render() {
    const {audioTrack} = this.state
    return (
      <SpotifyContext.Provider
        value={{
          audioTrack,
          audioTrakSong: this.audioTrakSong,
        }}
      >
        <Switch>
          <Route exact path="/login" component={LoginForm} />
          <div className="">
            <div className="home-bg-container">
              <Navbar />
              <div className="home-right-side-container">
                <ProtectedRoute exact path="/" component={Home} />
                <ProtectedRoute
                  exact
                  path="/playlist/:id"
                  component={SpecificPlaylist}
                />
                <ProtectedRoute
                  exact
                  path="/songTrack/:id"
                  component={EachSongTrack}
                />
                <ProtectedRoute
                  exact
                  path="/genres/:id"
                  component={Categories}
                />
                <ProtectedRoute exact path="/albums/:id" component={Albums} />
                <ProtectedRoute exact path="/yourmusic" component={YourMusic} />
                <ProtectedRoute
                  exact
                  path="/yourplaylists"
                  component={YourPlaylist}
                />
                <ProtectedRoute
                  exact
                  path="/yourplaylisttracks/:id/:snapshotTrack"
                  component={YourPlaylistTracks}
                />
                <ProtectedRoute
                  exact
                  path="/searchforSongs"
                  component={SearchComponent}
                />
              </div>
            </div>
            <div className="container-fluid">
              <div className="row">
                <div className="col-12 p-0">
                  <CustomAudioPlayer audioTrack={audioTrack} />
                </div>
              </div>
            </div>
          </div>
        </Switch>
      </SpotifyContext.Provider>
    )
  }
}

export default App
