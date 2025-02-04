import Spinner from "./Spinner";
import CountryItem from "./CountryItem";
import styles from "./CountryList.module.css";
import { useCities } from "../contexts/CitiesContext";
function CountriesList() {
  const { cities, isLoading } = useCities();

  const countries = cities.reduce((arr, city) => {
    if (!arr.map((el) => el.country).includes(city.country))
      return [...arr, { country: city.country, emoji: city.emoji }];
    else return arr;
  }, []);
  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : (
        <ul className={styles.countryList}>
          {countries.map((country) => (
            <CountryItem country={country} key={country.id} />
          ))}
        </ul>
      )}
    </div>
  );
}

export default CountriesList;
