import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'

import {IoIosArrowBack} from 'react-icons/io'

class Categories extends Component {
  state = {
    CategoriesList: [],
    ApiSuccess: false,
  }

  componentDidMount() {
    this.getCategories()
  }

  getCategories = async () => {
    const getHistory = this.props
    const {match} = getHistory
    const {params} = match
    const {id} = params
    const url = 'https://api.spotify.com/v1/me'
    const accessToken = Cookies.get('pa_token')

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }

    const response = await fetch(url, options)
    const userDetails = await response.json()
    const getUserCountry = userDetails.country
    const getCategoriesListApi = `https://api.spotify.com/v1/browse/categories/${id}/playlists?country=${getUserCountry}`
    const fetchingData = await fetch(getCategoriesListApi, options)
    const dataResponse = await fetchingData.json()
    if (fetchingData.ok === true) {
      this.setState({CategoriesList: dataResponse, ApiSuccess: true})
    }
  }

  renderCategoriesPlaylists = () => {
    const {CategoriesList} = this.state
    return (
      <div className="p-2">
        <Link to="/">
          <div className="d-flex align-items-start">
            <IoIosArrowBack className="m-2 text-white" />
            <p className="text-white fw-bold mt-1 ">Back</p>
          </div>
        </Link>
        <h1 className="editorsPick-heading">Listen To Your Fav Music</h1>
        <div className="container-fluid">
          <div className="row">
            <ul className="d-flex justify-content-start flex-wrap p-none">
              {CategoriesList.playlists.items.map(each => (
                <Link
                  to={`/playlist/${each.href.split('/')[5]}`}
                  className="col-5 col-sm-3  text-center  col-md-3 col-lg-3 col-xl-2 m-2 bg-white rounded-bottom text-decoration-none"
                >
                  <li
                    key={each.id}
                    style={{cursor: 'pointer', listStyleType: 'none'}}
                  >
                    <img src={each.images[0].url} alt="" width="100%" />
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

  render() {
    const {ApiSuccess} = this.state
    return (
      <div className="">
        {ApiSuccess ? (
          this.renderCategoriesPlaylists()
        ) : (
          <div
            className="d-flex flex-col justify-content-center align-items-center"
            style={{height: '70vh'}}
          >
            <div className="loader" />
          </div>
        )}
      </div>
    )
  }
}

export default Categories
