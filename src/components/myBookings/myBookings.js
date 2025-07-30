import React, { Component } from "react";
import Cookies from "js-cookie";
import Header from "../header/header";
import LoadingScreen from "../loadingScreen/loadingScreen";
import "./myBookings.css";

class MyBookings extends Component {
  state = {
    bookings: [],
    status: "LOADING",
  };

  componentDidMount() {
    this.fetchBookings();
  }

  fetchBookings = async () => {
    const token = Cookies.get("token");
    const url = process.env.REACT_APP_BACKEND_URL;

    try {
      const response = await fetch(`${url}/mybookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch bookings");

      const data = await response.json();
      this.setState({ bookings: data, status: "SUCCESS" });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      this.setState({ status: "FAILURE" });
    }
  };

  renderBookingCard = (booking) => {
    const showDateTime = new Date(booking.show_datetime);

    const formattedDate = showDateTime.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const formattedTime = showDateTime.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <div key={booking.ticket_id} className="mb-card">
        <div className="mb-header">
          <h3>{booking.movie_name}</h3>
          <span>🎟 Ticket #{booking.ticket_id}</span>
        </div>
        <div className="mb-details">
          <p>
            <strong>Theatre:</strong> {booking.theatre_name}
          </p>
          <p>
            <strong>Screen:</strong> Screen {booking.screen_number}
          </p>
          <p>
            <strong>Date:</strong> {formattedDate}
          </p>
          <p>
            <strong>Time:</strong> {formattedTime}
          </p>
          <p>
            <strong>Amount Paid:</strong> ₹{booking.total_amount}
          </p>
          <p>
            <strong>Booked On:</strong>{" "}
            {new Date(booking.created_at).toLocaleString()}
          </p>
        </div>
      </div>
    );
  };

  render() {
    const { bookings, status } = this.state;

    return (
      <>
        <Header />
        <div className="mb-container">
          <h2 className="mb-title">🎫 My Bookings</h2>

          {status === "LOADING" && <LoadingScreen />}
          {status === "FAILURE" && (
            <p className="mb-error">Failed to load bookings.</p>
          )}
          {status === "SUCCESS" && bookings.length === 0 && (
            <p className="mb-empty">No bookings found.</p>
          )}
          {status === "SUCCESS" && bookings.length > 0 && (
            <div className="mb-list">
              {bookings.map(this.renderBookingCard)}
            </div>
          )}
        </div>
      </>
    );
  }
}

export default MyBookings;
