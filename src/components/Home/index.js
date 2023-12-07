import {Component} from 'react'
import {Link} from 'react-router-dom'
import moment from 'moment'
import Cookies from 'js-cookie'

import './index.css'

const editorsPicksStatusObj = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const GenresMoodsStatusObj = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const NewwReleasesObj = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}
class Home extends Component {
  state = {
    allObjexts: [
      // editorsPick Object
      {
        editorsPicksList: [],
        editorsPicksAPIStatus: editorsPicksStatusObj.loading,
        isEditorsPickLoading: true,
      },
      // geners and mood's object
      {
        GenresMoodsList: [],
        GenresMoodsAPIStatus: editorsPicksStatusObj.loading,
        isGenresMoodsLoading: true,
      },
      {
        NewReleasesList: [],
        NewReleasesApiStatus: editorsPicksStatusObj.loading,
        isNewReleasesLoading: true,
      },
    ],
  }

  componentDidMount() {
    this.EditorsPicks()
    this.GenresMoods()
    this.NewReleases()
  }

  // GET  EDITOR'S PICKS RESPONSE
  EditorsPicks = async () => {
    const accessToken = Cookies.get('pa_token')
    this.setState(preState => ({
      allObjexts: preState.allObjexts.map((item, index) => {
        if (index === 0) {
          return {...item, editorsPicksAPIStatus: editorsPicksStatusObj.loading}
        }
        return item
      }),
    }))
    // GET USER COUNTRY NAME API
    const url = 'https://api.spotify.com/v1/me'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
    const response = await fetch(url, options)
    const userDetails = await response.json()
    const userCountry = userDetails.country
    const timeStamp = moment(new Date()).format('YYYY-MM-DDTHH:00:00')
    // GET EDITORS PICK API
    const editorsPickUrl = `https://api.spotify.com/v1/browse/featured-playlists?country=${userCountry}&timestamp=${timeStamp}'
`
    const fetchingEditorsPickApi = await fetch(editorsPickUrl, options)
    const getResponse = await fetchingEditorsPickApi.json()
    // MODIFYING EDITOR'S PICK RESPONSE
    if (fetchingEditorsPickApi.ok === true) {
      const updateData = {
        message: getResponse.message,
        href: getResponse.href,
        playlists: getResponse.playlists.items.map(eachPlaylist => ({
          description: eachPlaylist.description,
          collaborative: eachPlaylist.collaborative,
          spotifyExternalUrl: eachPlaylist.external_urls.spotify,
          href: eachPlaylist.href,
          images: eachPlaylist.images[0].url,
          limit: eachPlaylist.limit,
          name: eachPlaylist.name,
          type: eachPlaylist.type,
          snapshotId: eachPlaylist.snapshot_id,
          total: eachPlaylist.tracks.total,
          trackHref: eachPlaylist.tracks.href,
        })),
      }
      // Modifying THE state
      this.setState(preState => ({
        allObjexts: preState.allObjexts.map((item, index) => {
          if (index === 0) {
            return {
              editorsPicksList: updateData,
              editorsPicksAPIStatus: editorsPicksStatusObj.success,
              isEditorsPickLoading: true,
            }
          }
          return item
        }),
      }))
      // state Changed Here
    } else {
      this.setState(preState => ({
        allObjexts: preState.allObjexts.map((item, index) => {
          if (index === 0) {
            return {
              ...item,
              editorsPicksAPIStatus: editorsPicksStatusObj.failure,
            }
          }
          return item
        }),
      }))
    }
  }

