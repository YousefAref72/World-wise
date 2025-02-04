import { useContext, useEffect, useReducer, useState } from "react";
import { createContext } from "react";
const BASE_URL = "http://localhost:9000/";
const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};
function reducer(state, action) {
  switch (action.type) {
    case "cities/loaded":
      return { ...state, cities: action.payload, isLoading: false };

    case "city/loaded":
      return { ...state, currentCity: action.payload, isLoading: false };

    case "city/created":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        isLoading: false,
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        isLoading: false,
      };
    case "loading":
      return { ...state, isLoading: true };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    default:
      break;
  }
}

function CitiesProvider({ children }) {
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );
  useEffect(function () {
    async function citiesFetcher() {
      dispatch({ type: "loading" });
      try {
        //loading cities
        const res = await fetch(`${BASE_URL}cities`);
        const data = await res.json();

        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "something went wronge with loading cities...",
        });
      }
    }
    citiesFetcher();
  }, []);

  async function getCity(id) {
    if (+id === currentCity.id) return;
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}cities/${id}`);
      const data = await res.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "something went wronge with loading city.",
      });
    }
  }
  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({ type: "city/created", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "something went wronge with creating city...",
      });
    }
  }
  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${BASE_URL}cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "city/deleted", payload: id });
    } catch {
      dispatch({
        type: "rejected",
        payload: "something went wronge with deleting city.",
      });
    }
  }
  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}
function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined) throw new Error("used outside range");
  return context;
}

export { CitiesProvider, useCities };
