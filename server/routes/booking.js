const router = require("express").Router();
const {createBooking, getBookingsByListingId} = require("../controllers/bookingController");
const { auth } = require("../middlewares/auth");


/* CREATE BOOKING - Protected route */
router.post("/create",auth, createBooking);
router.get('/:listingId',auth, getBookingsByListingId);

module.exports = router;