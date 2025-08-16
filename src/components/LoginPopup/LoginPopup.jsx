import React, { useState, forwardRef } from "react";
import { FaTimes, FaUserAlt, FaLock, FaEnvelope } from "react-icons/fa";
import "./LoginPopup.css";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { createClient } from "@supabase/supabase-js";
import Signout from "./Signout";
import GoogleAuth from "./GoogleAuth";
import FacebookAuth from "./FacebookAuth";

// Country list with codes
const countriesList = [
  { label: "India", code: "+91" },
  { label: "United States", code: "+1" },
  { label: "United Kingdom", code: "+44" },
  { label: "Canada", code: "+1" },
  { label: "Australia", code: "+61" },
  { label: "Germany", code: "+49" },
  { label: "France", code: "+33" },
  { label: "Japan", code: "+81" },
  { label: "Brazil", code: "+55" },
  { label: "China", code: "+86" },
  { label: "Russia", code: "+7" },
  { label: "South Africa", code: "+27" },
  { label: "Mexico", code: "+52" },
  { label: "Italy", code: "+39" },
  { label: "Spain", code: "+34" },
  { label: "Netherlands", code: "+31" },
  { label: "Sweden", code: "+46" },
  { label: "Norway", code: "+47" },
  { label: "Denmark", code: "+45" },
  { label: "Finland", code: "+358" },
  { label: "Belgium", code: "+32" },
  { label: "Switzerland", code: "+41" },
  { label: "Austria", code: "+43" },
  { label: "Ireland", code: "+353" },
  { label: "Portugal", code: "+351" },
  { label: "Poland", code: "+48" },
  { label: "Czech Republic", code: "+420" },
  { label: "Hungary", code: "+36" },
  { label: "Greece", code: "+30" },
  { label: "Turkey", code: "+90" },
  { label: "Egypt", code: "+20" },
  { label: "Saudi Arabia", code: "+966" },
  { label: "UAE", code: "+971" },
  { label: "Pakistan", code: "+92" },
  { label: "Bangladesh", code: "+880" },
  { label: "Sri Lanka", code: "+94" },
  { label: "Nepal", code: "+977" },
  { label: "Singapore", code: "+65" },
  { label: "Malaysia", code: "+60" },
  { label: "Thailand", code: "+66" },
  { label: "Indonesia", code: "+62" },
  { label: "Philippines", code: "+63" },
  { label: "Vietnam", code: "+84" },
  { label: "South Korea", code: "+82" },
  { label: "New Zealand", code: "+64" },
  { label: "Argentina", code: "+54" },
  { label: "Chile", code: "+56" },
  { label: "Colombia", code: "+57" },
  { label: "Peru", code: "+51" },
  { label: "Venezuela", code: "+58" },
  { label: "Morocco", code: "+212" },
  { label: "Nigeria", code: "+234" },
  { label: "Kenya", code: "+254" },
  { label: "Israel", code: "+972" },
  { label: "Jordan", code: "+962" },
  { label: "Lebanon", code: "+961" },
  { label: "Iraq", code: "+964" },
  { label: "Kuwait", code: "+965" },
  { label: "Qatar", code: "+974" },
];

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

