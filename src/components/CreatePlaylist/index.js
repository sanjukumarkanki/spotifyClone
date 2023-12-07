import {Component} from 'react'

import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'

import {AiFillPlusCircle} from 'react-icons/ai'
import {MdCancel} from 'react-icons/md'

import TextField from '@mui/material/TextField'

import {UserDetails, accessToken} from '../../userDetailsGet'

import './index.css'

class CreatePlaylist extends Component {
  state = {playlistName: ''}

  onPlaylistName = e => {
    this.setState({
      playlistName: e.target.value,
    })
  }

  CreatePlaylist = async () => {
    const {playlistName} = this.state
    if (playlistName !== '') {
      // Get User Details
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
      const userDetails = await UserDetails()
      const playlistDetails = {
        name: playlistName,
        description: 'none',
      }
      // Get Use PlayDetails
      const getUserPlaylistUrl = `https://api.spotify.com/v1/users/${userDetails.id}/playlists`
      const fethPlaylist = await fetch(getUserPlaylistUrl, options)
      const getUserPlaylist = await fethPlaylist.json()
      const details = getUserPlaylist.items.map(each => each.name)
      if (details.includes(playlistName)) {
        alert('You already have a playlist with the same name try another one')
      } else {
        // Create Playlist Code Here
        const createPlaylistUrl = `https://api.spotify.com/v1/users/${userDetails.id}/playlists`
        const passHandler = {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(playlistDetails),
        }
        const fetchUrl = await fetch(createPlaylistUrl, passHandler)
        if (fetchUrl.ok === true) {
          const getresponse = await fetchUrl.json()
          alert(
            'Your New Playlist is Created. If you want to see your new playlist please refresh the page',
          )
        }
      }
    } else {
      alert('Playlist Name and Description must be given')
    }
  }

  render() {
    return (
      <div>
        <Popup
          modal
          trigger={
            <button type="button" className="addto-playlist-button">
              <AiFillPlusCircle
                style={{
                  height: '20px',
                  width: '20px',
                }}
              />
            </button>
          }
        >
          {close => (
            <>
              <div className="d-flex flex-column align-items-start p-2">
                <button
                  type="button"
                  className="align-self-end cancel-button"
                  onClick={() => close()}
                >
                  <MdCancel style={{height: '20px', width: '20px'}} />
                </button>
                <div className="addPlaylist" style={{width: '100%'}}>
                  <h4>Create Playlist</h4>
                  <TextField
                    id="outlined-basic"
                    onChange={this.onPlaylistName}
                    label="Playlist Name"
                    variant="outlined"
                    fullWidth
                  />
                  <button
                    type="button"
                    className="btn btn-success w-100 mt-2"
                    onClick={() => this.CreatePlaylist()}
                  >
                    Add
                  </button>
                </div>
              </div>
            </>
          )}
        </Popup>
      </div>
    )
  }
}

export default CreatePlaylist
