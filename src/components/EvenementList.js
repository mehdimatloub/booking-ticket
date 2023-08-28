import React, { useEffect, useState } from "react";
import axios from "axios";
import EvenementCard from "./EvenementCard";

const EvenementList = ({ filteredCategory, evenements }) => {
  const [villes, setVilles] = useState([]);
  const [filteredVilles, setFilteredVilles] = useState([]);
  const [filteredEvenements, setFilteredEvenements] = useState(evenements);
  const [filterText, setFilterText] = useState("");
  const [selectedVilles, setSelectedVilles] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch the data here...
    axios
      .get("http://localhost:3000/villes")
      .then((response) => {
        setVilles(response.data);
        setFilteredVilles(response.data);
        setIsLoading(false); // Set loading to false after data is loaded
        setSelectedVilles([]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false); // Set loading to false if there's an error
      });
  }, []);


  useEffect(() => {
    setIsLoading(true);
  
    const filteredEventsByCities = getFilteredEventsBySelectedCities(selectedVilles);
    const filteredEventsByCategory = getFilteredEventsBySelectedCategory(filteredCategory);
  
    // Find events that are common between both filtered arrays
    const mergedEvents = filteredEventsByCities.filter(event =>
      filteredEventsByCategory.includes(event)
    );
  
    setFilteredEvenements(mergedEvents);
    setIsLoading(false);
  }, [selectedVilles, filteredCategory]);

  // Method to get filtered events based on selected cities
  const getFilteredEventsBySelectedCities = (selectedVilles) => {
    if (selectedVilles.length === 0) {
      return evenements;
    }
    const filteredEvents = evenements.flatMap((event) =>
      selectedVilles.includes(
        villes.find((ville) => ville.id === event.villeId)
      )
        ? event
        : []
    );

    return filteredEvents;
  };
    // Method to get filtered events based on selected cities
    const getFilteredEventsBySelectedCategory = (selectedCategory) => {
      if (selectedCategory.id === 0) {
        return evenements;
      }
      return evenements.filter(event => event.category === selectedCategory.id);
    };

  const handleInputChange = (event) => {
    const inputText = event.target.value;
    setFilterText(inputText);

    const filtered = villes.filter((ville) =>
      ville.nom.toLowerCase().includes(inputText.toLowerCase())
    );
    setFilteredVilles(filtered);
  };

  const isFiltering = filterText !== "";

  const handleCityClick = (ville) => {
    const isSelected = selectedVilles.some(
      (selectedVille) => selectedVille.id === ville.id
    );

    if (isSelected) {
      setSelectedVilles((prevSelectedVilles) =>
        prevSelectedVilles.filter((v) => v.id !== ville.id)
      );
    } else {
      setSelectedVilles((prevSelectedVilles) => [...prevSelectedVilles, ville]);
    }
    setIsDropdownOpen(false);
  };

  return (
    <>
      {!isLoading && evenements ? (
        <div className="flex flex-col">
          <style>
            {`
          .top-100 {top: 100%;}
          .bottom-100 {bottom: 100%;}
          .max-h-select {max-height: 300px;}
        `}
          </style>
          <div className="col-12">
            <div className="w-full md:w-1/2 flex flex-col items-center h-24 mx-auto">
              <div className="w-full px-4">
                <div className="flex flex-col items-center relative">
                  <div className="w-full  svelte-1l8159u">
                    <div className="my-2 p-1 flex border border-gray-200 bg-white rounded svelte-1l8159u">
                      <div className="flex flex-auto flex-wrap">
                        {selectedVilles.map((selectedVille) => (
                          <div
                            key={selectedVille.id}
                            className="flex justify-center items-center m-1 font-medium py-1 px-2 bg-white rounded-full text-teal-700 bg-teal-100 border border-teal-300"
                          >
                            <div className="text-xs font-normal leading-none max-w-full flex-initial">
                              {selectedVille.ville}
                            </div>
                            <div className="flex flex-auto flex-row-reverse">
                              <div>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="100%"
                                  height="100%"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="feather feather-x cursor-pointer hover:text-teal-400 rounded-full w-4 h-4 ml-2"
                                  onClick={() => handleCityClick(selectedVille)} // Add onClick handler to remove from the selected list
                                >
                                  <line x1="18" y1="6" x2="6" y2="18"></line>
                                  <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div className="flex-1">
                          <input
                            placeholder="Search for a city..."
                            className="bg-transparent p-1 px-2 appearance-none outline-none h-full w-full text-gray-800"
                            value={filterText}
                            onChange={handleInputChange}
                            onFocus={() => setIsDropdownOpen(true)}
                          />
                        </div>
                      </div>
                      <div className="text-gray-300 w-8 py-1 pl-2 pr-1 border-l flex items-center border-gray-200 svelte-1l8159u">
                        <button
                          className="cursor-pointer w-6 h-6 text-gray-600 outline-none focus:outline-none"
                          onClick={() =>
                            setIsDropdownOpen((prevState) => !prevState)
                          } // Toggle the dropdown state
                        >
                          {isDropdownOpen ? ( // Check if the dropdown is open
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="100%"
                              height="100%"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              className="feather feather-chevron-up w-4 h-4"
                            >
                              <polyline points="18 15 12 9 6 15"></polyline>
                            </svg>
                          ) : (
                            // If the dropdown is closed, show the chevron down icon
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="100%"
                              height="100%"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              className="feather feather-chevron-down w-4 h-4"
                            >
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  {isDropdownOpen && (
                    <div className="absolute shadow top-100 bg-white z-40 w-full left-0 rounded max-h-select overflow-y-auto svelte-5uyqqj">
                      <div className="flex flex-col w-full">
                        {isFiltering
                          ? filteredVilles.map((ville) => (
                              <div
                                key={ville.id}
                                className="cursor-pointer w-full border-gray-100 border-b hover:bg-teal-100"
                                onClick={() => handleCityClick(ville)}
                              >
                                <div className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:border-teal-100">
                                  <div className="w-full items-center flex">
                                    <div className="mx-2 leading-6">
                                      {ville.ville}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          : villes.map((ville) => (
                              <div
                                key={ville.id}
                                className="cursor-pointer w-full border-gray-100 border-b hover:bg-teal-100"
                                onClick={() => handleCityClick(ville)}
                              >
                                <div className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:border-teal-100">
                                  <div className="w-full items-center flex">
                                    <div className="mx-2 leading-6">
                                      {ville.ville}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full" style={{justifyContent: 'center',alignItems: 'center',justifyItems: 'center',alignContent: 'center'}}>
            {filteredEvenements.length > 0 ? (
              filteredEvenements.map((item) => (
                <div className="relative mx-auto w-full" key={item.id}>
                  <EvenementCard item={item} />
                </div>
              ))
            ) : evenements.length > 0 ? (
              evenements.map((item) => (
                <div className="relative mx-auto w-full" key={item.id}>
                  <EvenementCard item={item} />
                </div>
              ))
            ) : (
              <div className="w-100 h-screen text-center flex justify-center items-start">
                <div className="relative">
                  <p>Aucun événement trouvé.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="w-100 h-screen text-center flex justify-center items-center">
          <div className="relative">
            <div className="w-20 h-20 border-green-200 border-2 rounded-full"></div>
            <div className="w-20 h-20 border-green-700 border-t-2 animate-spin rounded-full absolute left-0 top-0"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default EvenementList;
