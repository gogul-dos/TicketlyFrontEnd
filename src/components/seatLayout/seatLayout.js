import React, { Component } from "react";
import Cookies from "js-cookie";
import Header from "../header/header";
import LoadingScreen from "../loadingScreen/loadingScreen";
import withNavigation from "../../utils/withNavigation";
import "./seatLayout.css";

class SeatLayout extends Component {
  state = {
    seats: [],
    selectedSeats: [],
    status: "LOADING",
    bookingSuccess: false,
  };

  componentDidMount() {
    this.fetchSeats();
  }

  fetchSeats = async () => {
    const { show_id } = this.props.params;
    const url = process.env.REACT_APP_BACKEND_URL;
    const token = Cookies.get("token");

    try {
      const response = await fetch(`${url}/seats?show_id=${show_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to load seats");

      const data = await response.json();
      this.setState({ seats: data, status: "SUCCESS" });
    } catch (error) {
      console.error("Error loading seats", error);
      this.setState({ status: "FAILURE" });
    }
  };

  toggleSeat = (seat) => {
    if (seat.is_booked) return;

    this.setState((prev) => {
      const alreadySelected = prev.selectedSeats.find(
        (s) => s.seat_id === seat.seat_id
      );

      if (alreadySelected) {
        return {
          selectedSeats: prev.selectedSeats.filter(
            (s) => s.seat_id !== seat.seat_id
          ),
        };
      } else {
        return { selectedSeats: [...prev.selectedSeats, seat] };
      }
    });
  };

  handleBooking = async () => {
    const { selectedSeats } = this.state;
    const { show_id } = this.props.params;
    const seatIds = selectedSeats.map((s) => s.seat_id);
    const token = Cookies.get("token");
    const url = process.env.REACT_APP_BACKEND_URL;
    const totalAmount =
      selectedSeats.length *
      parseFloat(localStorage.getItem("ticket_price") || 0);

    try {
      const response = await fetch(`${url}/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          seat_ids: seatIds,
          show_id: parseInt(show_id),
          total_amount: totalAmount,
        }),
      });

      if (!response.ok) throw new Error("Booking failed");

      const data = await response.json();
      if (data.success) {
        this.setState({ bookingSuccess: true });

        setTimeout(() => {
          this.props.navigate("/");
        }, 2500);
      }
    } catch (err) {
      console.error("Booking error", err);
      alert("Booking failed. Please try again.");
    }
  };

  renderSeatsByRows = () => {
    const { seats, selectedSeats } = this.state;

    const grouped = seats.reduce((acc, seat) => {
      const row = seat.row_label || "X";
      if (!acc[row]) acc[row] = [];
      acc[row].push(seat);
      return acc;
    }, {});

    return Object.entries(grouped).map(([row, rowSeats]) => (
      <div className="sl-row" key={`row-${row}`}>
        <span className="sl-row-label">{row}</span>
        <div className="sl-seat-row">
          {rowSeats.map((seat) => {
            const isSelected = selectedSeats.some(
              (s) => s.seat_id === seat.seat_id
            );
            const className = seat.is_booked
              ? "sl-seat booked"
              : isSelected
              ? "sl-seat selected"
              : "sl-seat";

            return (
              <div
                key={`seat-${seat.seat_id}`}
                className={className}
                onClick={() => this.toggleSeat(seat)}>
                {seat.seat_number}
              </div>
            );
          })}
        </div>
      </div>
    ));
  };

  render() {
    const { status, seats, selectedSeats, bookingSuccess } = this.state;
    const ticketPrice = parseFloat(localStorage.getItem("ticket_price")) || 0;

    return (
      <>
        <Header />
        <div className="sl-container">
          {status === "LOADING" && <LoadingScreen />}
          {status === "FAILURE" && (
            <p className="sl-error">Failed to load seat layout</p>
          )}
          {status === "SUCCESS" && (
            <>
              <h2 className="sl-heading">Select Your Seats</h2>

              <div className="sl-meta">
                <p>
                  <strong>Show ID:</strong> {this.props.params.show_id}
                </p>
                <p>
                  <strong>Total Seats:</strong> {seats.length}
                </p>
                <p>
                  <strong>Available:</strong>{" "}
                  {seats.filter((s) => !s.is_booked).length}
                </p>
              </div>

              <div className="sl-legend">
                <span className="sl-box available" /> Available
                <span className="sl-box selected" /> Selected
                <span className="sl-box booked" /> Booked
              </div>

              <div className="sl-screen">SCREEN</div>
              <div className="sl-layout">{this.renderSeatsByRows()}</div>

              {selectedSeats.length > 0 && (
                <div className="sl-footer">
                  <p>
                    Selected:{" "}
                    <strong>
                      {selectedSeats.map((s) => s.seat_number).join(", ")}
                    </strong>
                  </p>
                  <p>
                    Total:{" "}
                    <strong>
                      ₹{(selectedSeats.length * ticketPrice).toFixed(2)}
                    </strong>
                  </p>
                  <button
                    className="sl-confirm-btn"
                    onClick={this.handleBooking}>
                    Continue to Payment
                  </button>
                </div>
              )}
            </>
          )}

          {bookingSuccess && (
            <div className="sl-popup">
              <div className="sl-popup-content">
                <h3>🎉 Seats Booked Successfully!</h3>
                <p>Redirecting to Home...</p>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
}

export default withNavigation(SeatLayout);
