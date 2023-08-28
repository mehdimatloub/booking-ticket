import React, { useEffect, useState } from "react";
import axios from "axios";
import "./../../styles/style.css";
import NavBar from "../components/NavBar/index";
import CartList from "../components/CartList";

const CartPage = () => {
  const [carts, setCarts] = useState([]);
  const [currUser, setCurrUser] = useState({});

  useEffect(() => {
    // Parse the JSON string from local storage to get the user object
    const userFromLocalStorage = localStorage.getItem('currUser');
    if (userFromLocalStorage) {
      setCurrUser(JSON.parse(userFromLocalStorage));
    }
  }, []);

  useEffect(() => {
    async function fetchCarts() {
      try {
        const response = await axios.get("http://localhost:3000/carts");
        setCarts(
          response.data.filter(
            (cart) => cart.userId === currUser.id && cart.state === "Pending"
          )
        );
      } catch (error) {
        console.error("Error fetching carts:", error);
      }
    }
  
    if (currUser.id) {
      fetchCarts();
    }
  }, [currUser.id]);
  

  return (
    <>
      {/* <NavBar /> */}
      <CartList carts={carts} />
    </>
  );
};

export default CartPage;
