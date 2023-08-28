import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaypal } from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";
import { faThumbsUp, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import CartDetails from "./cartDetails";
import Swal from "sweetalert2";

const CartCard = ({ cart }) => {
  const [category, setCategory] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [ville, setVille] = useState([]);
  const [sieges, setSieges] = useState([]);
  const [salles, setSalles] = useState([]);
  const [event, setEvent] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    axios
      .get("http://localhost:3000/evenements")
      .then((response) => {
        const filteredEvent = response.data.find((event) => {
          return event.id === cart.eventId;
        });
        setEvent(filteredEvent);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [cart]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/villes")
      .then((response) => {
        const filteredVille = response.data.find((ville) => {
          return ville.id === event.villeId;
        });
        setVille(filteredVille);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [event]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/categories")
      .then((response) => {
        const filteredCategory = response.data.find((category) => {
          return category.id === event?.category;
        });
        setCategory(filteredCategory);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [event]);

  useEffect(() => {
    const sessionsId = cart.sessions.split(",");
    setSessions([]);
    sessionsId.forEach((sessionId) => {
      axios
        .get(`http://localhost:3000/sessions/${sessionId}`)
        .then((response) => {
          setSessions((previousValues) => [...previousValues, response.data]);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    });
  }, [cart]);

  useEffect(() => {
    const sallesId = cart.salles.split(",");
    setSalles([]);
    sallesId.forEach((salleId) => {
      axios
        .get(`http://localhost:3000/salles/${salleId}`)
        .then((response) => {
          setSalles((previousValues) => [...previousValues, response.data]);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    });
  }, [cart]);

  useEffect(() => {
    // Create an array of promises for each salle's sieges
    const siegesId = cart.sieges.split(",");
    setSieges([]);
    siegesId.forEach((siegeId) => {
      axios
        .get(`http://localhost:3000/sieges/${siegeId}`)
        .then((response) => {
          setSieges((previousValues) => [...previousValues, response.data]);
          console.log(`http://localhost:3000/sieges/${siegeId}`)
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    });
  }, [cart]);

  const togglePopup = () => {
    var popup = document.getElementById(`popup${cart.id}`);
    popup?.classList.toggle("hidden");
  };

  return (
    <>
      <div
        key={cart.id}
        onClick={togglePopup}
        className="w-full flex items-center div-2 py-6 hover:bg-gray-100 hover:rounded-md hover:border hover:border-gray-100 hover:cursor-pointer"
      >
        {event ? (
          <>
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
              {event.imageUrl ? (
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  width={600}
                  height={400}
                  className="h-full w-full object-cover object-center"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="../../assets/no-image.png"
                  alt="No Photo was available"
                  className="h-full w-full object-cover object-center"
                  width="600"
                  height="400"
                />
              )}
            </div>
            <div className="ml-4 flex flex-1 flex-col">
              <div>
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <h3>
                    <a>{event.title}</a>
                  </h3>
                  <div className="ml-4">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "MAD",
                      minimumFractionDigits: 2,
                    }).format(cart.totalPrice)}
                  </div>
                </div>
                <div className="mt-1 text-sm text-gray-500 font-medium">
                  {category?.category || "Info Not Provided"}
                </div>
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <div className="mt-1 text-sm text-gray-500">{ville?.ville}</div>
                  <div className="text-gray-500">
                    Qty {cart.sieges.split(",").length || "Info Not Provided"}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div>No Booking are existed</div>
        )}
      </div>
      {cart && (
        <CartDetails
          cart={cart}
          event={event}
          ville={ville}
          category={category}
          salles={salles}
          sessions={sessions}
          sieges={sieges}
        />
      )}
    </>
  );
};

export default CartCard;
