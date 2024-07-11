import { useEffect, useState } from "react";
import "../styles/ListingDetails.css";
import { useNavigate, useParams } from "react-router-dom";
import { facilities } from "../data";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import Footer from "../components/Footer"


const ListingDetails = () => {
  const [loading, setLoading] = useState(true);
 
  const [existingBookings, setExistingBookings] = useState([]);
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);

  const getListingDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/properties/${listingId}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      setListing(data);



      const bookingsResponse = await fetch(`http://localhost:3001/bookings/${listingId}`, {
        method: "GET",
      });

      const bookingsData = await bookingsResponse.json();
      setExistingBookings(Array.isArray(bookingsData) ? bookingsData : []);










      setLoading(false);
    } catch (err) {
      console.log("Fetch Listing Details Failed", err.message);
      setExistingBookings([]);
    }
  };

  useEffect(() => {
    getListingDetails();
  }, []);

  console.log(listing)


  /* BOOKING CALENDAR */
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleSelect = (ranges) => {
    // Update the selected date range when user makes a selection
    setDateRange([ranges.selection]);
  };

  const start = new Date(dateRange[0].startDate);
  const end = new Date(dateRange[0].endDate);
  const dayCount = Math.round(end - start) / (1000 * 60 * 60 * 24); // Calculate the difference in day unit

  /* SUBMIT BOOKING */
  const customerId = useSelector((state) => state?.user?._id)
  const token = useSelector((state) => state?.token)

  const navigate = useNavigate();

  const checkAvailability = () => {
    for (const booking of existingBookings) {
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);

      if (
        (start >= bookingStart && start <= bookingEnd) ||
        (end >= bookingStart && end <= bookingEnd) ||
        (start <= bookingStart && end >= bookingEnd)
      ) {
        return false;
      }
    }
    return true;
  };


  











  const handleSubmit = async () => {

    if (   listing.type === "An entire place" &&    !checkAvailability()) {
      toast.error("The selected date range is not available.");
      // alert("The selected date range is not available.");
      return;
    }







    try {
      const bookingForm = {
        customerId,
        listingId,
        hostId: listing.creator._id,
        startDate: dateRange[0].startDate.toDateString(),
        endDate: dateRange[0].endDate.toDateString(),
        totalPrice: listing.price * dayCount,
      }

      const response = await fetch("http://localhost:3001/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer "+token
        },
        body: JSON.stringify(bookingForm)
      })

      if (response.ok) {
        navigate(`/${customerId}/trips`)
      }
      else {
        const errorData = await response.json();
        toast.error(errorData.message);
      }
    } catch (err) {
      console.log("Submit Booking Failed.", err.message);
      toast.error("Failed to submit booking. Please try again later.");
    }
  }

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      
      <div className="listing-details">
        <div className="title">
          <h1>{listing.title}</h1>
          <div></div>
        </div>

        <div className="photos">
          {listing.listingPhotoPaths?.map((item) => (
            <img
            key={item}
              src={`http://localhost:3001/${item.replace("public", "")}`}
              alt="listing photo ${item}"
            />
          ))}
        </div>

        <h2>
          {listing.type} in {listing.city}, {listing.province},{" "}
          {listing.country}
        </h2>
        <p>
          {listing.guestCount} guests - {listing.bedroomCount} bedroom(s) -{" "}
          {listing.bedCount} bed(s) - {listing.bathroomCount} bathroom(s)
        </p>
        <hr />

        <div className="profile">
          <img
            src={`http://localhost:3001/${listing.creator.profileImagePath.replace(
              "public",
              ""
            )}`}
          />
          <h3>
            Hosted by {listing.creator.firstName} {listing.creator.lastName}
          </h3>
        </div>
        <hr />

        <h3>Description</h3>
        <p>{listing.description}</p>
        <hr />

        <h3>{listing.highlight}</h3>
        <p>{listing.highlightDesc}</p>
        <hr />

        <div className="booking">
          <div>
            <h2>What this place offers?</h2>
            <div className="amenities">
              {listing.amenities[0].split(",").map((item, index) => (
                <div className="facility" key={index}>
                  <div className="facility_icon">
                    {
                      facilities.find((facility) => facility.name === item)
                        ?.icon
                    }
                  </div>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2>How long do you want to stay?</h2>
            <div className="date-range-calendar">
              <DateRange ranges={dateRange} onChange={handleSelect} />
              {dayCount > 1 ? (
                <h2>
                  ${listing.price} x {dayCount} nights
                </h2>
              ) : (
                <h2>
                  ${listing.price} x {dayCount} night
                </h2>
              )}

              <h2>Total price: ${listing.price * dayCount}</h2>
              <p>Start Date: {dateRange[0].startDate.toDateString()}</p>
              <p>End Date: {dateRange[0].endDate.toDateString()}</p>

              {customerId &&

              <button className="button" type="submit" onClick={handleSubmit}>
                BOOKING
              </button>

}






            </div>
          </div>
        </div>
      </div>

      <Footer />
     
    </>
  );
};

export default ListingDetails;