  // GET  GENERE'S PICKS RESPONSE
  GenresMoods = async () => {
    const accessToken = Cookies.get('pa_token')
    this.setState(preState => ({
      allObjexts: preState.allObjexts.map((item, index) => {
        if (index === 1) {
          return {...item, GenresMoodsAPIStatus: GenresMoodsStatusObj.loading}
        }
        return item
      }),
    }))
    // GET USER COUNTRY NAME API

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
    // GET EDITORS PICK API
    const editorsPickUrl = 'https://api.spotify.com/v1/browse/categories'

    const fetchingEditorsPickApi = await fetch(editorsPickUrl, options)
    const getResponse = await fetchingEditorsPickApi.json()
    // MODIFYING EDITOR'S PICK RESPONSE
    if (fetchingEditorsPickApi.ok === true) {
      // Modifying THE state
      this.setState(preState => ({
        allObjexts: preState.allObjexts.map((item, index) => {
          if (index === 1) {
            return {
              GenresMoodsList: getResponse,
              GenresMoodsAPIStatus: GenresMoodsStatusObj.success,
              isGenresMoodsLoading: true,
            }
          }
          return item
        }),
      }))
      // state Changed Here
    } else {
      this.setState(preState => ({
        allObjexts: preState.allObjexts.map((item, index) => {
          if (index === 1) {
            return {
              ...item,
              GenresMoodsAPIStatus: GenresMoodsStatusObj.failure,
            }
          }
          return item
        }),
      }))
    }
  }

  // GET  NEW RELEASE'S PICKS RESPONSE
  NewReleases = async () => {
    const accessToken = Cookies.get('pa_token')
    this.setState(preState => ({
      allObjexts: preState.allObjexts.map((item, index) => {
        if (index === 2) {
          return {...item, NewReleasesApiStatus: NewwReleasesObj.loading}
        }
        return item
      }),
    }))
    // GET USER COUNTRY NAME API
    const url = 'https://api.spotify.com/v1/me'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
    const response = await fetch(url, options)
    const userDetails = await response.json()
    const getUserCountry = userDetails.country
    // GET EDITORS PICK API
    const editorsPickUrl = `https://api.spotify.com/v1/browse/new-releases?country=${getUserCountry}`

    const fetchingEditorsPickApi = await fetch(editorsPickUrl, options)
    const getResponse = await fetchingEditorsPickApi.json()
    // MODIFYING EDITOR'S PICK RESPONSE
    if (fetchingEditorsPickApi.ok === true) {
      this.setState(preState => ({
        allObjexts: preState.allObjexts.map((item, index) => {
          if (index === 2) {
            return {
              NewReleasesList: getResponse,
              NewReleasesListAPIStatus: NewwReleasesObj.success,
              isNewReleasesListLoading: true,
            }
          }
          return item
        }),
      }))
      // state Changed Here
    } else {
      this.setState(preState => ({
        allObjexts: preState.allObjexts.map((item, index) => {
          if (index === 0) {
            return {
              ...item,
              NewReleasesListAPIStatus: NewwReleasesObj.failure,
            }
          }
          return item
        }),
      }))
    }
  }

  // Loader Mode

