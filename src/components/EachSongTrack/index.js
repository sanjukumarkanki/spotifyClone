import {Component} from 'react'
import {Link} from 'react-router-dom'
import {IoIosArrowBack} from 'react-icons/io'
import {
  BsFillPlayFill,
  BsThreeDotsVertical,
  BsSuitHeartFill,
} from 'react-icons/bs'
import Paper from '@mui/material/Paper'
import Avatar from '@mui/material/Avatar'

import SpotifyContext from '../../SpotifyContext'

import {
  accessToken,
  getUserLikedSongs,
  getUserPlaylists,
} from '../../userDetailsGet'

import './index.css'

const getSongTrackDetails = {
  loading: 'LOADING',
  success: 'SUUCESS',
  failure: 'FAILURE',
}

class EachSongTrack extends Component {
  state = {
    getSongDetails: [],
    isLoading: getSongTrackDetails.loading,
    getRecomondations: [],
    myFavSongs: [],
    isRecomndationsSuccess: false,
    allUserPlaylistList: [],
  }

  componentDidMount() {
    this.getTrackDetails()
    this.getRecomondationsApi()
    this.getAllFavTracks()
    this.userPlaylists()
  }

  userPlaylists = async () => {
    const alluserPlayDetails = await getUserPlaylists()
    if (alluserPlayDetails !== false || alluserPlayDetails !== 'false') {
      this.setState({allUserPlaylistList: [alluserPlayDetails]})
    }
  }

  getTrackDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://api.spotify.com/v1/tracks/${id}`
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${accessToken}`},
    }
    const fetchData = await fetch(url, options)
    if (fetchData.ok === true) {
      const getData = await fetchData.json()
      this.setState({
        getSongDetails: getData,
        isLoading: getSongTrackDetails.success,
      })
    } else {
      this.setState({isLoading: getSongTrackDetails.failure})
    }
  }

  getRecomondationsApi = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://api.spotify.com/v1/recommendations?seed_tracks=${id}`
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${accessToken}`},
    }
    const fetchingUrl = await fetch(url, options)
    const getResponse = await fetchingUrl.json()
    if (fetchingUrl.ok === true) {
      this.setState({
        getRecomondations: [getResponse],
        isRecomndationsSuccess: true,
      })
    }
  }

  getAllFavTracks = async () => {
    const getAllLikedSong = await getUserLikedSongs()
    if (getAllLikedSong !== false || getAllLikedSong !== 'false') {
      this.setState({myFavSongs: [getAllLikedSong]})
    } else {
      alert('Something Went Wrong While Fetching The Data')
    }
  }

  addToFavourites = async id => {
    const {myFavSongs} = this.state
    const sendASBody = {ids: [id]}
    const allLikedSongIDs = myFavSongs[0].items.map(
      eachSong => eachSong.track.id,
    )

    const url = `https://api.spotify.com/v1/me/tracks`
    if (allLikedSongIDs.includes(id)) {
      const options = {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(sendASBody),
      }
      const fetchingData = await fetch(url, options)
    } else {
      const options = {
        method: 'PUT',
        headers: {Authorization: `Bearer ${accessToken}`},
        body: JSON.stringify(sendASBody),
      }
      const fetchingData = await fetch(url, options)
    }
    this.getAllFavTracks()
  }

  addToPlaylist = async playlistId => {
    const getPlaylistTrackurl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`
    const Options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
    // Get all Playlist songs
    const getSpecificPlaylistTracks = await fetch(getPlaylistTrackurl, Options)
    // inserting all song id into get all names variables
    let getAllNames = []
    if (getSpecificPlaylistTracks.ok === true) {
      const getData = await getSpecificPlaylistTracks.json()
      if (getData.items.length > 0) {
        getAllNames = getData.items.map(eachSong => eachSong.track.id)
      }
    }
    // if the below condition gets true the song will add to the playlist otherwise  It show this song, already exits.
    const {getSongDetails} = this.state
    if (getAllNames.includes(getSongDetails.id) !== true) {
      // Add Song to Playlist
      const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`
      const sendAsBody = {uris: [getSongDetails.uri], position: 0}
      const options = {
        method: 'POST',
        headers: {Authorization: `Bearer ${accessToken}`},
        body: JSON.stringify(sendAsBody),
      }
      const fetchApi = await fetch(url, options)
      if (fetchApi.ok === true) {
        alert('Song Successfully added to your playlist')
      }
    } else {
      alert('The Song already Added to Your Playlist')
    }
  }

  render() {
    return (
      <SpotifyContext.Consumer>
        {value => {
          const {audioTrack, audioTrakSong} = value
          const {
            isLoading,
            getSongDetails,
            getRecomondations,
            isRecomndationsSuccess,
            myFavSongs,
            allUserPlaylistList,
          } = this.state

          const playThisSong = audioUrl => {
            audioTrakSong(audioUrl)
          }

          const goToHome = () => {
            const {history} = this.props
            const {goBack} = history
            goBack(-1)
          }

          const renderLoading = () => (
            <div
              className="d-flex flex-col justify-content-center align-items-center"
              style={{height: '70vh'}}
            >
              <div className="loader" />
            </div>
          )

          const songDuration = milliseconds => {
            let finalTimerString = ''
            let secondsString = ''
            const minutes = Math.floor(
              (parseInt(milliseconds) % (1000 * 60 * 60)) / (1000 * 60),
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
              <p className="text-white fw-bold ">
                Song Duration : {finalTimerString}
              </p>
            )
          }

          const renderSuccess = () => {
            let AllmyFavTracksIds
            if (myFavSongs.length > 0) {
              AllmyFavTracksIds = myFavSongs[0].items.map(each => each.track.id)
            } else {
              AllmyFavTracksIds = []
            }
            return (
              <>
                {/* Song Tack Top SEction Starts From Here */}
                <div className="col-12 p-3 d-flex flex-column flex-sm-row align-items-center align-items-sm-start">
                  <img
                    src={getSongDetails.album.images[1].url}
                    alt={getSongDetails.album.name}
                    width="40%"
                  />
                  <div className="song-description">
                    <p className="song-text">Song</p>
                    <h3 className="song-name">{getSongDetails.album.name}</h3>
                    <p className="song-text">
                      {getSongDetails.album.artists[0].name}
                    </p>
                    <div className="col-12 d-flex align-items-center ">
                      {/* Like Button */}
                      <button
                        type="button"
                        className={
                          AllmyFavTracksIds.includes(getSongDetails.id)
                            ? 'heart-button-like'
                            : 'heart-button-unliked'
                        }
                        onClick={() => this.addToFavourites(getSongDetails.id)}
                      >
                        <BsSuitHeartFill className="icon-size" />
                      </button>
                      {/* Info Button Drop Button */}
                      <div className="dropdown">
                        <button
                          className="btn btn-success dropdown-toggle"
                          type="button"
                          style={{marginLeft: '10px', marginRight: '10px'}}
                          id="dropdownMenuButton"
                          data-mdb-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <BsThreeDotsVertical
                            style={{height: '30px', width: '30px'}}
                          />
                        </button>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby="dropdownMenuButton"
                        >
                          <Link
                            to="/yourplaylists"
                            className="text-decoration-none"
                          >
                            <li key="createPlaylist">
                              <p className="dropdown-item">
                                Create New Playlist
                              </p>
                            </li>
                          </Link>
                          <li key="addtoplaylist">
                            <p className="dropdown-item">
                              Add to Playlist &raquo;
                            </p>
                            <ul className="dropdown-menu dropdown-submenu">
                              {allUserPlaylistList.length > 0 &&
                                allUserPlaylistList[0].items.map(
                                  eachPlaylist => (
                                    <li
                                      key={eachPlaylist.id}
                                      onClick={() =>
                                        this.addToPlaylist(eachPlaylist.id)
                                      }
                                    >
                                      <p className="dropdown-item">
                                        {eachPlaylist.name}
                                      </p>
                                    </li>
                                  ),
                                )}
                            </ul>
                          </li>
                        </ul>
                      </div>
                      {/* Play This Song Button */}
                      <button
                        type="button"
                        className="play-button"
                        onClick={() => playThisSong(getSongDetails.preview_url)}
                      >
                        <BsFillPlayFill className="play-button-icon" />
                      </button>
                    </div>
                  </div>
                </div>
                {/* Song Tack Hit Like And Add To Fav Section Starts From Here */}

                {/* Song Tack Hit Duration And Artists Starts From Here */}
                <div className="col-12">
                  {songDuration(getSongDetails.duration_ms)}
                  <p className="song-track-details-description ">
                    Alumb type :{' '}
                    <span className="song-track-details-description ">
                      {getSongDetails.album.album_type}
                    </span>
                  </p>
                  <p className="song-track-details-description">Artists</p>
                  <ul className="">
                    {getSongDetails.artists.map(eachArtist => (
                      <li key={eachArtist.id} className="text-white">
                        {eachArtist.name}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Song RecomonDations Section */}
                <div className="col-12">
                  <h3 className="recomondation-text">Recomondations</h3>
                  {getRecomondations.length > 0 && isRecomndationsSuccess ? (
                    <ul className="cl-12 ul-container p-4">
                      {getRecomondations.length > 0 &&
                        getRecomondations[0].tracks.map(eachSong => (
                          <Paper
                            key={eachSong.id}
                            sx={{backgroundColor: 'black'}}
                            className={`d-flex flex-column border rounded-4 flex-sm-row ${
                              audioTrack === eachSong.preview_url
                                ? ' bg-success EachsongPlaylistCard2'
                                : 'EachsongPlaylistCard'
                            }`}
                            onClick={() => playThisSong(eachSong.preview_url)}
                            style={{width: '100%'}}
                          >
                            {/* Song RecomonDations Card Section Stats Here */}
                            <div className="d-flex flex-grow-1">
                              <Avatar
                                src={
                                  eachSong.album.images.length > 0
                                    ? eachSong.album.images[0].url
                                    : ''
                                }
                                alt=""
                                className="mr-2 ml-4"
                              />
                              <div className="songDetails">
                                <h6>{eachSong.name}</h6>
                                <p>{eachSong.album.artists[0].name}</p>
                              </div>
                            </div>
                            {/* Song RecomonDations Card Section  Play Song ButtonStats Here */}
                            <button
                              type="button"
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
                          </Paper>
                        ))}
                    </ul>
                  ) : (
                    <div className="col-12 d-flex flex-column justif-content-center align-items-center">
                      {/* Get Recommondation Failure Section */}
                      <div className="empty-playlists-container">
                        <img
                          src="https://img.freepik.com/free-vector/page-found-with-people-connecting-plug-concept-illustration_114360-1927.jpg?w=826&t=st=1691043790~exp=1691044390~hmac=421598b07c60a14a112ccd39d524f1227b2b880817d7b8e605e3500ce83ff115"
                          alt="network error"
                        />
                        <h2>Network Error</h2>
                        <p>Please, Check Your Network Connection</p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )
          }

          const conditonalRendering = () => {
            switch (isLoading) {
              case getSongTrackDetails.loading:
                return renderLoading()
              case getSongTrackDetails.success:
                return renderSuccess()
              default:
                return null
            }
          }

          return (
            <div className="container-fluid">
              <div className="row p-2">
                <div className="d-flex align-items-start mb-3" id="section">
                  <IoIosArrowBack
                    className="m-2 text-white"
                    onClick={() => goToHome()}
                    style={{cursor: 'pointer'}}
                    id="goBack"
                  />
                  <label
                    htmlFor="goBack"
                    className="text-white fw-bold mt-1"
                    style={{cursor: 'pointer'}}
                    onClick={() => goToHome()}
                  >
                    Back
                  </label>
                </div>
                {conditonalRendering()}
              </div>
            </div>
          )
        }}
      </SpotifyContext.Consumer>
    )
  }
}

export default EachSongTrack

//                             <button
//   className="btn btn-success dropdown-toggle"
//   type="button"
//   style={{marginLeft: '10px', marginRight: '10px'}}
//   id="dropdownMenuButton"
//   data-mdb-toggle="dropdown"
//   aria-expanded="false"
// >
//   <BsThreeDotsVertical
//     style={{height: '30px', width: '30px'}}
//   />
// </button>
