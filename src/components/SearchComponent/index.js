import {Component} from 'react'

import {BiSearch} from 'react-icons/bi'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

import Paper from '@mui/material/Paper'

class SearchComponent extends Component {
  state = {
    inputText: '',
    searchedWord: '',
    getSearchResults: [],
    noResultsError: '',
  }

  onSearch = e => {
    this.setState({inputText: e.target.value})
  }

  getResults = async () => {
    const {searchedWord} = this.state
    const token = Cookies.get('pa_token')
    const url = `https://api.spotify.com/v1/search?type=track,playlist&q=${searchedWord}&market=from_token`
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${token}`},
    }
    const fetchingData = await fetch(url, options)
    console.log(fetchingData)
    if (fetchingData.ok === true) {
      const getResults = await fetchingData.json()
      console.log(getResults, searchedWord)
      this.setState({getSearchResults: [getResults]})
    } else {
      const getResponse = await fetchingData.json()
      this.setState({
        noResultsError: getResponse.error,
      })
    }
  }

  onSearchForSong = () => {
    const {inputText} = this.state
    this.setState({searchedWord: inputText}, this.getResults)
  }

  render() {
    const {getSearchResults, noResultsError} = this.state
    return (
      <>
        <div className=" m-4">
          <div className="field-container">
            <input
              type="search"
              onChange={this.onSearch}
              placeholder="Search any song here"
              className="field"
            />
            <button
              className="icons-container"
              type="button"
              onClick={() => this.onSearchForSong()}
            >
              <BiSearch style={{height: '30px'}} />
            </button>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <h2
              className="editorsPick-heading "
              style={{listStyleType: 'none'}}
            >
              Playlists
            </h2>
            {noResultsError === '' && getSearchResults.length > 0 && (
              <ul className="col-12 d-flex justify-content-start flex-wrap p-none">
                {getSearchResults[0].playlists.items.length > 0 ? (
                  getSearchResults[0].playlists.items.map(each => (
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
                        <img src={each.images[0].url} alt="" width="100%" />
                        <p className="each-playlist-name">{each.name}</p>
                      </li>
                    </Link>
                  ))
                ) : (
                  <div className="col-12 bg-white rounded p-2 m-3 d-flex flex-column justify-content-center align-items-center">
                    <img
                      src="https://img.freepik.com/free-vector/no-data-concept-illustration_114360-536.jpg?size=626&ext=jpg&ga=GA1.2.2111229576.1690959004&semt=ais"
                      alt="search-img"
                    />
                    <h2 className="fw-bold">No Results Found</h2>
                  </div>
                )}
              </ul>
            )}

            {getSearchResults.length === 0 && (
              <div className="col-12 bg-white rounded p-2 m-3 d-flex flex-column justify-content-center align-items-center">
                <img
                  src="https://img.freepik.com/free-vector/file-searching-illustrated-concept-landing-page_52683-24619.jpg?size=626&ext=jpg&ga=GA1.2.2111229576.1690959004&semt=ais"
                  alt="search-img"
                />
                <h2>Search for the Playlists</h2>
              </div>
            )}
          </div>
          <div className="row">
            <h2
              className="editorsPick-heading "
              style={{listStyleType: 'none'}}
            >
              Tracks
            </h2>
            {noResultsError === '' && getSearchResults.length > 0 && (
              <ul className="col-12 d-flex justify-content-start flex-wrap p-none">
                {getSearchResults[0].tracks.items.length > 0 ? (
                  getSearchResults[0].tracks.items.map(eachSong => (
                    <Link
                      key={eachSong.id}
                      to={`/songTrack/${eachSong.id}`}
                      className="col-5 col-md-4 col-lg-3 col-xl-2 m-2"
                    >
                      <Paper key={eachSong.id} className="d-flex">
                        <img
                          width="50%"
                          height="100%"
                          alt="songimage"
                          src={
                            eachSong.album.images.length > 0
                              ? eachSong.album.images[0].url
                              : 'https://media.istockphoto.com/id/1316420668/vector/user-icon-human-person-symbol-social-profile-icon-avatar-login-sign-web-user-symbol.jpg?s=612x612&w=0&k=20&c=AhqW2ssX8EeI2IYFm6-ASQ7rfeBWfrFFV4E87SaFhJE='
                          }
                        />
                        <div style={{height: '100%'}} className="p-1">
                          <p
                            style={{
                              fontSize: '8px',
                              fontFamily: 'cursive',
                              fontWeight: 'bold',
                            }}
                          >
                            Song Name : {eachSong.album.name}
                          </p>
                        </div>
                      </Paper>
                    </Link>
                  ))
                ) : (
                  <div className="col-12 bg-white rounded p-2 m-3 d-flex flex-column justify-content-center align-items-center">
                    <img
                      src="https://img.freepik.com/free-vector/no-data-concept-illustration_114360-536.jpg?size=626&ext=jpg&ga=GA1.2.2111229576.1690959004&semt=ais"
                      alt="search-img"
                    />
                    <h2 className="fw-bold">No Results Found</h2>
                  </div>
                )}
              </ul>
            )}

            {getSearchResults.length === 0 && (
              <div className="col-12 bg-white rounded p-2 m-3 d-flex flex-column justify-content-center align-items-center">
                <img
                  src="https://img.freepik.com/free-vector/file-searching-illustrated-concept-landing-page_52683-24619.jpg?size=626&ext=jpg&ga=GA1.2.2111229576.1690959004&semt=ais"
                  alt="search-img"
                />
                <h2 className="fw-bold">Search For The Tracks</h2>
              </div>
            )}
          </div>
        </div>
      </>
    )
  }
}

export default SearchComponent
