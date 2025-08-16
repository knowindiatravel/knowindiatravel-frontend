import React, { useState, useEffect, useRef, forwardRef } from "react";
import Dropdown from "./Dropdown";
import SearchBar from "./SearchBar";
import Login from "./Login";
import MenuBar from "./MenuBar";
import Clock from "../Clock/Clock";
import Popup from "../Popup/Popup";
import MenuBarPopup from "../Popup/MenuBarPopup";
import DestinationsPopup from "../Popup/DestinationsPopup";
import AboutUsPopup from "../Popup/AboutUsPopup";
import PlanYourTripPopup from "../Popup/PlanYourTripPopup";
import LoginPopup from "../LoginPopup/LoginPopup";
import { Link } from "react-router-dom";
import "./styles.css";

const Navbar = () => {
  const [activePopup, setActivePopup] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [shouldReopenMenuBar, setShouldReopenMenuBar] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const popupRefs = useRef({});
  const dropdownButtonsRef = useRef([]);
  const loginButtonRef = useRef(null);

  // Handle clicks outside popups
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!activePopup && !isLoginPopupOpen) return;

      const clickedInsidePopup = Object.values(popupRefs.current).some(
        (ref) => ref && ref.contains(event.target)
      );

      const clickedOnDropdownButton = dropdownButtonsRef.current.some(
        (button) => button && button.contains(event.target)
      );

      const clickedOnLoginButton =
        loginButtonRef.current && loginButtonRef.current.contains(event.target);

      if (!clickedInsidePopup && !clickedOnDropdownButton && !clickedOnLoginButton) {
        if (isLoginPopupOpen) closeLoginPopup();
        else if (activePopup) closePopup();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activePopup, isLoginPopupOpen]);

  const openPopup = (popupName) => {
    if (isLoginPopupOpen) closeLoginPopup();
    setActivePopup(popupName);
  };

  const closePopup = (forceCloseAll = false) => {
    if (!forceCloseAll && isMobile && shouldReopenMenuBar) {
      setActivePopup("MenuBar");
      setShouldReopenMenuBar(false);
    } else {
      setActivePopup(null);
      setShouldReopenMenuBar(false);
    }
  };

  const handleDropdownClick = (popupName) => {
    closePopup(true);
    openPopup(popupName);
  };

  const openLoginPopup = () => {
    if (activePopup) closePopup();
    setIsLoginPopupOpen(true);
  };

  const closeLoginPopup = () => {
    setIsLoginPopupOpen(false);
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    const handleScroll = () => setScrolled(window.scrollY > 10);

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    dropdownButtonsRef.current = Array.from(
      document.querySelectorAll(".dropdown-button, .menu-bar-button, .login-button")
    );

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const setPopupRef = (name, ref) => {
    if (ref) popupRefs.current[name] = ref;
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="logo-link">
            <span className="logo" style={{ textDecoration: "none" }}>
              <span className="logo-highlight">Know</span>IndiaTravel
            </span>
          </Link>
        </div>

        {!isMobile && (
          <div className="navbar-middle">
            <Dropdown
              title="Destinations"
              isOpen={activePopup === "Destinations"}
              onOpen={() => openPopup("Destinations")}
              onClose={closePopup}
              ref={(ref) => (dropdownButtonsRef.current[0] = ref)}
            />
            <Dropdown
              title="About Us"
              isOpen={activePopup === "AboutUs"}
              onOpen={() => openPopup("AboutUs")}
              onClose={closePopup}
              ref={(ref) => (dropdownButtonsRef.current[1] = ref)}
            />
            <Dropdown
              title="Plan Your Trip"
              isOpen={activePopup === "Plan Your Trip"}
              onOpen={() => openPopup("Plan Your Trip")}
              onClose={closePopup}
              ref={(ref) => (dropdownButtonsRef.current[2] = ref)}
            />
          </div>
        )}

        <div className="navbar-right">
          {!isMobile && <Clock />}
          <SearchBar isMobile={isMobile} />
          <Login
            onClick={openLoginPopup}
            isMobile={isMobile}
            ref={(ref) => {
              dropdownButtonsRef.current[3] = ref;
              loginButtonRef.current = ref;
            }}
          />
          <MenuBar
            onOpen={() => openPopup("MenuBar")}
            ref={(ref) => (dropdownButtonsRef.current[4] = ref)}
          />
          {!isMobile && (
            <Link to="/AdminLogin" className="admin-link">
              <span className="admin-icon">⚙</span>
              <span className="admin-text">Admin</span>
            </Link>
          )}
        </div>
      </div>

      {/* Popups */}
      {activePopup === "MenuBar" && (
        <Popup title="Menu" onClose={closePopup} ref={(ref) => setPopupRef("MenuBar", ref)}>
          <MenuBarPopup
            isMobile={isMobile}
            onOpenDestinations={() => handleDropdownClick("Destinations")}
            onOpenAboutUs={() => handleDropdownClick("AboutUs")}
            onOpenPlanYourTrip={() => handleDropdownClick("Plan Your Trip")}
            onOpenLogin={openLoginPopup}
          />
        </Popup>
      )}

      {activePopup === "Destinations" && (
        <Popup
          title="Destinations"
          onClose={closePopup}
          ref={(ref) => setPopupRef("Destinations", ref)}
          className="wide-popup"
        >
          <DestinationsPopup onClose={() => closePopup(true)} />
        </Popup>
      )}

      {activePopup === "AboutUs" && (
        <Popup title="About Us" onClose={closePopup} ref={(ref) => setPopupRef("AboutUs", ref)}>
          <AboutUsPopup handleDropdownClick={handleDropdownClick} onClose={() => closePopup(true)} />
        </Popup>
      )}

      {activePopup === "Plan Your Trip" && (
        <Popup
          title="Plan Your Trip"
          onClose={closePopup}
          ref={(ref) => setPopupRef("PlanYourTrip", ref)}
          className="extra-wide-popup"
        >
          <PlanYourTripPopup />
        </Popup>
      )}

      {isLoginPopupOpen && <LoginPopup onClose={closeLoginPopup} ref={(ref) => setPopupRef("LoginPopup", ref)} />}
    </nav>
  );
};

export default Navbar;
