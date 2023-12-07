import {Link} from 'react-router-dom'
import NavbarForMobileUsers from '../NavbarForMobileUsers'
import NavBarForDesktopUsers from '../NavBarForDesktopUsers'
import './index.css'

const Navbar = () => (
  <nav>
    <Link to="/" className="text-decoration-none">
      <img
        src="https://assets.ccbp.in/frontend/react-js/spotify-remix-login-music.png"
        alt="website logo"
        className="d-inline d-md-none"
      />
      <img
        src="https://cdn.analyticsvidhya.com/wp-content/uploads/2023/03/11167spotify-logo-1920x1080-2_8MlUCWA.jpg"
        alt="website logo"
        className="d-none d-md-inline logo-icon"
      />
    </Link>
    <NavBarForDesktopUsers />
    <NavbarForMobileUsers className="" />
  </nav>
)

export default Navbar
