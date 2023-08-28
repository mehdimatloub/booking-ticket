import React, { useEffect, useState } from "react";
import axios from "axios";
import "./../../styles/style.css";
import NavBar from "../components/NavBar/index";
import MyBookingList from "../components/MyBookingList";

const MyBookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [currUser, setCurrUser] = useState({});

  useEffect(() => {
    // Parse the JSON string from local storage to get the user object
    const userFromLocalStorage = localStorage.getItem('currUser');
    if (userFromLocalStorage) {
      setCurrUser(JSON.parse(userFromLocalStorage));
    }
  }, []);

  useEffect(() => {
    async function fetchReservations() {
      try {
        const response = await axios.get("http://localhost:3000/carts");
        setBookings(
          response.data.filter(
            (cart) => cart.userId === currUser.id && cart.state === "confirmed"
          )
        );
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    }
  
    if (currUser.id) {
        fetchReservations();
    }
  }, [currUser.id]);

  return (
    <>
      {/* <NavBar /> */}
      <MyBookingList bookings={bookings} />
    </>
  );
};

export default MyBookingPage;
