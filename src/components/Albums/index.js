import {Component} from 'react'
import {Link} from 'react-router-dom'

import Cookies from 'js-cookie'
import './index.css'

import {AiOutlineArrowUp} from 'react-icons/ai'
import {IoIosArrowBack} from 'react-icons/io'
import Paper from '@mui/material/Paper'

import SpotifyContext from '../../SpotifyContext'

class Albums extends Component {
  state = {getPlaylistRouteList: [], isLoading: true}

  componentDidMount() {
    this.getAlbums()
  }

  getAlbums = async () => {
    const token = Cookies.get('pa_token')
    const getHistory = this.props
    const {match} = getHistory
    const {params} = match
    const {id} = params

    const fetchurl = `https://api.spotify.com/v1/albums/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const getSpecificPlaylist = await fetch(fetchurl, options)
    const getData = await getSpecificPlaylist.json()
    if (getSpecificPlaylist.ok === true) {
      this.setState({getPlaylistRouteList: getData, isLoading: false})
    }
  }

  render() {
    return (
      <SpotifyContext.Consumer>
        {value => {
          const {audioTrack, audioTrakSong} = value

          const {getPlaylistRouteList, isLoading} = this.state

          const songDuration = milliseconds => {
            let finalTimerString = ''
            let secondsString = ''
            const minutes = Math.floor(
              (milliseconds % (1000 * 60 * 60)) / (1000 * 60),
            )
            const seconds = Math.floor(
              ((milliseconds % (1000 * 60 * 60)) % (1000 * 60)) / 1000,
            )
            // Add hours if there
            // Pre appending 0 to seconds if it is one digit
            if (seconds <= 9) {
              secondsString = `0${seconds}`
            } else {
              secondsString = seconds
            }

            finalTimerString = `${finalTimerString} ${minutes}:${secondsString}`
            return (
              <p className="text-white fw-bold justify-content-end">
                {finalTimerString}
              </p>
            )
          }
          const randomNumber = Math.floor(Math.random() * 5)

          const goToHome = () => {
            const {history} = this.props
            const {goBack} = history
            console.log(goBack)
            goBack(-1)
          }

          const playThisSong = audioUrl => {
            audioTrakSong(audioUrl)
          }

          return (
            <div>
              {isLoading ? null : (
                <div className="container p-4 ">
                  <div className="d-flex align-items-start m-3" id="section">
                    <IoIosArrowBack
                      className="m-2 text-white"
                      style={{cursor: 'pointer'}}
                      onClick={() => goToHome()}
                      id="goBack"
                    />
                    <label
                      htmlFor="goBack"
                      className="text-white fw-bold mt-1 "
                      style={{cursor: 'pointer'}}
                      onClick={() => goToHome()}
                    >
                      Back
                    </label>
                  </div>
                  <div className={`row bg${randomNumber} `}>
                    {/* Specific Playlist Song Thumbnail Container */}
                    <div className="col-12 col-sm-4 card-bg">
                      <img src={getPlaylistRouteList.images[0].url} alt="" />
                    </div>
                    {/* Specific Playlist Song Thumbnail Descroption Container */}
                    <div className="col-12 mt-4 col-sm-8 d-flex flex-column justify-content-start align-items-start">
                      <p className="playlist-heading">Editors Picks</p>
                      <h2 className="playist-categopry-name fw-bold">
                        {getPlaylistRouteList.name}
                      </h2>
                      <p className="text-white">
                        {getPlaylistRouteList.description}
                      </p>
                    </div>
                  </div>
                  <div className="floating-container">
                    <a href="#section" title="Go To Top">
                      <button type="button" className="floating-button">
                        <AiOutlineArrowUp />
                      </button>
                    </a>
                  </div>
                  <div className="row mt-2">
                    <div className="col-12  p-0 ul-container">
                      {getPlaylistRouteList.tracks.items.map(eachSong => (
                        <Link
                          to={`/songTrack/${eachSong.id}`}
                          className="d-flex flex-column flex-sm-row"
                          style={{width: '98%'}}
                        >
                          <Paper
                            key={eachSong.id}
                            sx={{backgroundColor: 'black'}}
                            className={`d-flex flex-column flex-sm-row border rounded ${
                              audioTrack === eachSong.preview_url
                                ? 'bg-success EachsongPlaylistCard2'
                                : 'EachsongPlaylistCard'
                            }`}
                          >
                            <div className="d-flex flex-grow-1">
                              <div className="songDetails">
                                <h6>{eachSong.name}</h6>
                              </div>
                            </div>
                            {/* Specific Playlist Each Song Card Audio And Duration Container */}
                            <div className="EachsongPlaylistCar-audio-duration-container">
                              {songDuration(eachSong.duration_ms)}
                              <button
                                type="button"
                                onClick={() =>
                                  playThisSong(eachSong.track.preview_url)
                                }
                                className="addto-playlist-button"
                              >
                                <i
                                  className="fa-solid fa-play"
                                  style={{
                                    height: '20px',
                                    width: '20px',
                                  }}
                                />
                              </button>
                            </div>
                          </Paper>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        }}
      </SpotifyContext.Consumer>
    )
  }
}

export default Albums
