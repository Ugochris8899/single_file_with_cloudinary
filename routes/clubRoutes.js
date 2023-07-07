const express = require( 'express' );

const router = express.Router();

const {createClub,getAllClubs, getOneClub, updateClub, deleteClub} = require("../controller/clubController")


router.post("/clubs",  createClub);

router.get( '/clubs', getAllClubs );

router.get( '/clubs/:id', getOneClub );

router.put("/clubs/:id", updateClub);

router.delete( '/clubs/:id', deleteClub );




module.exports = router;