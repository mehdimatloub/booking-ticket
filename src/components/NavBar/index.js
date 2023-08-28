import Link from "next/link";
import Image from "next/image";
import classNames from "classnames";
import jwt from "jsonwebtoken";
import profile from "../../public/profile.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faShoppingCart,
  faTicket,
  faUserCircle,
  faSignOutAlt,
  faSignIn,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { getTokenFromLocalStorage } from "../../utils/token";
import axios from "axios";

const secretKey = process.env.SECRET_KEY || "nhpfeproject2023@07";

export default function NavBar () {
  const isConnected = getTokenFromLocalStorage() ? true : false;
  const [currUser, setCurrUser] = useState({});
  const [carts, setCarts] = useState([]);
  const navigation = [
    { name: "Home", icon: faHome, href: "/", current: true },
    ...(isConnected
      ? [
          {
            name: "My Cart",
            icon: faShoppingCart,
            href: "/CartPage",
            current: false,
          },
          {
            name: "My Bookings",
            icon: faTicket,
            href: "/MyBookingPage",
            current: false,
          },
          {
            name: `${
              currUser?.nom ? currUser.nom + " (My Profile)" : "User Profile"
            }`,
            icon: faUserCircle,
            href: "/Profile",
            current: false,
          },
          {
            name: "Logout",
            icon: faSignOutAlt,
            href: "/Logout",
            current: false,
          },
        ]
      : [
          { name: "Login", icon: faSignIn, href: "/Login", current: false },
          {
            name: "Sign up",
            icon: faUserPlus,
            href: "/Signup",
            current: false,
          },
        ]),
  ];


  useEffect(() => {
    const token = getTokenFromLocalStorage();
    if (token) {
      verifyToken(token);
    }
  }, []);

  
  useEffect(() => {
    function fetchCarts() {
      try {
        axios.get('http://localhost:3000/carts')
          .then((response) => {
            const filteredCarts = response.data.filter(cart => cart.userId === currUser.id && cart.state === "Pending");
            setCarts(filteredCarts);
            console.log(filteredCarts);
          });
      } catch (error) {
        console.error('Error fetching carts:', error);
      }
    }
  
    if (currUser) {
      fetchCarts();
    }
  }, [currUser]);
  

  const verifyToken = (token) => {
    try {
      // Decode the token to get the payload
      const decodedToken = jwt.decode(token, secretKey);

      if (decodedToken) {
        setCurrUser(decodedToken);
        localStorage.setItem("currUser", JSON.stringify(decodedToken));
      } else {
        setCurrUser(null);
        localStorage.removeItem("currUser");
      }
    } catch (error) {
      setCurrUser(null);
    }
  };

  return (
    <nav className="bg-gray-800">
      <div className="left top flex items-center">
        <Image
          src={profile}
          alt="Profile Image"
          width={200}
          height={200}
          objectFit="contain"
          priority={true}
        />
      </div>
      <div className="max-w-7xl flex justify-end px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="hidden md:flex items-center ml-3">
            <div className="flex items-center justify-end space-x-4">
              {navigation.map((item) => (
                <Link
                  href={item.href}
                  key={item.name}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "px-3 py-2 rounded-md text-sm font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  <FontAwesomeIcon icon={item.icon} /> {item.name}
                  {item.name === "My Cart" && (
                    <div className="relative inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full -top-2 -right-2 dark:border-gray-900">
                      {carts?.length || '0'}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};