const LoginPopup = forwardRef(({ onClose }, ref) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    Pass: "",
    country: "",
    phone: "",
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [value, setValue] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (
      !["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
        file.type
      )
    ) {
      alert("Only JPG, PNG, or WEBP images allowed.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be smaller than 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => setFormData({ ...formData, image: reader.result });
  };

  const validateSignup = () => {
    const errs = {};
    const { username, email, password, Pass, country, phone } = formData;

    if (
      !username ||
      username.length < 3 ||
      username.length > 50 ||
      !/^[a-zA-Z\s]+$/.test(username)
    )
      errs.username = "Use 3–50 letters and spaces only.";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Invalid email format.";
    if (
      !password ||
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[!@#$%^&*]/.test(password)
    )
      errs.password =
        "Password must be 8+ chars, upper, lower, number & special char.";
    if (password !== Pass) errs.Pass = "Passwords do not match.";
    if (!country) errs.country = "Please select a country.";
    if (!phone || !/^\+?[0-9]{7,15}$/.test(phone))
      errs.phone = "Invalid phone number.";

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    formData.phone = value;

    if (!isLoginView) {
      // SIGNUP
      const validationErrors = validateSignup();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        alert("Please fix the errors before submitting.");
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        });
        const result = await res.json();

        if (result.success) {
          alert("✅ Check your email to verify your account.");
          setIsLoginView(true);
          setFormData({
            username: "",
            email: "",
            password: "",
            Pass: "",
            country: "",
            phone: "",
            image: null,
          });
        } else {
          alert(`❌ ${result.message}`);
        }
      } catch (err) {
        alert("⚠️ Internal error. Please try again later.");
      }
    } else {
      // LOGIN
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        });
        const result = await res.json();

        if (!result.sess) {
          alert(`❌ ${result.message}`);
        } else {
          localStorage.setItem("auth.session", JSON.stringify(result.sess));
          const { data, error } = await supabase.auth.setSession({
            access_token: result.sess.access_token,
            refresh_token: result.sess.refresh_token,
          });
          if (data) {
            localStorage.setItem("user.image", result.message);
            alert("✅ Logged in successfully!");
            window.location.reload();
          } else {
            alert(`⚠️ ${error.message}`);
          }
        }
      } catch (err) {
        alert("⚠️ Internal problem. Please try again.");
      }
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setErrors({});
  };

  const handlePopupClick = (e) => e.stopPropagation();

  return (
    <div className="login-popup-overlay" onClick={onClose}>
      {localStorage.getItem("user.image") ? (
        <div
          className="login-popup-container"
          ref={ref}
          onClick={handlePopupClick}
        >
          <Signout />
        </div>
      ) : (
        <div
          className="login-popup-container"
          ref={ref}
          onClick={handlePopupClick}
        >
          <div className={`login-popup ${isLoginView ? "login-view" : ""}`}>
            <button className="close-button" onClick={onClose}>
              <FaTimes />
            </button>
            <div className="popup-header">
              <h2>{isLoginView ? "Sign In" : "Sign Up"}</h2>
              <p>
                {isLoginView ? "Access your account" : "Create a new account"}
              </p>
            </div>
            <form className="login-form" onSubmit={handleSubmit}>
              {!isLoginView && (
                <div className="form-grid">
                  <div className="input-group">
                    <FaUserAlt className="input-icon" />
                    <input
                      type="text"
                      name="username"
                      placeholder="Full Name"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={errors.username ? "error" : ""}
                    />
                    {errors.username && (
                      <span className="error-message">{errors.username}</span>
                    )}
                  </div>
                  <div className="input-group">
                    <FaEnvelope className="input-icon" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? "error" : ""}
                    />
                    {errors.email && (
                      <span className="error-message">{errors.email}</span>
                    )}
                  </div>
                  <div className="input-group">
                    <FaLock className="input-icon" />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={errors.password ? "error" : ""}
                    />
                    {errors.password && (
                      <span className="error-message">{errors.password}</span>
                    )}
                  </div>
                  <div className="input-group">
                    <FaLock className="input-icon" />
                    <input
                      type="password"
                      name="Pass"
                      placeholder="Confirm Password"
                      value={formData.Pass}
                      onChange={handleInputChange}
                      className={errors.Pass ? "error" : ""}
                    />
                    {errors.Pass && (
                      <span className="error-message">{errors.Pass}</span>
                    )}
                  </div>
                  <div className="input-group">
                    <label>Country</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={(e) => {
                        handleInputChange(e);
                        const selected = countriesList.find(
                          (c) => c.label === e.target.value
                        );
                        if (selected) setValue(selected.code);
                      }}
                      className={errors.country ? "error" : ""}
                    >
                      <option value="">Select country</option>
                      {countriesList.map((c, i) => (
                        <option key={i} value={c.label}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                    {errors.country && (
                      <span className="error-message">{errors.country}</span>
                    )}
                  </div>
                  <div className="input-group">
                    <label>Phone</label>
                    <PhoneInput
                      placeholder="Enter phone number"
                      value={value}
                      onChange={setValue}
                      className={errors.phone ? "error" : ""}
                    />
                    {errors.phone && (
                      <span className="error-message">{errors.phone}</span>
                    )}
                  </div>
                  <div className="input-group">
                    <label>Profile Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
              )}

              {isLoginView && (
                <div className="login-simple">
                  <div className="input-group">
                    <FaEnvelope className="input-icon" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="input-group">
                    <FaLock className="input-icon" />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-options">
                    <label>
                      <input type="checkbox" /> Remember me
                    </label>
                    <a href="/Update">Forgot password?</a>
                  </div>
                </div>
              )}

              <button type="submit" className="submit-btn">
                {isLoginView ? "Sign In" : "Sign Up"}
              </button>
            </form>

            {isLoginView && (
              <div className="social-login">
                <p>Or continue with</p>
                <div className="social-icons">
                  <GoogleAuth />
                  <FacebookAuth />
                </div>
              </div>
            )}

            <div className="register-cta">
              {isLoginView
                ? "Don't have an account? "
                : "Already have an account? "}
              <button className="toggle-button" onClick={toggleView}>
                {isLoginView ? "Sign up" : "Sign in"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

LoginPopup.displayName = "LoginPopup";
export default LoginPopup;
