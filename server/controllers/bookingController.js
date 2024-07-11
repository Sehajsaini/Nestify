const Booking = require("../models/Booking");
const Listing = require("../models/Listing");
/* CREATE BOOKING */
exports.createBooking = async (req, res) => {
  try {
    const { customerId, hostId, listingId, startDate, endDate, totalPrice } = req.body;
    const listing = await Listing.findById(listingId);

    if (listing.type ==="An entire place" ) {
    const existingBookings = await Booking.find({ listingId });

    for (const booking of existingBookings) {
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);

      if (
        (new Date(startDate) >= bookingStart && new Date(startDate) <= bookingEnd) ||
        (new Date(endDate) >= bookingStart && new Date(endDate) <= bookingEnd) ||
        (new Date(startDate) <= bookingStart && new Date(endDate) >= bookingEnd)
      ) {
        return res.status(400).json({ message: "The selected date range is not available." });
      }
    }
  

  }









   

    const newBooking = new Booking({ customerId, hostId, listingId, startDate, endDate, totalPrice });
    await newBooking.save();
    res.status(200).json(newBooking);
  



  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Failed to create a new booking!", error: err.message });
  }
};


exports.getBookingsByListingId = async (req, res) => {
  const { listingId } = req.params;

  try {
    const bookings = await Booking.find({ listingId });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
