import Image from "next/image";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { EvenementReservation } from "./EvenementReservation";

export const EvenementDetails = ({
  itemId,
  eventDetails,
  categories,
  salles,
  villes,
  sieges,
  sessions
}) => {
  const router = useRouter();

  const togglePopup = () => {
    if (itemId) {
      var popup = document.getElementById(`popup${itemId}`);
      popup?.classList.toggle("hidden");
    }
  };

  const currUser = JSON.parse(localStorage.getItem("currUser"));
  const reservationTogglePopup = () => {
    const currUser = JSON.parse(localStorage.getItem("currUser"));
    if (currUser) {
      if (salles.some((salle) => salle.etat === "Disponible")) {
        var popup = document.getElementById(`popup${itemId}`);
        popup?.classList.add("hidden");
        var reservationPopup = document.getElementById(`reservationPopup${itemId}`);
        reservationPopup?.classList.toggle("hidden");
      } else {
        Swal.fire({
          title: "The event is not avaible!",
          text: "We are sorry to tell you that the event is not avaible for the moment!",
          icon: "warning",
          showCancelButton: true,
          showConfirmButton: false,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          cancelButtonText: "Close",
        }).then((result) => {
          // Hide popup with itemId
          var popup = document.getElementById(`popup${itemId}`);
          if (popup) {
            popup.classList.add("hidden");
          }

          // Hide reservationPopup
          var reservationPopup = document.getElementById("reservationPopup");
          if (
            reservationPopup &&
            reservationPopup.classList.contains("hidden")
          ) {
            reservationPopup.classList.add("hidden");
          }
        });
      }
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
      {/* <!-- Popup --> */}
      <div
        id={`popup${itemId}`}
        className="h-screen z-10 fixed inset-0 flex items-center justify-center"
      >
        <div
          className="absolute inset-0 bg-gray-800 opacity-75"
          onClick={togglePopup}
        ></div>
        <div className="z-10" style={{ width: "90%" }}>
          <section className="bg-white w-75 h-50 rounded-lg overflow-hidden rounded-lg shadow-2xl md:grid md:grid-cols-3">
            <Image
              width={600}
              height={400}
              src={eventDetails.imageUrl}
              alt={eventDetails.title}
              className="h-32 w-full object-cover md:h-full"
            />
            <div className="p-4 text-center sm:p-6 md:col-span-2 lg:p-8">
              <div className="flex justify-end items-center ">
                <svg
                  onClick={togglePopup}
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
              <p className="text-sm font-semibold uppercase tracking-widest">
                {
                  categories.find(
                    (category) => category.id === eventDetails.category
                  )?.category
                }
              </p>

              <h2 className="mt-6 font-black uppercase">
                <span className="text-4xl font-black sm:text-5xl lg:text-6xl">
                  {eventDetails.title}
                </span>

                <span className="mt-2 block text-sm">
                  {salles.some((salle) => salle.etat === "Disponible")
                    ? "Disponible"
                    : "Réservée"}
                </span>
              </h2>

              <span className="p-2 text-sm font-semibold uppercase tracking-widest">
                Sur
              </span>
              <h5 className="font-black uppercase">
                <span className="font-black">
                  {
                    villes.find((ville) => ville.id === eventDetails.villeId)
                      ?.ville
                  }
                  , {eventDetails.adresse}
                </span>
              </h5>

              <p className="mt-4 mb-2 p-2 text-sm font-semibold uppercase tracking-widest">
                {eventDetails.description}
              </p>

              <div className="flex justify-center items-center">
                <a
                  className="mt-8 cursor-pointer py-2 rounded-lg inline-block px-4 text-right bg-green-500 py-4 text-sm font-bold uppercase tracking-widest text-white"
                  onClick={reservationTogglePopup}
                >
                  Book Now !
                </a>
              </div>

              {sieges.some((siege) => siege.salleId) ? (
                <p className="mt-8 text-right text-xs font-medium uppercase text-gray-400">
                  <span className="text-sm uppercase">MAD</span>
                  <span className="text-lg">{sieges[0]?.prix}</span>/Siege
                </p>
              ) : (
                <p className="mt-8 text-xs font-medium uppercase text-gray-400">
                  Info not Provided
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
      {eventDetails && (
        <EvenementReservation
          currUser={currUser}
          itemId={itemId}
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
