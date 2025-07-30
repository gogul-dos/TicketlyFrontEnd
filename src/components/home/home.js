import { Component } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import Header from "../header/header";
import ShimmerCard from "../shimmerCard/shimmerCard";
import "./home.css";

class Home extends Component {
  requestStatus = {
    progress: "IN_PROGRESS",
    success: "SUCCESS",
    failure: "FAILURE",
  };

  state = {
    urlRequestStatus: this.requestStatus.progress,
    urlResult: [],
    activeGenre: "All",
    fadeClass: "",
  };

  genres = [
    "All",
    "Action",
    "Comedy",
    "Drama",
    "Horror",
    "Thriller",
    "Romance",
  ];

  componentDidMount() {
    this.getMovieResults();
  }

  getMovieResults = async () => {
    this.setState({ urlRequestStatus: this.requestStatus.progress });
    const url = process.env.REACT_APP_BACKEND_URL;
    const jwtToken = Cookies.get("token");

    const options = {
      method: "GET",
      headers: { Authorization: `Bearer ${jwtToken}` },
    };

    try {
      const response = await fetch(url + "/", options);
      if (!response.ok) throw new Error("Fetch error");
      const data = await response.json();
      this.setState({
        urlRequestStatus: this.requestStatus.success,
        urlResult: data,
      });
    } catch (error) {
      console.error("Fetch failed:", error);
      this.setState({ urlRequestStatus: this.requestStatus.failure });
    }
  };

  movieCardClicked = (id) => {
    console.log(id + " is clicked");
  };

  changeGenre = (genre) => {
    this.setState({ fadeClass: "fade-out" });
    setTimeout(() => {
      this.setState({ activeGenre: genre, fadeClass: "fade-in" });
    }, 200);
  };

  groupMoviesByReleaseDate = () => {
    const { urlResult, activeGenre } = this.state;
    const today = new Date();

    const filtered =
      activeGenre === "All"
        ? urlResult
        : urlResult.filter((movie) =>
            movie.genre?.toLowerCase().includes(activeGenre.toLowerCase())
          );

    let nowShowing = filtered.filter(
      (movie) => new Date(movie.release_date) <= today
    );
    nowShowing = filtered;
    const upcoming = filtered.filter(
      (movie) => new Date(movie.release_date) > today
    );

    return { nowShowing, upcoming };
  };

  successView = () => {
    const { fadeClass } = this.state;
    const { nowShowing, upcoming } = this.groupMoviesByReleaseDate();

    const renderMovies = (list) =>
      list.length === 0 ? (
        <p className="no-movies-message">
          No movies available in this section.
        </p>
      ) : (
        <div className={`movies-container ${fadeClass}`}>
          {list.map((movie) => {
            const {
              title = "Untitled",
              rating,
              poster_url,
              trailer_url,
              movie_id,
            } = movie;
            const poster =
              poster_url ||
              "https://via.placeholder.com/220x260?text=No+Poster";
            const rate = rating !== undefined ? `${rating}/10` : "No rating";
            return (
              <Link to={`/movies/${movie_id}`} key={movie_id}>
                <div
                  className="movie-card"
                  onClick={() => this.movieCardClicked(movie_id)}>
                  <div className="poster-container">
                    <img src={poster} alt={title} />
                    {trailer_url && (
                      <video
                        className="trailer-preview"
                        src={trailer_url}
                        muted
                        loop
                        preload="none"
                      />
                    )}
                  </div>
                  <div className="movie-info">
                    <h3>{title}</h3>
                    <p>
                      <i
                        className="fa-solid fa-star"
                        style={{ color: "orange" }}></i>{" "}
                      {rate}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      );

    return (
      <>
        <div className="genre-bar">
          {this.genres.map((genre) => (
            <button
              key={genre}
              className={`genre-button ${
                genre === this.state.activeGenre ? "active" : ""
              }`}
              onClick={() => this.changeGenre(genre)}>
              {genre}
            </button>
          ))}
        </div>

        <h2 className="section-title">🎬 Now Showing</h2>
        {renderMovies(nowShowing)}

      </>
    );
  };

  getCurrentStatus = () => {
    if (this.state.urlRequestStatus === this.requestStatus.progress) {
      return (
        <div className="movies-container">
          {Array.from({ length: 8 }).map((_, idx) => (
            <ShimmerCard key={idx} />
          ))}
        </div>
      );
    } else if (this.state.urlRequestStatus === this.requestStatus.success) {
      return this.successView();
    } else {
      return <p style={{ textAlign: "center" }}>Failed to load content.</p>;
    }
  };

  render() {
    return (
      <div className="home-wrapper">
        <div className="animated-bg">
          <div className="blob blob1"></div>
          <div className="blob blob2"></div>
          <div className="blob blob3"></div>
        </div>

        <Header />
        {this.getCurrentStatus()}
      </div>
    );
  }
}

export default Home;
