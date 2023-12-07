import {Component} from 'react'
// // import {Link} from 'react-router-dom'

// // import Popup from 'reactjs-popup'
// import {MdCancel} from 'react-icons/md'
import 'reactjs-popup/dist/index.css'

import {accessToken} from '../../userDetailsGet'
import './index.css'

class AddSongsToYourPlaylists extends Component {
  state = {getAllPlaylists: [], isLoading: true}

  componentDidMount() {
    this.getusersPlaylists()
  }

  getusersPlaylists = async () => {
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${accessToken}`},
    }
    const getUSerDetails = await UserDetails()
    const createPlaylistUrl = `https://api.spotify.com/v1/users/${getUSerDetails.id}/playlists`
    const fetchUrl = await fetch(createPlaylistUrl, options)
    const getresponse = await fetchUrl.json()
    if (fetchUrl.ok === true) {
      this.setState({getAllPlaylists: getresponse, isLoading: false})
    }
  }

  onEachSongCard = async id => {
    const {SongTrackId} = this.props
    const SongTracjUri = {
      uris: [SongTrackId],
      position: 0,
    }
    const url = `https://api.spotify.com/v1/playlists/${id}/tracks`
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(SongTracjUri),
    }
    const getFetch = await fetch(url, options)
    console.log(getFetch)
  }

  render() {
    const {getAllPlaylists, isLoading} = this.state
    return (
      !isLoading && (
        <div className="dropdown">
          <button
            className="btn btn-primary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-mdb-toggle="dropdown"
            aria-expanded="false"
          >
            Dropdown buttons
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li>
              <p className="dropdown-item">Add to Favourites</p>
            </li>
            <li>
              <p className="dropdown-item">Add to playlists &raquo;</p>
              <ul className="dropdown-menu dropdown-submenu dropdown-submenu-left">
                <li key="create playlist">
                  <p className="dropdown-item" id="playlist">
                    Create New Playlist
                  </p>
                </li>
                {getAllPlaylists.items.map(eachItem => (
                  <li key={eachItem.id} className="dropdown-item">
                    {eachItem.name} playlist
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
      )
    )
  }
}

export default AddSongsToYourPlaylists
