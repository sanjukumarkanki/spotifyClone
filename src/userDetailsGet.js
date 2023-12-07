import Cookies from 'js-cookie'

export const accessToken = Cookies.get('pa_token')

const options = {
  method: 'GET',
  headers: {Authorization: `Bearer ${accessToken}`},
}

export const UserDetails = async () => {
  const url = 'https://api.spotify.com/v1/me'
  const response = await fetch(url, options)
  const userDetails = await response.json()
  return userDetails
}

export const getUserPlaylists = async () => {
  const userDetails = await UserDetails()
  const createPlaylistUrl = `https://api.spotify.com/v1/users/${userDetails.id}/playlists`
  const fetchUrl = await fetch(createPlaylistUrl, options)
  if (fetchUrl.ok === true) {
    const getResponse = await fetchUrl.json()
    return getResponse
  }
  return false
}

export const getUserLikedSongs = async () => {
  const url = 'https://api.spotify.com/v1/me/tracks'
  const LikedSongsFetching = await fetch(url, options)
  const getData = await LikedSongsFetching.json()
  if (LikedSongsFetching.ok === true) {
    return getData
  }
  return false
}
