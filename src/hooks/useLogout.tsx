import { useNavigate } from "react-router-dom";
import { api } from "helpers/api";
import { useCallback } from "react";

export default function useLogout() {
  const navigate = useNavigate();

  const logout = useCallback(async () => {
    const id = localStorage.getItem("id");
    localStorage.removeItem("token");
    navigate("/login");
    try {
      await api.put(`logout/${id}`, { status: "OFFLINE" });

      //clearing local storage
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Error logging out. Please try again.");
    }
  }, []);

  return logout;
}
