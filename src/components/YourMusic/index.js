import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'

import Avatar from '@mui/material/Avatar'
// import {AiFillPlayCircle, AiOutlineArrowUp, AiFillHeart} from 'react-icons/ai'
import {MdDelete} from 'react-icons/md'
// import {BsThreeDotsVertical} from 'react-icons/bs'
import {IoIosArrowBack} from 'react-icons/io'
import Paper from '@mui/material/Paper'

import {getUserLikedSongs} from '../../userDetailsGet'

import SpotifyContext from '../../SpotifyContext'
import './index.css'

class YourMusic extends Component {
  state = {myFavSongs: [], isLoading: true}

  componentDidMount() {
    this.getAllFavTracks()
  }

  getAllFavTracks = async () => {
    const getAllLikedSong = await getUserLikedSongs()
    if (getAllLikedSong !== true || getAllLikedSong !== 'true') {
      this.setState({myFavSongs: getAllLikedSong, isLoading: false})
    }
  }

  render() {
    return (
      <SpotifyContext.Consumer>
        {value => {
          const {audioTrack, audioTrakSong} = value
          const {isLoading, myFavSongs} = this.state

          const playThisSong = audioUrl => {
            audioTrakSong(audioUrl)
          }

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
              <p className="text-black fw-bold justify-content-end">
                {finalTimerString}
              </p>
            )
          }

          const goToHome = () => {
            const {history} = this.props
            const {goBack} = history
            goBack(-1)
          }

          const reomveFromFavList = async id => {
            const token = Cookies.get('pa_token')
            const sendBody = {
              ids: [id],
            }
            const url = `https://api.spotify.com/v1/me/tracks`
            const options = {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(sendBody),
            }
            const fetchingData = await fetch(url, options)
            this.getAllFavTracks()
            playThisSong('')
          }

          return (
            <>
              {!isLoading ? (
                <div className="p-2 d-flex flex-column justify-content-center align-items-center">
                  <div
                    className="d-flex justify-content-start align-self-start mb-3"
                    id="section"
                  >
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
                  <div className="w-100 d-flex flex-column justify-content-center align-items-center">
                    {myFavSongs.items.length > 0 ? (
                      myFavSongs.items.map(eachSong => (
                        <Link
                          key={eachSong.track.id}
                          to={`/songTrack/${eachSong.track.id}`}
                          className="d-flex justify-content-center"
                          style={{width: '94%'}}
                        >
                          <Paper
                            key={eachSong.track.id}
                            sx={{backgroundColor: 'black'}}
                            className={`d-flex flex-column   border rounded flex-sm-row ${
                              audioTrack === eachSong.track.preview_url
                                ? 'bg-success EachsongPlaylistCard2   p-2'
                                : 'EachsongPlaylistCard'
                            }`}
                            onClick={() =>
                              playThisSong(eachSong.track.preview_url)
                            }
                          >
                            <div className="d-flex flex-grow-1">
                              <Avatar
                                src={
                                  eachSong.track.album.images[0].url ===
                                  undefined
                                    ? ''
                                    : eachSong.track.album.images[0].url
                                }
                                alt=""
                                className="mr-2 ml-4"
                              />
                              <div className="songDetails">
                                <h6>{eachSong.track.name}</h6>
                                <p>{eachSong.track.album.artists[0].name}</p>
                              </div>
                            </div>
                            {/* Specific Playlist Each Song Card Audio And Duration Container */}
                            <div className="EachsongPlaylistCar-audio-duration-container">
                              {songDuration(eachSong.track.duration_ms)}
                              <div>
                                <button
                                  className="bookmarkBtn"
                                  type="button"
                                  onClick={() =>
                                    reomveFromFavList(eachSong.track.id)
                                  }
                                >
                                  <span className="IconContainer">
                                    <MdDelete />
                                  </span>
                                  <p
                                    className="text fw-bold mt-3 ml-1"
                                    style={{fontSize: '12px'}}
                                  >
                                    Delete
                                  </p>
                                </button>
                              </div>
                            </div>
                          </Paper>
                        </Link>
                      ))
                    ) : (
                      <div className="col-12 d-flex flex-column justif-content-center align-items-center">
                        <div className="empty-playlists-container">
                          <img
                            src="https://img.freepik.com/premium-vector/perfect-design-vector-mobile-music-app_203633-4525.jpg?size=626&ext=jpg&ga=GA1.1.2111229576.1690959004&semt=ais"
                            alt="emptylist"
                          />
                          <h2>No Liked Songs</h2>
                          <p>
                            If you want to use this, you need to add tracks to
                            fav songs
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  className="d-flex flex-col justify-content-center align-items-center"
                  style={{height: '70vh'}}
                >
                  <div className="loader" />
                </div>
              )}
            </>
          )
        }}
      </SpotifyContext.Consumer>
    )
  }
}

export default YourMusic
