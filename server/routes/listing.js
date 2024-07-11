const router = require("express").Router();
const upload = require("../middlewares/multerConfig");
const {createListing,getListingsByCategory,getListingsBySearch,listingController,getListingDetails} = require("../controllers/listingController");
const { auth } = require("../middlewares/auth");

/* CREATE LISTING - Protected route */
router.post("/create",auth,  upload.array("listingPhotos"), createListing);

/* GET LISTINGS BY CATEGORY */
router.get("/",getListingsByCategory);

/* GET LISTINGS BY SEARCH */
router.get("/search/:search", getListingsBySearch);

/* LISTING DETAILS */
router.get("/:listingId", getListingDetails);

module.exports = router;
