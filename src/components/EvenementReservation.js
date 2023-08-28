import Image from "next/image";
import Head from "next/head";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChair,
  faPersonBooth,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";

export const EvenementReservation = ({
  currUser,
  itemId,
  eventDetails,
  categories,
  salles,
  villes,
  sieges,
  sessions,
}) => {
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedChairs, setSelectedChairs] = useState([]);
  const [selectedSession, setSelectedSession] = useState();
  const [selectedSessions, setSelectedSessions] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const handleRoomChange = (event) => {
    setSelectedRoom(event.target.value);
  };

  const handleSeatSelection = (event) => {
    const selectedSeatId = event.target.selectedOptions[0].id;
    const selectedSeatNumber = event.target.value;
    setTotalPrice((prevTotalPrice) => {
      const selectedSeatPrice = sieges.find((siege) => {
        siege.id === selectedSeatId;
        return siege;
      })?.prix;
      const newTotalPrice = prevTotalPrice + selectedSeatPrice;
      return parseFloat(newTotalPrice.toFixed(2));
    });

    // Assuming selectedChairs is a state variable managed by useState
    setSelectedChairs((prevSelectedChairs) => [
      ...prevSelectedChairs,
      { id: selectedSeatId, chair: selectedSeatNumber },
    ]);
  };

  const removeSelectedChair = (chairIdToRemove) => {
    setSelectedChairs((prevSelectedChairs) =>
      prevSelectedChairs.filter((chair) => chair.id !== chairIdToRemove)
    );
    setTotalPrice((prevTotalPrice) => {
      const selectedSeatPrice = sieges.find((siege) => {
        siege.id === chairIdToRemove;
        return siege;
      })?.prix;
      const newTotalPrice = prevTotalPrice - selectedSeatPrice;
      return parseFloat(newTotalPrice.toFixed(2));
    });
  };

  const sessionSelectedHandle = (event) => {
    const sessionId = parseInt(event.target.getAttribute("data-key"));
    const selectedSession = sessions.find((session) => session.id === sessionId);
    setSelectedSession(selectedSession);
  
    if (!selectedSessions.includes(selectedSession)) {
      setSelectedSessions((prevSelectedSessions) => [
        ...prevSelectedSessions,
        selectedSession,
      ]);
    } else {
      setSelectedSessions((prevSelectedSessions) =>
        prevSelectedSessions.filter((ses) => ses.id !== selectedSession.id)
      );
    }
  };

  const bookReservationHandle = async () => {
    try {
      
      if (!selectedRoom || selectedChairs.length === 0 || selectedSession.length === 0) {
        Swal.fire({
          title: "Incomplete Reservation",
          text: "Please select a room, at least one seat, and a valid session.",
          icon: "warning",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        });
        return;
      }
      
      const reservationData = {
        userId: currUser.id,
        eventId: itemId,
        sessions: selectedSessions.map(session => session.id).join(","),
        salles: selectedSessions
          .map(
            (session) =>
              salles.find(
                (salle) =>
                  salle.id ==
                  session?.salleId
              )?.id
          )
          .join(","),
        sieges: selectedChairs.map((chair) => chair.id).join(","), // Combine selected chair numbers
        totalPrice,
        state: "Pending",
      };
      console.log(reservationData);
      const response = await axios.post(
        "http://localhost:3000/carts/",
        reservationData
      );

      if (response.status === 201) {
        Swal.fire({
          title: "Reservation Successful",
          text: "Your reservation has been booked successfully!",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        });
        reservationTogglePopup();
        setSelectedRoom("");
        setSelectedChairs([]);
        setTotalPrice(0);
        setSelectedSession();
        window.location.reload();
      } else {
        Swal.fire({
          title: "Reservation Failed",
          text: "An error occurred while booking your reservation. Please try again later.",
          icon: "error",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error booking reservation:", error);
      Swal.fire({
        title: "Reservation Failed",
        text: "An error occurred while booking your reservation. Please try again later.",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    }
  };

  const reservationTogglePopup = () => {
    const currUser = JSON.parse(localStorage.getItem("currUser"));
    console.log(currUser);
    if (currUser) {
      var popup = document.getElementById(`popup${itemId}`);
      popup?.classList.add("hidden");
      var reservationPopup = document.getElementById(
        `reservationPopup${itemId}`
      );
      reservationPopup?.classList.toggle("hidden");
    } else {
      Swal.fire({
        title: "You are not logged in!",
        text: "You won't be able to consume this service!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Log In?",
        cancelButtonText: "Close",
      }).then((result) => {
        if (result.isConfirmed) {
          setTimeout(() => {
            router.push("/Login");
          }, 2000);
        }
      });
    }
  };
  
  return (
    <>
      {/* <!-- Reservation PopUp --> */}
      <div
        key={`reservationPopup${itemId}`}
        id={`reservationPopup${itemId}`}
        className="h-screen z-10 fixed inset-0 flex items-center justify-center hidden"
      >
        <div
          className="absolute inset-0 bg-gray-800 opacity-75"
          onClick={reservationTogglePopup}
        ></div>
        <div
          className="z-10 min-w-screen min-h-screenflex items-center justify-center"
          style={{ width: "90%" }}
        >
          {/* <!-- component --> */}
          <div className="bg-gray-100 text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden">
            <div className="md:flex w-full">
              <div className="md:block w-1/2">
                <Image
                  width={600}
                  height={400}
                  src={eventDetails.imageUrl}
                  alt={eventDetails.title}
                  className="h-32 w-full object-cover md:h-full"
                />
              </div>
              <div className="w-full md:w-1/2 py-10 px-5 md:px-10">
                <div className="flex justify-end items-center ">
                  <svg
                    onClick={reservationTogglePopup}
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-8 h-8 cursor-pointer"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5"
                        stroke="#000000"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      ></path>{" "}
                      <path
                        d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7"
                        stroke="#000000"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      ></path>{" "}
                    </g>
                  </svg>
                </div>
                <div className="text-center mb-10">
                  <h1 className="font-bold text-3xl text-gray-900">
                    {eventDetails.title} <br />{" "}
                    <span className="p-1 text-lg">
                      <FontAwesomeIcon icon={faCalendarDays} className="pr-1" />
                      {eventDetails.date}
                    </span>
                  </h1>
                </div>
                <div>
                  <p className="text-xl pb-2">
                    Enter your information to book now !
                  </p>
                  <div className="flex -mx-3">
                    <div className="w-full px-3 mb-5">
                      <label
                        for="salles"
                        className="text-xs font-semibold px-1"
                      >
                        Available Rooms :
                      </label>
                      <div className="flex">
                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                          <FontAwesomeIcon
                            icon={faPersonBooth}
                            className=" text-gray-400 text-lg"
                          />
                        </div>
                        <select
                          id="salles"
                          className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-green-500"
                          value={selectedRoom}
                          onChange={handleRoomChange}
                        >
                          <option value="" disabled selected>
                            Choose a room
                          </option>
                          {salles.map((salle) => (
                            <option
                              key={salle.id}
                              id={salle.id}
                              value={salle.nom}
                            >
                              {salle.nom}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="flex mx-3 my-4 flex-wrap justify-start">
                    <div className="w-full pl-4 pb-2">
                      {selectedRoom &&
                        sessions
                          ?.filter(
                            (session) =>
                              session.salleId ===
                              salles.find((salle) => salle.nom === selectedRoom)
                                ?.id
                          )
                          .map((session) => (
                            <span
                              key={session.id}
                              data-key={session.id}
                              onClick={sessionSelectedHandle}
                              className={`cursor-pointer text-xs font-medium mr-2 px-3 py-2 rounded transition-colors duration-300 ${
                                selectedSessions.includes(session)
                                  ? "bg-blue-600 text-white"
                                  : "bg-green-600 hover:bg-green-700 text-green-100"
                              }`}
                            >
                              {`From ${session.heure_debut} To ${session.heure_fin}`}
                            </span>
                          ))}
                    </div>
                  </div>

                  <div className="flex -mx-3">
                    <div className="w-full px-3 mb-5">
                      <label
                        for="salles"
                        className="text-xs font-semibold px-1"
                      >
                        Available Seats in The Room{" "}
                        {selectedRoom
                          ? " Named " + selectedRoom
                          : "you selected"}{" "}
                        {
                          sieges.filter(
                            (siege) =>
                              siege.statut === "Disponible" &&
                              siege.salleId ===
                                salles.find(
                                  (salle) => salle.nom === selectedRoom
                                )?.id
                          ).length
                        }{" "}
                        Seats :
                      </label>

                      <div className="flex">
                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                          <FontAwesomeIcon
                            icon={faChair}
                            className=" text-gray-400 text-lg"
                          />
                        </div>
                        <select
                          id="sieges"
                          className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                          onChange={handleSeatSelection}
                        >
                          <option selected>Choose a seat</option>
                          {sieges
                            .filter(
                              (siege) =>
                                siege.statut === "Disponible" &&
                                siege.salleId ===
                                  salles.find(
                                    (salle) => salle.nom === selectedRoom
                                  )?.id
                            )
                            .map((siege) => (
                              <option
                                key={siege.id}
                                id={siege.id}
                                value={siege.numero}
                              >
                                N° {siege.numero}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="flex mx-3 my-4 flex-wrap justify-start">
                    {selectedChairs.length > 0 &&
                      selectedChairs.map((chair) => (
                        <span
                          key={chair.id}
                          id={chair.id}
                          class="inline-flex items-center px-2 py-1 m-2 text-sm font-medium text-green-800 bg-green-300 rounded"
                        >
                          {
                            salles.find(
                              (salle) =>
                                salle.id ==
                                sieges.find((siege) => siege.id == chair.id)
                                  ?.salleId
                            )?.nom
                          }{" "}
                          - Seat N°{chair.chair}
                          <button
                            type="button"
                            class="inline-flex items-center p-1 ml-2 text-sm text-green-400 bg-transparent rounded-sm hover:bg-green-200 hover:text-green-900 dark:hover:bg-green-800 dark:hover:text-green-300"
                            onClick={() => removeSelectedChair(chair.id)}
                            aria-label="Remove"
                          >
                            <svg
                              class="w-2 h-2"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 14 14"
                            >
                              <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                              />
                            </svg>
                            <span class="sr-only">Remove badge</span>
                          </button>
                        </span>
                      ))}
                  </div>
                  <div className="flex flex-row -mx-3">
                    <div className="w-full flex items-center justify-end px-3 mb-5">
                      <h1 class="font-semibold text-xl">Total Price : </h1>
                      <p class="p-2">
                        <span className="text-2xl font-semibold">
                          {totalPrice.toFixed(2)}
                        </span>
                        <span class="text-gray-400 align-bottom">MAD </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex -mx-3">
                    <div className="w-full flex justify-center items-center px-3 my-5">
                      <button
                        className="block mx-4 bg-green-500 hover:bg-green-700 hover:outline-2 focus:bg-green-700 text-white rounded-lg px-3 py-3 font-semibold"
                        onClick={bookReservationHandle}
                      >
                        Book Now !
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
