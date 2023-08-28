import React, { useEffect, useState } from "react";
import axios from "axios";
import './../../styles/style.css';
import EvenementList from "../components/EvenementList";

const EvenementPage = () => {
  const [evenements, setEvenements] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [categories, setCategories] = useState([]);
  

  useEffect(() => {
    fetchEvenements();
    fetchCategories();
  }, []);

  const fetchEvenements = async () => {
    try {
      const response = await axios.get("http://localhost:3000/evenements");
      setEvenements(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des événements :", error);
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des categoriés :", error);
    }
  };

  const categoryChangeHandler = (e) => {
    const divParents = Array.from(document.querySelectorAll("div[id^='cate']")).filter(parent => {
      return parent.querySelector("input[id^='cat']:checked")?.value == e.target.value;
    });
    const unCheckedDivParents = Array.from(document.querySelectorAll("div[id^='cate']")).filter(parent => {
      return parent.querySelector("input[id^='cat']:checked")?.value !== e.target.value;
    });
    setSelectedCategory({"id": categories.find(cat => cat.category === e.target.value)?.id ? categories.find(cat => cat.category === e.target.value)?.id : 0, "category":e.target.value});
    unCheckedDivParents.forEach(uncheckedDivParent => uncheckedDivParent.classList.remove("checked"));
    divParents[0].classList.add("checked");
  }

  return (
    <>
      <main class="bg-[#1f2937] max-w-screen p-4 flex flex-col items-center">
        <div class="flex w-full relative justify-around">
          <div key="cate0" id="cate0">
              <input
                type="radio"
                id={`catAll`}
                name="tabs"
                class="appearance-none"
                value={'All'}
                onChange={(event) => categoryChangeHandler(event)}
              />
              <label
                for={`catAll`}
                class="text-white text-xs cursor-pointer flex items-center justify-center truncate select-none font-semibold text-lg rounded-full py-2"
              >
                All
              </label>
            </div>  
          {categories.map((cat, index) => (
            <div key={`cate${index}`} id={`cate${index}`} >
              <input
                type="radio"
                id={`cat${index}`}
                name="tabs"
                class="appearance-none"
                value={cat.category}
                onChange={(event) => categoryChangeHandler(event)}
              />
              <label
                for={`cat${index}`}
                class="text-white text-xs cursor-pointer flex items-center justify-center truncate select-none font-semibold text-lg rounded-full py-2"
              >
                {cat.category}
              </label>
            </div>
          ))}
        </div>
      </main>
      <div className="mt-5 mb-5">
        <h2 className="mb-8 text-2xl text-cyan-900 font-bold text-center">
          Liste des Événements :
        </h2>
        <EvenementList filteredCategory={selectedCategory} evenements={evenements} />
      </div>
    </>
  );
};

export default EvenementPage;
