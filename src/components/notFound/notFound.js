import { Link } from "react-router-dom";
import "./notFound.css";

const NotFound = () => {
  return (
    <div className="ticketly-notfound-container">
      <img
        src="https://res.cloudinary.com/djfbwkdh3/image/upload/v1705729871/erroring_1_lzmjpy.png"
        alt="page not found"
        className="ticketly-notfound-image"
      />
      <h1 className="ticketly-notfound-heading">Page Not Found</h1>
      <p className="ticketly-notfound-description">
        Sorry, the page you're looking for doesn't exist.<br />
        Please return to the homepage.
      </p>
      <Link to="/">
        <button type="button" className="ticketly-notfound-button">
          Go to Home
        </button>
      </Link>
    </div>
  );
};

export default NotFound;
