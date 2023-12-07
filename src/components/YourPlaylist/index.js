import {Component} from 'react'
import {Link} from 'react-router-dom'

import './index.css'

import {IoIosArrowBack} from 'react-icons/io'

import {getUserPlaylists} from '../../userDetailsGet'

import CreatePlaylist from '../CreatePlaylist'

class YourPlaylist extends Component {
  state = {getAllPlaylists: [], isLoading: true}

  componentDidMount() {
    this.getusersPlaylists()
  }

  // Get User Playlists Code Here

  getusersPlaylists = async () => {
    const getResponse = await getUserPlaylists()
    if (getResponse !== 'false' || getResponse !== false) {
      this.setState({
        getAllPlaylists: getResponse,
        isLoading: false,
      })
    }
  }

  goToHome = () => {
    const {history} = this.props
    const {goBack} = history
    goBack(-1)
  }

  render() {
    const {getAllPlaylists, isLoading} = this.state
    return (
      <div className="container-fluid">
        <div className="row">
          <div
            className="d-flex justify-content-start align-self-start mb-3"
            id="section"
          >
            <IoIosArrowBack
              className="m-2 text-white"
              onClick={() => this.goToHome()}
              style={{cursor: 'pointer'}}
              id="goBack"
            />
            <label
              htmlFor="goBack"
              className="text-white fw-bold mt-1 "
              style={{cursor: 'pointer'}}
              onClick={() => this.goToHome()}
            >
              Back
            </label>
          </div>
          <div className="col-12 mt-3 d-flex  align-items-center justify-content-between">
            <h1 className="myPlaylists-heading">Your Playlists</h1>
            <div className="d-flex align-items-center">
              <CreatePlaylist />
              <span
                className="create-playlist-text"
                style={{marginLeft: '10px'}}
              >
                Create Playlist
              </span>
            </div>
          </div>
          {isLoading ? (
            <div
              className="d-flex flex-col justify-content-center align-items-center"
              style={{height: '70vh'}}
            >
              <div className="loader" />
            </div>
          ) : (
            <div className="row">
              {getAllPlaylists.items.length > 0 ? (
                <ul className="col-12 d-flex flex-wrap justify-content-col-center justify-content-start ">
                  {getAllPlaylists.items.map(each => (
                    <Link
                      to={`/yourplaylisttracks/${each.id}/${each.snapshot_id}`}
                      style={{listStyleType: 'none'}}
                      className="text-decoration-none  border rounded col-12 col-sm-3 col-md-3 col-lg-2 col-lg-2 m-2"
                    >
                      <li
                        key={each.id}
                        className="each-Playlis p-0 d-flex flex-column justify-content-center align-items-center"
                      >
                        <img
                          src={
                            each.images.length > 0
                              ? each.images.map(eachImage => eachImage.url)
                              : 'https://w0.peakpx.com/wallpaper/198/826/HD-wallpaper-no-black-dark-empty-funny-humor-lost-simple-smiley-thumbnail.jpg'
                          }
                          alt=""
                          width="100%"
                          height="90%"
                        />
                        <p
                          style={{height: '10%'}}
                          className="playlist-card-name-text"
                        >
                          {each.name}
                        </p>
                      </li>
                    </Link>
                  ))}
                </ul>
              ) : (
                <div className="d-flex flex-column justif-content-center align-items-center mt-3">
                  <div className="empty-playlists-container">
                    <img
                      src="https://img.freepik.com/free-vector/more-music-concept-illustration_114360-1066.jpg?w=826&t=st=1690803836~exp=1690804436~hmac=9c0d054228652d29ea66b3c14e0641bce921cfd8ad6618b08647623e5862dc31"
                      alt="emptylist"
                    />
                    <h2>Empty Playlist</h2>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default YourPlaylist
