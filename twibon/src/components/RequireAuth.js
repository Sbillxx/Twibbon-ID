import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

function RequireAuth({ children }) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    async function checkLogin() {
      try {
        const res = await fetch(`${API_URL}/api/auth/check`,  {
          credentials: "include",
        });
        const data = await res.json();
        if (data.loggedIn) {
          localStorage.setItem("admin_logged_in", "true");
          setLoggedIn(true);
        } else {
          localStorage.removeItem("admin_logged_in");
          setLoggedIn(false);
          navigate("/!/admin-login", { replace: true });
        }
      } catch {
        localStorage.removeItem("admin_logged_in");
        setLoggedIn(false);
        navigate("/!/admin-login", { replace: true });
      } finally {
        setChecking(false);
      }
    }
    checkLogin();
    // eslint-disable-next-line
  }, [navigate]);

  if (checking)
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Spinner size={56} />
      </div>
    );
  if (!loggedIn) return null;
  return children;
}

export default RequireAuth;
