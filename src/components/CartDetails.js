import Image from "next/image";
import React from "react";

const CartDetails = ({
  cart,
  event,
  ville,
  category,
  salles,
  sessions,
  sieges,
}) => {
  const togglePopup = () => {
    var popup = document.getElementById(`popup${cart.id}`);
    popup?.classList.toggle("hidden");
  };

  return (
    <>
      {/* <!-- Popup --> */}
      <div
        id={`popup${cart.id}`}
        className="h-screen z-10 fixed inset-0 flex items-center justify-center hidden"
      >
        <div
          className="absolute inset-0 bg-gray-800 opacity-75"
          onClick={togglePopup}
        ></div>
        <div className="z-10" style={{ width: "90%" }}>
          <div className="bg-white w-75 h-50 rounded-lg overflow-hidden rounded-lg shadow-2xl md:grid md:grid-cols-3">
            <Image
              width={600}
              height={400}
              src={event.imageUrl}
              alt={event.title}
              className="h-32 w-full object-cover md:h-full"
            />
            <div className="div-4 text-center sm:div-6 md:col-span-2 lg:div-8">
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
              <div className="text-sm font-semibold uppercase tracking-widest">
                {category?.category}
              </div>

              <h2 className="mt-6 font-black uppercase">
                <span className="text-4xl font-black sm:text-5xl lg:text-6xl">
                  {event.title}
                </span>

                <span className="mt-2 block text-sm">
                  {salles.some((salle) => salle.etat === "Disponible")
                    ? "Disponible"
                    : "Réservée"}
                </span>
              </h2>
              <span className="div-2 text-sm font-semibold uppercase tracking-widest">
                Sur
              </span>
              <h5 className="font-black uppercase">
                <span className="font-black">
                  {ville?.ville}, {event.adresse}
                </span>
              </h5>

              <div className="mt-4 mb-2 div-2 text-sm font-semibold uppercase tracking-widest">
                {event.description}
              </div>
              <div className="mt-7 overflow-x-auto">
                <table className="w-full whitespace-nowrap">
                  <thead className="mb-2">
                    <tr>
                      <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        #
                      </th>
                      <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Room
                      </th>
                      <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Session
                      </th>
                      <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Chair
                      </th>
                      <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Price / Chair
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sieges.map((siege, siegeIndex) => (
                      <React.Fragment key={siegeIndex}>
                        <tr
                          tabIndex="0"
                          className="focus:outline-none h-16 border border-gray-100 rounded"
                        >
                          <td>
                            <div className="ml-5">
                              <div className="bg-gray-200 rounded-sm w-5 h-5 flex flex-shrink-0 justify-center items-center relative">
                                {siege.id}
                              </div>
                            </div>
                          </td>
                          {salles
                            .filter(
                              (salleItem) => salleItem.id === siege.salleId
                            )
                            .map((salleItem) => (
                              <React.Fragment key={salleItem.id}>
                                <td>
                                  <div className="flex items-center pl-5">
                                    <div className="text-base font-medium leading-none text-gray-700 mr-2">
                                      {salleItem.nom}
                                    </div>
                                  </div>
                                </td>
                                {sessions
                                  .filter(
                                    (session) =>
                                      session.salleId === salleItem.id
                                  )
                                  .map((session) => (
                                    <React.Fragment key={session.id}>
                                      <td>
                                        <div className="flex items-center pl-5">
                                          <div className="text-base font-medium leading-none text-gray-700 mr-2">
                                            {`From ${session.heure_debut} To ${session.heure_fin}`}
                                          </div>
                                        </div>
                                      </td>
                                    </React.Fragment>
                                  ))}
                              </React.Fragment>
                            ))}
                          <td className="pl-24">
                            <div className="flex items-center">
                              <div className="text-base font-medium leading-none text-gray-700 mr-2">
                                {siege.numero}
                              </div>
                            </div>
                          </td>
                          <td className="pl-5">
                            <div className="flex items-center">
                              <div className="text-base font-medium leading-none text-gray-700 mr-2">
                                {siege.prix}
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr className="h-3"></tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
                <div className="ml-5">
                  <div className="flex flex-shrink-0 justify-end items-center">
                    <div className="text-xl font-medium leading-none text-gray-700 mr-2">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "MAD",
                        minimumFractionDigits: 2,
                      }).format(
                        sieges
                          .map((siege) => siege.prix)
                          .reduce((sum, price) => sum + price, 0)
                      )}
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

export default CartDetails;
