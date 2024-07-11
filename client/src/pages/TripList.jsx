import { useEffect, useState , useCallback} from "react";
import "../styles/List.css";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setTripList } from "../redux/state";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer"

const TripList = () => {
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user._id);
  const token = useSelector((state) => state.token);
  const tripList = useSelector((state) => state.user.tripList);

  const dispatch = useDispatch();

  const getTripList = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${userId}/trips`,
        {
          method: "GET",
          headers:{
            "Authorization": "Bearer "+token
          }
        }
      );

      const data = await response.json();
      dispatch(setTripList(data));
      setLoading(false);
    } catch (err) {
      console.log("Fetch Trip List failed!", err.message);
    }
  },[userId, token, dispatch] );

  
  



  useEffect(() => {
    getTripList();
  }, [  getTripList]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">Your Trip List</h1>
      <div className="list">
        {tripList?.map(({ listingId, hostId, startDate, endDate, totalPrice, booking=true }) => (
          <ListingCard
            listingId={listingId._id}
            creator={hostId._id}
            listingPhotoPaths={listingId.listingPhotoPaths}
            city={listingId.city}
            province={listingId.province}
            country={listingId.country}
            category={listingId.category}
            startDate={startDate}
            endDate={endDate}
            totalPrice={totalPrice}
            booking={booking}
            
          />
        ))}
      </div>
      <Footer />
    </>
  );
};

export default TripList;
