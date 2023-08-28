import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaypal } from "@fortawesome/free-brands-svg-icons";
import CartCard from "./CartCard";
import { faCartShopping, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import axios from "axios";
import jsPDF from "jspdf";
import { getTokenFromLocalStorage } from "../utils/token";

const CartList = ({ carts }) => {
  const [selectedCarts, setSelectedCarts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [token, setToken] = useState([]);
  const [checkoutButtonDisabled, setCheckoutButtonDisabled] = useState(false);

  useEffect(() => {
    setToken(getTokenFromLocalStorage());
  }, []);

  function generateReservationCode() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const codeLength = 6; // Make sure it matches the desired code length
    let code = "";

    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }

    return code;
  }

  const handleCartSelect = (cart) => {
    const updatedCarts = selectedCarts.includes(cart)
      ? selectedCarts.filter((c) => c !== cart)
      : [...selectedCarts, cart];

    setSelectedCarts(updatedCarts);

    const newTotal = calculateTotal(updatedCarts);
    setTotalPrice(newTotal);
  };

  const calculateTotal = (carts) => {
    return carts.reduce((total, c) => total + c.totalPrice, 0);
  };

  const handleDeleteCart = () => {
    if (selectedCarts.length === 0) {
      Swal.fire(
        "No carts selected",
        "Please select carts to delete.",
        "warning"
      );
      return;
    }

    Swal.fire({
      title: "Delete Carts",
      text: "Are you sure you want to delete the selected carts?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        const deletePromises = selectedCarts.map((cart) =>
          axios.delete(`http://localhost:3000/carts/${cart.id}`)
        );

        Promise.all(deletePromises)
          .then(() => {
            // Remove the deleted carts from the state
            setSelectedCarts([]);
            Swal.fire(
              "Deleted!",
              "The selected carts have been deleted.",
              "success"
            );
            window.location.reload();
          })
          .catch((error) => {
            console.error("Error deleting carts:", error);
            Swal.fire(
              "Error",
              "An error occurred while deleting the carts.",
              "error"
            );
          });
      }
    });
  };

  const generatePDF = async (reservation) => {
    const doc = new jsPDF();
    doc.text("Reservation Details:", 10, 10);
    doc.text(`Reservation ID: ${reservation.id}`, 10, 20);
    doc.text(`Reservation Code: ${reservation.code_reservation}`, 10, 30);
    doc.text(`Date: ${reservation.date_reservation}`, 10, 40);
    doc.text(`Seat ID: ${reservation.siegeId}`, 10, 50);
    // Add more details as needed

    // Return the PDF blob
    return new Promise((resolve) => {
      const pdfBytes = doc.output("arraybuffer"); // Output as Uint8Array
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      resolve(blob);
    });
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        resolve(base64String);
      };
      reader.readAsDataURL(blob);
    });
  };

  // const checkoutClickHandler = async () => {
  //   if (selectedCarts.length === 0) {
  //     Swal.fire("No carts selected", "Please select carts for checkout.", "warning");
  //     return;
  //   }

  //   // try {
  //     const savedReservations = [];

  //     for (const cart of selectedCarts) {
  //       const seatsId = cart.sieges.split(',');

  //       for (const seatId of seatsId) {
  //         const reservationData = {
  //           code_reservation: generateReservationCode(),
  //           date_reservation: new Date().toISOString(),
  //           siege_id: seatId,
  //           utilisateur_id: cart.userId,
  //           status: "Reserved",
  //           montant: cart.totalAmount,
  //           sessionId: cart.sessionId,
  //         };

  //         // Create reservation
  //         const reservationResponse = await axios.post("http://localhost:3000/reservations", reservationData);

  //         // Update seat status to 'Reserved'
  //         await axios.patch(`http://localhost:3000/sieges/${seatId}`, {
  //           status: "Réservé",
  //         });

  //         // Generate and save PDF
  //         const pdfBlob = generatePDF(reservationResponse.data, true);
  //         const pdfBase64 = blobToBase64(pdfBlob);

  //         // Save reservation and ticket data
  //         const savedReservation = await axios.post("http://localhost:3000/reservations", {
  //           reservationData: reservationResponse.data,
  //           pdfData: pdfBase64,
  //         });

  //         savedReservations.push(savedReservation.data);
  //       }
  //     }

  //     Swal.fire({
  //       title: "Download Tickets",
  //       html: "Your tickets have been generated. Click the button below to download.",
  //       icon: "success",
  //       showCancelButton: true,
  //       confirmButtonColor: "#3085d6",
  //       cancelButtonColor: "#d33",
  //       confirmButtonText: "Download",
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         savedReservations.forEach((reservation) => {
  //           const pdfBlob = base64ToBlob(reservation.pdfData);
  //           const pdfUrl = URL.createObjectURL(pdfBlob);
  //           const link = document.createElement("a");
  //           link.href = pdfUrl;
  //           link.download = `Reservation_${reservation.reservation.code_reservation}.pdf`;
  //           link.click();
  //           URL.revokeObjectURL(pdfUrl);
  //         });
  //       }
  //     });
  //   // } catch (error) {
  //   //   console.error("Error creating reservations:", error);
  //   //   Swal.fire("Error", "An error occurred during the reservation process.", "error");
  //   // }
  // };

  const checkoutClickHandler = async () => {
    if (selectedCarts.length === 0) {
      Swal.fire(
        "No carts selected",
        "Please select carts for checkout.",
        "warning"
      );
      return;
    }

    try {
      setCheckoutButtonDisabled(true);
      const savedReservations = [];

      for (const cart of selectedCarts) {
        const sessionIds = cart.sessions.split(","); // Split sessions string into an array of session IDs

        for (const sessionId of sessionIds) {
          const seatsId = cart.sieges.split(",");

          for (const seatId of seatsId) {
            const reservationData = {
              code_reservation: generateReservationCode(),
              date_reservation: new Date().toISOString(),
              siegeId: seatId,
              utilisateurId: cart.userId,
              status: "Reserved",
              montant: totalPrice,
              sessionId: sessionId, // Use the current sessionId from the loop
            };

            console.log(reservationData);
            // Create reservation
            const reservationResponse = await axios.post(
              "http://localhost:3000/reservations",
              reservationData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            // Update seat status to 'Reserved'
            await axios.put(`http://localhost:3000/sieges/${seatId}`, {
              status: "Réservé",
            });

            // Generate and save PDF

            const pdfBlob = await generatePDF(reservationResponse.data);
            const pdfBase64 = await blobToBase64(pdfBlob);

            // Update reservation with ticket information and PDF data
            const updatedReservationData = {
              ...reservationResponse.data, // Copy existing reservation data
              ticket: pdfBase64, // Include ticket data
            };

            try {
              const updatedReservationResponse = await axios.put(
                `http://localhost:3000/reservations/${reservationResponse.data.id}`,
                updatedReservationData,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              savedReservations.push(updatedReservationResponse.data);
            } catch (error) {
              console.error(
                "Error updating reservation with ticket data:",
                error
              );
              Swal.fire(
                "Error",
                "An error occurred while updating the reservation with ticket data.",
                "error"
              );
            }
          }
        }
        // update this cart's state to confirmed sending a axios to http://localhost:3000/carts/:cartId and updating cart
        await updateCartState(cart.id);
        setSelectedCarts((prevCarts) => prevCarts.filter((c) => c !== cart));

        Swal.fire({
          title: `Download Tickets(${savedReservations.length})`,
          html: "Your tickets have been generated. Click the button below to download.",
          icon: "success",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Download",
        }).then(async (result) => {
          if (result.isConfirmed) {
            for (const reservation of savedReservations) {
              if (
                reservation &&
                reservation.ticket &&
                reservation.code_reservation
              ) {
                const pdfBlob = base64ToBlob(reservation.ticket);
                const pdfUrl = URL.createObjectURL(pdfBlob);
                const link = document.createElement("a");
                link.href = pdfUrl;
                link.download = `Reservation_${reservation.code_reservation}.pdf`;
                link.click();
                URL.revokeObjectURL(pdfUrl);
              } else {
                console.error("Invalid reservation data:", reservation);
              }
            }
  
            // Close the loading swal
            Swal.close();
  
            // Reload the page after all tickets have been downloaded
            window.location.reload();
          }
        });
      }
      // Reload the page after all tickets have been downloaded
      // window.location.reload();
    } catch (error) {
      console.error("Error creating reservations:", error);
      Swal.fire(
        "Error",
        "An error occurred during the reservation process.",
        "error"
      );
    } finally {
      // Enable the checkout button after the process is done
      setCheckoutButtonDisabled(false);
    }
  };

  const updateCartState = async (cartId) => {
    try {
      // Send Axios PUT request to update cart's state
      await axios.put(`http://localhost:3000/carts/${cartId}`, {
        state: "confirmed",
      });

      Swal.fire(
        "Cart Updated",
        "The cart's state has been updated.",
        "success"
      );
    } catch (error) {
      console.error("Error updating cart state:", error);
      Swal.fire(
        "Error",
        "An error occurred while updating cart state.",
        "error"
      );
    }
  };

  const base64ToBlob = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");
    const rawData = atob(base64);
    const arrayBuffer = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; i++) {
      arrayBuffer[i] = rawData.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: "application/pdf" });
  };

  return (
    <div className="flex h-screen flex-col overflow-y-scroll bg-white">
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="border-b border-gray-200 div-3 flex items-start justify-between">
          <h2
            className="text-lg font-medium text-gray-900"
            id="slide-over-title"
          >
            My Booking List
          </h2>
          <div className="ml-3 flex h-7 items-center">
            <span className="">Payment Methods : </span>
            <span className="inline-flex items-center justify-center w-6 h-6 mx-2 text-sm font-semibold text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
              <FontAwesomeIcon className="w-2.5 h-2.5" icon={faPaypal} />
            </span>
          </div>
        </div>
        <div className="mt-8 z-10">
          <div className="flow-root">
            <div role="list" className="-my-6 divide-y divide-gray-200">
              {carts.length > 0 ? (
                <>
                  {carts.map((cart) => (
                    <div
                      key={cart.id}
                      className="flex justify-content items-center"
                    >
                      <input
                        id={`cartId${cart.id}`}
                        type="checkbox"
                        checked={selectedCarts.includes(cart)}
                        onChange={() => handleCartSelect(cart)}
                        className="w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <CartCard key={cart.id} cart={cart} />
                    </div>
                  ))}
                </>
              ) : (
                <div className="flex justify-center items-center font-bold">
                  No Bookings exist
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
        <div className="flex justify-between text-base font-medium text-gray-900">
          <div>Total</div>
          <div>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "MAD",
              minimumFractionDigits: 2,
            }).format(totalPrice)}
          </div>
        </div>
        <div className="mt-6">
          <div className="flex justify-around">
            <button
              type="button"
              className="w-full mx-3 flex items-center justify-center rounded-md border border-transparent bg-green-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-green-700"
              onClick={checkoutClickHandler}
              disabled={checkoutButtonDisabled}
            >
              <FontAwesomeIcon className="pr-1" icon={faCartShopping} />
              Checkout
            </button>
            <button
              type="button"
              className="w-full mx-3 flex items-center justify-center rounded-md border border-transparent bg-red-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-red-700"
              onClick={handleDeleteCart}
            >
              <FontAwesomeIcon className="pr-1" icon={faTrashCan} />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartList;
