import Image from "next/image";
import Head from "next/head";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { EvenementDetails } from "./EvenementDetails";

const EvenementCard = ({ item }) => {
  const [categories, setCategories] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [villes, setVilles] = useState([]);
  const [sieges, setSieges] = useState([]);
  const [salles, setSalles] = useState([]);
  const router = useRouter();
  const [eventDetails, setEventDetails] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/villes")
      .then((response) => {
        setVilles(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3000/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3000/sessions")
      .then((response) => {
        const filteredSessions = response.data.flatMap((session) => {
          if (session.evenementId === item.id) {
            return session;
          }
          return [];
        });
        setSessions(filteredSessions);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3000/salles")
      .then((response) => {
        const filteredSalles = response.data.flatMap((salle) => {
          if (sessions.find((session) => session.salleId === salle.id)) {
            return salle;
          }
          return [];
        });
        setSalles(filteredSalles);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [sessions, item.id]);

  useEffect(() => {
    // Create an array of promises for each salle's sieges
    axios
      .get("http://localhost:3000/sieges")
      .then((response) => {
        const filteredSieges = response.data.flatMap((siege) => {
          if (salles.find((salle) => salle.id === siege.salleId)) {
            return siege;
          }
          return [];
        });
        setSieges(filteredSieges);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [salles]);

  const togglePopup = () => {
    var popup = document.getElementById(`popup${item.id}`);
    popup?.classList.toggle("hidden");
    setEventDetails(item);
  };

  const reservationTogglePopup = () => {
    const currUser = localStorage.getItem("currUser");
    if (currUser) {
      var popup = document.getElementById("popup");
      popup?.classList.add("hidden");
      var reservationPopup = document.getElementById("reservationPopup");
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
      <div
        key={item.id}
        onClick={togglePopup}
        className="cursor-pointer relative inline-block duration-300 ease-in-out transition-transform transform hover:-translate-y-2 w-full"
      >
        <div className="shadow p-4 rounded-lg bg-white">
          <div className="flex justify-center relative rounded-lg overflow-hidden h-52">
            <div className="transition-transform duration-500 transform ease-in-out hover:scale-110 w-full">
              <div className="absolute inset-0 bg-black opacity-1">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  width={600}
                  height={400}
                />
              </div>
            </div>

            <div className="absolute flex justify-center bottom-0 mb-3">
              <div className="flex bg-white px-4 py-1 space-x-5 rounded-lg overflow-hidden shadow">
                <p className="flex items-center font-medium text-gray-800">
                  {salles.some((salle) => salle.etat === "Disponible")
                    ? "Disponible"
                    : "Réservée"}
                </p>
              </div>
            </div>
            <span className="absolute top-0 left-0 inline-flex mt-3 ml-3 px-3 py-2 rounded-lg z-10 bg-green-500 text-sm font-medium text-white select-none">
              {
                categories.find((category) => category.id === item.category)
                  ?.category
              }
            </span>
          </div>

          <div className="mt-4">
            <h2
              className="font-medium text-base md:text-lg text-gray-800 line-clamp-1"
              title="New York"
            >
              {item.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 grid-rows-2 gap-4 mt-8">
            <p className="inline-flex flex-col xl:flex-row xl:items-center text-gray-800">
              <svg
                className="inline-block w-5 h-5 xl:w-4 xl:h-4 mr-3"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.2848 18.9935C12.1567 19.0875 12.0373 19.1728 11.9282 19.2493C11.8118 19.1721 11.6827 19.0833 11.5427 18.9832C10.8826 18.5109 10.0265 17.8176 9.18338 16.9529C7.45402 15.1792 6 12.9151 6 10.5C6 7.18629 8.68629 4.5 12 4.5C15.3137 4.5 18 7.18629 18 10.5C18 12.8892 16.4819 15.1468 14.6893 16.9393C13.8196 17.8091 12.9444 18.5099 12.2848 18.9935ZM19.5 10.5C19.5 16.5 12 21 12 21C11.625 21 4.5 16.5 4.5 10.5C4.5 6.35786 7.85786 3 12 3C16.1421 3 19.5 6.35786 19.5 10.5ZM13.5 10.5C13.5 11.3284 12.8284 12 12 12C11.1716 12 10.5 11.3284 10.5 10.5C10.5 9.67157 11.1716 9 12 9C12.8284 9 13.5 9.67157 13.5 10.5ZM15 10.5C15 12.1569 13.6569 13.5 12 13.5C10.3431 13.5 9 12.1569 9 10.5C9 8.84315 10.3431 7.5 12 7.5C13.6569 7.5 15 8.84315 15 10.5Z"
                    fill="#1C274C"
                  ></path>{" "}
                </g>
              </svg>
              <span className="mt-2 xl:mt-0">
                {villes.find((ville) => ville.id === item.villeId)?.ville},{" "}
                {item.adresse}
              </span>
            </p>
            <p className="inline-flex flex-col xl:flex-row xl:items-center text-gray-800">
              <svg
                className="inline-block w-5 h-5 xl:w-4 xl:h-4 mr-3"
                viewBox="0 0 24 24"
                fill="none"
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
                    d="M12 8V12L14.5 14.5"
                    stroke="#1C274C"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>{" "}
                  <path
                    d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7"
                    stroke="#1C274C"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  ></path>{" "}
                </g>
              </svg>
              <span className="mt-2 xl:mt-0">
                {item.date}
                <br />
                {`From ${
                  sessions.find((session) => session.evenementId === item.id)
                    ?.heure_debut
                } To ${
                  sessions.find((session) => session.evenementId === item.id)
                    ?.heure_fin
                }`}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 mt-8">
            <div className="flex justify-end">
              {sieges.some((siege) => siege.salleId) ? (
                <p className="inline-block font-semibold text-primary whitespace-nowrap leading-tight rounded-xl">
                  <span className="text-sm uppercase">MAD</span>
                  <span className="text-lg">{sieges[0]?.prix}</span>/Siege
                </p>
              ) : (
                <p className="inline-block font-semibold text-primary whitespace-nowrap leading-tight rounded-xl">
                  Info not Provided
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      {eventDetails && (
        <EvenementDetails
          itemId={item.id}
          eventDetails={eventDetails}
          categories={categories}
          salles={salles}
          villes={villes}
          sieges={sieges}
          sessions={sessions}
        />
      )}
    </>
  );
};
export default EvenementCard;
