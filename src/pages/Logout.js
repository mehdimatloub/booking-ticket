// Logout.js
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    // Clear the token from local storage on component mount
    localStorage.removeItem("currUser");
    localStorage.removeItem("token");
    // Redirect to the login page or any other page after logout
    router.push("/");
  }, []);

  return null; // This component doesn't need to render anything
}