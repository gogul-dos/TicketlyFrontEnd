import { Component } from "react";
import { Link } from "react-router-dom";
import withNavigation from "../../utils/withNavigation";
import logo from "../../images/logo.png";
import "./register.css";

class Register extends Component {
  state = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    mobile: "",
    errorMessage: "",
    isSubmitting: false,
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value, errorMessage: "" });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { navigate } = this.props;
    const {
      firstName,
      lastName,
      password,
      confirmPassword,
      dob,
      email,
      mobile,
    } = this.state;

    if (password !== confirmPassword) {
      this.setState({ errorMessage: "Passwords do not match!" });
      return;
    }

    this.setState({ isSubmitting: true });

    const formData = new URLSearchParams();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    formData.append("dob", dob);
    formData.append("email", email);
    formData.append("mobile", mobile);

    try {
      const response = await fetch(
        "http://localhost:8080/Ticketlybackend/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        }
      );

      if (response.ok) {
        const data = await response.json();
        alert(data.message || "Registered successfully!");
        this.setState({
          firstName: "",
          lastName: "",
          password: "",
          confirmPassword: "",
          dob: "",
          email: "",
          mobile: "",
          errorMessage: "",
        });
        navigate("/login");
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      this.setState({ errorMessage: "Registration failed. Please try again." });
    } finally {
      this.setState({ isSubmitting: false });
    }
  };

  renderInput = (id, type, name, value, label, icon, extraProps = {}) => {
    const inputProps = {
      id,
      type,
      name,
      value,
      onChange: this.handleChange,
      required: true,
      placeholder: " ",
      ...extraProps,
    };

    return (
      <div className="floating-input">
        <i className={`icon ${icon}`}></i>
        <input {...inputProps} />
        <label htmlFor={id}>{label}</label>
      </div>
    );
  };

  render() {
    const {
      firstName,
      lastName,
      password,
      confirmPassword,
      dob,
      email,
      mobile,
      errorMessage,
      isSubmitting,
    } = this.state;

    return (
      <div className="register-page">
        <div className="register-card">
          <img src={logo} alt="App Logo" className="register-logo" />
          <form className="register-form" onSubmit={this.handleSubmit}>
            <h2 className="register-title">Create Account</h2>

            <div className="row">
              {this.renderInput(
                "firstName",
                "text",
                "firstName",
                firstName,
                "First Name",
                "fas fa-user"
              )}
              {this.renderInput(
                "lastName",
                "text",
                "lastName",
                lastName,
                "Last Name",
                "fas fa-user"
              )}
            </div>

            {/* Here username and email were on same row causing gap if one removed.
                So split into two rows and add className="single" if only one input in row */}

            <div className="row single">
              {this.renderInput(
                "email",
                "email",
                "email",
                email,
                "Email",
                "fas fa-envelope"
              )}
            </div>

            <div className="row">
              {this.renderInput(
                "password",
                "password",
                "password",
                password,
                "Password",
                "fas fa-lock"
              )}
              {this.renderInput(
                "confirmPassword",
                "password",
                "confirmPassword",
                confirmPassword,
                "Confirm Password",
                "fas fa-lock"
              )}
            </div>

            <div className="row">
              {this.renderInput(
                "dob",
                "date",
                "dob",
                dob,
                "Date of Birth",
                "fas fa-calendar"
              )}
              {this.renderInput(
                "mobile",
                "tel",
                "mobile",
                mobile,
                "Mobile Number",
                "fas fa-phone",
                {
                  title: "Enter 10-digit number",
                  maxLength: 10,
                  pattern: "[0-9]{10}",
                }
              )}
            </div>

            {errorMessage && <p className="error-msg">{errorMessage}</p>}

            <button
              type="submit"
              className="register-btn"
              disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register"}
            </button>

            <p className="switch-text">
              Already have an account?{" "}
              <Link to="/login" className="switch-link">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    );
  }
}

export default withNavigation(Register);
