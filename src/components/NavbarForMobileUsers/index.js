import {Component} from 'react'

import {Link, withRouter} from 'react-router-dom'

import {BiSolidHome} from 'react-icons/bi'
import {AiFillCloseCircle} from 'react-icons/ai'
import {GiHamburgerMenu} from 'react-icons/gi'
import {BsMusicNoteList, BsMusicNoteBeamed} from 'react-icons/bs'
import Avatar from '@mui/material/Avatar'

import Cookies from 'js-cookie'
import {UserDetails} from '../../userDetailsGet'
import './index.css'

class NavbarForMobileUsers extends Component {
  state = {activeButton: 'homeButton', userProfileDetails: []}

  componentDidMount() {
    this.onGetUSerDetaiils()
  }

  onGetUSerDetaiils = async () => {
    const getUserDetails = await UserDetails()
    if (getUserDetails !== false) {
      this.setState({userProfileDetails: [getUserDetails]})
    }
  }

  onHomeButton = () => {
    this.setState({activeButton: 'homeButton'})
  }

  onLikedButton = () => {
    this.setState({activeButton: 'liked'})
  }

  onPlaylistButton = () => {
    this.setState({activeButton: 'playlist'})
  }

  onLogout = () => {
    const {history} = this.props
    Cookies.remove('pa_token')
    history.replace('/login')
  }

  render() {
    const {activeButton, userProfileDetails} = this.state

    return (
      <div className="d-sm-block d-md-none">
        <button
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasExample"
          aria-controls="offcanvasExample"
          className="btn text-white"
        >
          <GiHamburgerMenu style={{height: '30px', width: '30px'}} />
        </button>
        <div
          className="offcanvas offcanvas-start bg-container"
          style={{minHeight: '100vh', overflowY: 'scroll'}}
          tabIndex="-1"
          id="offcanvasExample"
          aria-labelledby="offcanvasExampleLabel"
        >
          <div className="offcanvas-header">
            <img
              className="sidebar__logo"
              src="https://getheavy.com/wp-content/uploads/2019/12/spotify2019-830x350.jpg"
              alt=""
            />
            <button
              type="button"
              className="close btn"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            >
              <AiFillCloseCircle className="text-white" />
            </button>
          </div>
          <div className="offcanvas-body">
            {/* user Details */}
            {userProfileDetails.length > 0 && (
              <div className="uesr-details-container">
                <div className="d-flex">
                  <Avatar
                    sx={{
                      backgroundColor: '#fff',
                      color: '#ff00bf',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {userProfileDetails[0].display_name[0]}
                  </Avatar>
                  <span className="email-text">
                    {userProfileDetails[0].email}
                  </span>
                </div>
                <h4>{userProfileDetails[0].display_name}</h4>
                <p>Country : {userProfileDetails[0].country}</p>
              </div>
            )}

            {/* button */}
            <ul className="p-0 d-flex flex-column">
              <Link to="/" key="home" className="w-100">
                <li
                  key="home"
                  data-bs-dismiss="offcanvas"
                  className={
                    activeButton === 'homeButton'
                      ? 'active-button'
                      : 'unactive-button'
                  }
                  onClick={() => this.onHomeButton()}
                >
                  <button type="button">
                    <BiSolidHome className="nav-button-icon" />
                  </button>
                  <p>Home</p>
                </li>
              </Link>
              <Link to="/yourmusic" key="likedSongs" className="w-100">
                <li
                  key="likedSongs"
                  data-bs-dismiss="offcanvas"
                  className={
                    activeButton === 'liked'
                      ? 'active-button'
                      : 'unactive-button'
                  }
                  onClick={() => this.onLikedButton()}
                >
                  <button type="button">
                    <BsMusicNoteBeamed className="nav-button-icon" />
                  </button>
                  <p>Liked Songs</p>
                </li>
              </Link>
              <Link to="/yourplaylists" key="playlists" className="w-100">
                <li
                  data-bs-dismiss="offcanvas"
                  key="playlists"
                  className={
                    activeButton === 'playlist'
                      ? 'active-button'
                      : 'unactive-button'
                  }
                  onClick={() => this.onPlaylistButton()}
                >
                  <button type="button">
                    <BsMusicNoteList className="nav-button-icon" />
                  </button>
                  <p>Playlists</p>
                </li>
              </Link>
            </ul>
          </div>
          <button
            type="button"
            className="btn btn-success m-4"
            onClick={() => this.onLogout()}
          >
            Logout
          </button>
        </div>
      </div>
    )
  }
}

export default withRouter(NavbarForMobileUsers)
