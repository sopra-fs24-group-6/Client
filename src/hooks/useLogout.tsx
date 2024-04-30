import { useNavigate } from "react-router-dom";
import { api } from "helpers/api";
import { useCallback } from "react";

export default function useLogout() {
  const navigate = useNavigate();

  const logout = useCallback(async () => {
    const userId = localStorage.getItem("userId");
    try {
      await api.put(`/logout`, { userId });

      //clearing local storage
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Error logging out. Please try again.");
    }
  }, []);

  return logout;
}
