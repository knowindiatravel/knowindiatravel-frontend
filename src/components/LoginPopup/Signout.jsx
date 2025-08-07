import React from "react";
import { createClient } from "@supabase/supabase-js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSignOutAlt } from "react-icons/fa";
import "./Signout.css"; // Create this CSS file

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(url, key);

const Signout = () => {
  const handleSignOut = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error(error.message);
    } else {
      localStorage.removeItem("auth.session");
      localStorage.removeItem("user.image");
      localStorage.removeItem("admin.email");
      window.location.reload();
    }
  };

  return (
    <div className="signout-container">
      <button onClick={handleSignOut} className="signout-button">
        <FaSignOutAlt className="signout-icon" />
        <span className="signout-text">Sign Out</span>
      </button>
    </div>
  );
};

export default Signout;