  renderLoading = () => (
    <div className="p-2 ">
      <div className="d-flex justify-content-end">
        <p className="skeletontext" style={{width: '100px'}} />
      </div>
      <div className="container-fluid">
        <p className="skeletontext" />
        <div className="row">
          <ul
            className="d-flex justify-content-start flex-wrap p-none"
            style={{height: '450px'}}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(each => (
              <li
                key={each.id}
                style={{height: '150px', listStyleType: 'none'}}
                className="col-5 col-sm-3  text-center text-decoration-none  col-md-3 col-lg-2 col-xl-2 m-2  rounded-bottom"
              >
                <p className="skeletonimg" />
                <p className="skeletontext" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )

  // Render Editor's Pick Success STATE
  renderEditersPickSuccess = () => {
    const {allObjexts} = this.state
    const {editorsPicksList} = allObjexts[0]
    const {playlists} = editorsPicksList

    return (
      <div className="p-2">
        <div className="text-end">
          <Link to="/searchforSongs" className>
            <button
              type="button"
              className="btn btn-success text-white fw-bold"
            >
              Search For Songs
            </button>
          </Link>
        </div>
        <h1 className="editorsPick-heading">{editorsPicksList.message}</h1>
        <div className="container-fluid">
          <div className="row">
            <ul className="d-flex justify-content-start flex-wrap p-none">
              {playlists.map(each => (
                <Link
                  to={`/playlist/${each.href.split('/')[5]}`}
                  className="col-5 col-sm-3   col-md-3 col-lg-2 col-xl-2 m-2 text-decoration-none  text-center bg-white rounded-bottom"
                >
                  <li
                    key={each.id}
                    style={{
                      cursor: 'pointer',
                      listStyleType: 'none',
                      width: '100%',
                    }}
                  >
                    <img src={each.images} alt="" width="100%" />
                    <p className="each-playlist-name">{each.name}</p>
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  // EditorsPick's Conditonal Rendering

  // GenreMood's Success Rendering
  renderGenreMoodSuccess = () => {
    const {allObjexts} = this.state
    const {GenresMoodsList} = allObjexts[1]
    const {items} = GenresMoodsList.categories
    return (
      <div className="p-2">
        <h1 className="editorsPick-heading">Genres & Moods</h1>
        <div className="container-fluid">
          <div className="row">
            <ul className="d-flex justify-content-start flex-wrap p-none">
              {items.map(each => {
                if (each.name !== 'Indian Classical') {
                  return (
                    <Link
                      to={`/genres/${each.id}`}
                      className="col-5 col-sm-3 text-center text-decoration-none  col-md-3 col-lg-2 col-xl-2 m-2 bg-white rounded-bottom"
                    >
                      <li key={each.id} style={{listStyleType: 'none'}}>
                        <img src={each.icons[0].url} alt="" width="100%" />
                        <p className="each-playlist-name">{each.name}</p>
                      </li>
                    </Link>
                  )
                }
                return null
              })}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  renderNewReleaseSuccess = () => {
    const {allObjexts} = this.state
    const {NewReleasesList} = allObjexts[2]
    const itemsList = NewReleasesList.albums.items
    return (
      <div className="p-2">
        <h1 className="editorsPick-heading">New releases</h1>
        <div className="container">
          <div className="row">
            <ul className="d-flex justify-content-start flex-wrap p-none">
              {itemsList.map(each => (
                <Link
                  to={`/albums/${each.id}`}
                  className="col-5 col-sm-3 text-center text-decoration-none col-md-3 col-lg-2 col-xl-2 m-2 bg-white rounded-bottom"
                >
                  <li key={each.id} style={{listStyleType: 'none'}}>
                    <img src={each.images[2].url} alt="" width="100%" />
                    <p className="each-playlist-name">{each.name}</p>
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  // GenreAndMood's Conditonal Rendering

  editorsPicksSwitchStatemt = () => {
    const {allObjexts} = this.state
    switch (allObjexts[0].editorsPicksAPIStatus) {
      case editorsPicksStatusObj.loading:
        return this.renderLoading()
      case editorsPicksStatusObj.success:
        return this.renderEditersPickSuccess()
      default:
        return null
    }
  }

  genreMoodSwitchStatemt = () => {
    const {allObjexts} = this.state
    switch (allObjexts[1].GenresMoodsAPIStatus) {
      case GenresMoodsStatusObj.loading:
        return this.renderLoading()
      case GenresMoodsStatusObj.success:
        return this.renderGenreMoodSuccess()
      default:
        return null
    }
  }

  NewReleaseSwitchStatemt = () => {
    const {allObjexts} = this.state
    switch (allObjexts[2].NewReleasesListAPIStatus) {
      case NewwReleasesObj.loading:
        return this.renderLoading()
      case NewwReleasesObj.success:
        return this.renderNewReleaseSuccess()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="">
        {/* Home Section */}
        {this.editorsPicksSwitchStatemt()}
        {/* Genres And  Moods Section */}
        {this.genreMoodSwitchStatemt()}
        {/* New Releases Section */}
        {this.NewReleaseSwitchStatemt()}
      </div>
    )
  }
}

export default Home
