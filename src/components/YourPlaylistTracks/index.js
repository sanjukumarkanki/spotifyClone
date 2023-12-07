import {Component} from 'react'
import {Link} from 'react-router-dom'

import Avatar from '@mui/material/Avatar'
import {AiOutlineArrowUp} from 'react-icons/ai'

import {IoIosArrowBack} from 'react-icons/io'
import Paper from '@mui/material/Paper'

import Cookies from 'js-cookie'
import SpotifyContext from '../../SpotifyContext'

import './index.css'

const getPlaylistRouteObject = {
  loading: 'LOADING',
  success: 'SUUCESS',
  failure: 'FAILURE',
}

class YourPlaylistTracks extends Component {
  state = {getPlaylistRouteList: [], isLoading: getPlaylistRouteObject.loading}

  componentDidMount() {
    this.onEachSongCard()
  }

  onEachSongCard = async () => {
    const token = Cookies.get('pa_token')
    const getHistory = this.props
    const {match} = getHistory
    const {params} = match
    const {id} = params
    const fetchurl = `https://api.spotify.com/v1/playlists/${id}/tracks`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    // Get Playlist Tracks
    const getSpecificPlaylist = await fetch(fetchurl, options)
    const getData = await getSpecificPlaylist.json()
    if (getSpecificPlaylist.ok === true) {
      this.setState({
        getPlaylistRouteList: getData,
        isLoading: getPlaylistRouteObject.success,
      })
    } else {
      this.setState({isLoading: getPlaylistRouteObject.failure})
    }
  }

  onDeleteTrack = async trackUri => {
    const token = Cookies.get('pa_token')
    // Geting the Playlist using the route url
    const {match} = this.props
    const {params} = match
    const {id, snapshotTrack} = params
    const sendBody = {
      tracks: [{uri: trackUri}],
      snapshot_id: snapshotTrack,
    }

    // Remove Items from Playlist Api
    const url = `https://api.spotify.com/v1/playlists/${id}/tracks`
    const options = {
      method: 'DELETE',
      headers: {Authorization: `Bearer ${token}`},
      body: JSON.stringify(sendBody),
    }
    const fethcingApi = await fetch(url, options)
    // if the response is true the song gets delted from the playlist
    if (fethcingApi.ok === true) {
      this.onEachSongCard()
      alert('song Delted Successfully')
    }
  }

  render() {
    return (
      <SpotifyContext.Consumer>
        {value => {
          const {audioTrack, audioTrakSong} = value
          const {getPlaylistRouteList, isLoading} = this.state

          const goToHome = () => {
            const {history} = this.props
            const {goBack} = history
            console.log(goBack)
            goBack(-1)
          }

          const playThisSong = audioUrl => {
            audioTrakSong(audioUrl)
          }

          const renderloading = () => (
            <div
              className="d-flex flex-col justify-content-center align-items-center"
              style={{height: '70vh'}}
            >
              <div className="loader" />
            </div>
          )

          const getRenderSucesss = () => (
            <>
              {getPlaylistRouteList.items.length > 0 ? (
                <div>
                  <div className="floating-container">
                    <a href="#section" title="Go To Top">
                      <button type="button" className="floating-button">
                        <AiOutlineArrowUp />
                      </button>
                    </a>
                  </div>
                  <div className="row m-2">
                    <div className="col-12 ul-container">
                      {getPlaylistRouteList.items.map(eachSong => (
                        <Link
                          key={eachSong.track.id}
                          className="d-flex  justify-content-center "
                          to={`/songTrack/${eachSong.track.id}`}
                          style={{width: '96%'}}
                        >
                          <Paper
                            key={eachSong.track.id}
                            style={{backgroundColor: '#000'}}
                            className={`d-flex flex-column border rounded flex-sm-row ${
                              audioTrack === eachSong.track.preview_url
                                ? ' EachsongPlaylistCard2 bg-success'
                                : 'EachsongPlaylistCard'
                            }`}
                          >
                            <div className="d-flex flex-grow-1">
                              <Avatar
                                src={eachSong.track.album.images[0].url}
                                alt=""
                                className="mr-2 ml-4"
                              />
                              <div className="songDetails">
                                <h6>{eachSong.track.name}</h6>
                                <p>{eachSong.track.album.artists[0].name}</p>
                              </div>
                            </div>
                            <div className="d-flex flex-row align-items-center">
                              <button
                                type="button"
                                className="addto-playlist-button"
                                onClick={() =>
                                  this.onDeleteTrack(eachSong.track.uri)
                                }
                              >
                                <i className="fa-sharp fa-solid fa-trash " />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  playThisSong(eachSong.track.preview_url)
                                }
                                className="addto-playlist-button"
                                style={{marginLeft: '20px'}}
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
                            {/* Specific Playlist Each Song Card Audio And Duration Container */}
                          </Paper>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="d-flex flex-column justif-content-center align-items-center">
                  <div className="empty-playlists-container">
                    <img
                      src="https://img.freepik.com/free-vector/more-music-concept-illustration_114360-1066.jpg?w=826&t=st=1690803836~exp=1690804436~hmac=9c0d054228652d29ea66b3c14e0641bce921cfd8ad6618b08647623e5862dc31"
                      alt="emptylist"
                    />
                    <h2>Empty Playlist</h2>
                    <p>
                      This playlist have no tracks, try to add new tracks into
                      this playlist
                    </p>
                  </div>
                </div>
              )}
            </>
          )

          const renderFailure = () => (
            <div className="bg-dark container h-100 d-flex flex-col justify-content-center align-items-center">
              <div className="row">
                <div className="col-12 d-flex flex-col justify-content-center align-items-center">
                  <img
                    src="https://img.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_114360-1932.jpg?size=626&ext=jpg&uid=R108801390&ga=GA1.1.274854546.1665241057&semt=ais"
                    alt="error"
                    width="50%"
                  />
                </div>
              </div>
            </div>
          )

          const ConditonalRendering = () => {
            switch (isLoading) {
              case getPlaylistRouteObject.loading:
                return renderloading()
              case getPlaylistRouteObject.success:
                return getRenderSucesss()
              case getPlaylistRouteObject.failure:
                return renderFailure()
              default:
                return null
            }
          }

          return (
            <div className="container-fluid">
              <div className="d-flex align-items-start mb-3" id="section">
                <IoIosArrowBack
                  className="m-2 text-white"
                  onClick={() => goToHome()}
                  style={{cursor: 'pointer'}}
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
              {ConditonalRendering()}
            </div>
          )
        }}
      </SpotifyContext.Consumer>
    )
  }
}

export default YourPlaylistTracks
