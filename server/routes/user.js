const router = require("express").Router();
const {getTripList,toggleWishList,getPropertyList,getReservationList} = require("../controllers/userController");
const { auth } = require("../middlewares/auth");

/* GET TRIP LIST - Protected route */
router.get("/:userId/trips",auth, getTripList);

/* ADD LISTING TO WISHLIST - Protected route */
router.patch("/:userId/:listingId",auth,  toggleWishList);

/* GET PROPERTY LIST - Protected route */
router.get("/:userId/properties",auth,  getPropertyList);

/* GET RESERVATION LIST - Protected route */
router.get("/:userId/reservations",auth,getReservationList);

module.exports = router;

