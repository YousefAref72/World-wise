import CityItem from "./CityItem";
import Spinner from "./Spinner";
import styles from "./CityList.module.css";
import { useCities } from "../contexts/CitiesContext";
function CitiesList() {
  const { cities, isLoading } = useCities();
  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : (
        <ul className={styles.cityList}>
          {cities.map((city) => (
            <CityItem city={city} key={city.id} />
          ))}
        </ul>
      )}
    </div>
  );
}

export default CitiesList;
