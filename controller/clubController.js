const express = require( 'express' );
const clubModel = require( '../model/clubModel' );
const cloudinary = require("cloudinary").v2;
const validator = require('fastest-validator')


const createClub = async (req, res) => {
    try {
        const {league, clubName} = req.body;
        const file = await cloudinary.uploader.upload(req.files.logo.tempFilePath, {folder: '/ugoBest'}, (logo, err) => {
            try {
                return logo
            } catch (error) {
                error.message
            }
        })
        const newClub = new clubModel({
            league,
            clubName,
            logo: file.secure_url
            
        })

        // validate users input using the fastest-validtor
        const validateSchema = {
            league: {type: "string", optional: false, min: 4, max: 50},
            clubName: {type: "String", optional: false, min: 3, max: 1000000},
            logo: {type: "string", optional: false}
        }
        const v = new validator();
        const validation = v.validate(newClub, validateSchema)
        if(!validation) {
            res.status(400).json({
                message: 'Error trying to validate',
                Error: validation[0].message
            })
        }
        // save  the corresponding input into the database
        const savedClub = await newClub.save()
        if(!savedClub){
            res.status(400).json({
                message: 'club not created'
            })
        } else {
            res.status(201).json({
                message: 'Club created successfully',
                data: savedClub
            })
        }
    } catch (error) {
        res.status(500).json({
        Error: error.message
        })
    }
}

// Get all clubs
const getAllClubs = async ( req, res ) => {
  try {
      const club = await clubModel.find();
      if ( club.length === 0 ) {
          res.status( 404 ).json( {
              message: "No club found."
          })
      } else {
          res.status( 200 ).json( {
              message: "All Clubs Present",
              data: club,
              totalClub: club.length
          })
      }
  } catch ( e ) {
      res.status( 500 ).json( {
          message: e.message
      })
  }
}
  
// Get a one family 
    const getOneClub = async(req, res) =>{
    const clubId = req.params.id;
    const club = await clubModel.findById( clubId );
    try {
        if ( !club) {
            res.status( 404 ).json( {
                message: "No club found."
            })
        } else {
            res.status( 200 ).json( {
                data: club,
            })
        }
    } catch ( e ) {
        res.status( 500 ).json( {
            message: e.message
        })
    }
  }


  // update the club
const updateClub = async(req, res) =>{
    try {
        const {league, clubName} = req.body;
        const clubId = req.params.id;
        const club = await clubModel.findById(clubId)
        const bodyData = {
            league: league || club.league,
            clubName: clubName || club.clubName,
            logo: club.logo
        }
        const result = await cloudinary.uploader.upload(req.file.path)
        if(req.file) {
            await cloudinary.uploader.destroy(club.logo)
            bodyData.logo = result.secure_url
        } else {
            const updatedClub = await clubModel.findByIdAndUpdate(clubId, bodyData, {new: true})
            return res.status(200).json({
                message: "Updated Successfully", data:updatedClub
            })
        }
    } catch (error) {
        res.status(404).json({message:error.message});
    }
}
 

// delete profile 
const deleteClub = async ( req, res ) => {
    try {
        const profile = await clubModel.findById(req.params.id);
    if (profile) {
      // Delete the image from local upload folder and Cloudinary
      if (profile.logo) {
        const publicId = profile.logo.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }

      // Delete the profile from MongoDB
      await clubModel.findByIdAndDelete(req.params.id);

      res.json({ message: 'club deleted successfully' });
    } else {
      res.status(404).json({ error: 'club not found' });
    }
    } catch ( e ) {
        res.status( 500 ).json( {
            message: e.message
        })
    }
}


  module.exports = {
    createClub,
    getAllClubs,
    getOneClub,
    updateClub,
    deleteClub
  }
