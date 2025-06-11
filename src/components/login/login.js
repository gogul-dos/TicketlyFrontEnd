import { Component } from "react";
import { Link } from "react-router-dom";
import withNavigation from "../../utils/withNavigation";
import logo from "../../images/logo.png";
import "./login.css";

class Login extends Component {
  state = {
    email: "",
    password: "",
    showPassword: false,
    errorMessage: "",
    isSubmitting: false,
  };

  emailChanged = (e) => {
    this.setState({ email: e.target.value });
  };

  passwordChanged = (e) => {
    this.setState({ password: e.target.value });
  };

  loginFormSubmitted = (e) => {
    e.preventDefault();
    const { navigate } = this.props;
    const { email, password } = this.state;

    this.setState({ isSubmitting: true });

    const formData = new URLSearchParams();
    formData.append("email", email);
    formData.append("password", password);
    fetch("http://localhost:8080/Ticketlybackend/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: formData.toString(),
  credentials: "include",
})
  .then(async (res) => {
    const data = await res.json();
    if (res.ok) {
      if (data.success) {
        this.setState({
          email: "",
          password: "",
          errorMessage: "",
          isSubmitting: false,
        });
        navigate("/");
      } else {
        this.setState({ errorMessage: data.message, isSubmitting: false });
      }
    } else {
      this.setState({ errorMessage: data.message, isSubmitting: false });
    }
  })
  .catch((err) => {
    console.error("Fetch error:", err);
    this.setState({
      errorMessage: "Network error. Please try again.",
      isSubmitting: false,
    });
  });

  };

  render() {
    const { email, password, showPassword, errorMessage, isSubmitting } =
      this.state;

    return (
      <div className="login-container">
        <div className="login-inner-container">
          <img src={logo} alt="Ticketly Logo" className="login-logo" />
          <form
            className="login-form-container"
            onSubmit={this.loginFormSubmitted}>
            <h2 className="form-title">Welcome Back</h2>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <div className="input-group">
              <input
                type="email"
                id="email"
                value={email}
                onChange={this.emailChanged}
                required
                placeholder=" "
              />
              <label htmlFor="email">Email</label>
            </div>

            <div className="input-group password-group">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={this.passwordChanged}
                required
                placeholder=" "
              />
              <label htmlFor="password">Password</label>
              <span
                className="toggle-password"
                onClick={() => this.setState({ showPassword: !showPassword })}>
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </button>

            <p className="toggle-form-text">
              Don't have an account?{" "}
              <Link to="/register" className="toggle-link">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    );
  }
}

export default withNavigation(Login);
