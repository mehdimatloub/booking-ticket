import React from "react";
import CartCard from "./CartCard";

const MyBookingList = ({ bookings }) => {

  return (
    <div className="flex h-screen flex-col overflow-y-scroll bg-white">
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="border-b border-gray-200 p-3 flex items-start justify-between">
          <h2
            className="text-lg font-medium text-gray-900"
            id="slide-over-title"
          >
            My Booking List
          </h2>
        </div>
        <div className="mt-8 z-10">
          <div className="flow-root">
            <div role="list" className="-my-6 divide-y divide-gray-200">
              {bookings.length > 0 ? (
                <>
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex justify-content items-center"
                    >
                      <CartCard key={booking.id} cart={booking} />
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
    </div>
  );
};

export default MyBookingList;
