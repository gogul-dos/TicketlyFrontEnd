import React, { Component, createRef } from "react";
import { Link } from "react-router-dom";
import icon from "../../images/icon.png";
import CityContext from "../cityContext/cityContext"; // ✅ import context
import "./header.css";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isProfileOpen: false,
      dropdownVisible: false,
    };
    this.profileRef = createRef();
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (
      this.profileRef.current &&
      !this.profileRef.current.contains(event.target)
    ) {
      this.setState({ dropdownVisible: false });
      setTimeout(() => {
        this.setState({ isProfileOpen: false });
      }, 200);
    }
  };

  getTokenFromCookies = () => {
    const cookies = document.cookie.split("; ");
    const tokenCookie = cookies.find((row) => row.startsWith("token="));
    return tokenCookie ? tokenCookie.split("=")[1] : null;
  };

  handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/login";
  };

  toggleProfileMenu = () => {
    if (!this.state.isProfileOpen) {
      this.setState({ isProfileOpen: true, dropdownVisible: true });
    } else {
      this.setState({ dropdownVisible: false });
      setTimeout(() => {
        this.setState({ isProfileOpen: false });
      }, 200);
    }
  };

  render() {
    const token = this.getTokenFromCookies();
    const { isProfileOpen, dropdownVisible } = this.state;
    return (
      <CityContext.Consumer>
        {({ city, setCity }) => (
          <div className="main-header-container">
            <div className="header-left">
              <Link to="/">
                <img src={icon} className="header-icon" alt="App Icon" />
              </Link>
              <input
                type="text"
                className="search-movie-input-tag"
                placeholder="🔍 Search a movie..."
              />
              <select
              className="header-city-select"
                name="city"
                id="citySelect"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required>
                <option value="" disabled>
                  Select City
                </option>
                <option value="chennai">Chennai</option>
                <option value="coimbatore">Coimbatore</option>
                <option value="madurai">Madurai</option>
                <option value="tiruchirappalli">Tiruchirappalli</option>
                <option value="salem">Salem</option>
                <option value="tirunelveli">Tirunelveli</option>
                <option value="erode">Erode</option>
                <option value="vellore">Vellore</option>
                <option value="thoothukudi">Thoothukudi</option>
                <option value="nagercoil">Nagercoil</option>
              </select>
            </div>

            <div className="header-right">
              {token ? (
                <div className="profile-container" ref={this.profileRef}>
                  <div
                    className="profile-button"
                    onClick={this.toggleProfileMenu}>
                    👤 My Profile ▾
                  </div>
                  {isProfileOpen && (
                    <div
                      className={`profile-dropdown ${
                        dropdownVisible ? "fade-in" : "fade-out"
                      }`}>
                      <Link to="/bookings">My Bookings</Link>
                      <button onClick={this.handleLogout}>Logout</button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="login-button">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </CityContext.Consumer>
    );
  }
}

export default Header;
