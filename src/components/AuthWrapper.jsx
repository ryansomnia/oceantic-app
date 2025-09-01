"use client";

import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export default function AuthWrapper({ children }) {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        if (decoded.exp < now) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      } catch (err) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  }, []);

  return <>{children}</>;
}
