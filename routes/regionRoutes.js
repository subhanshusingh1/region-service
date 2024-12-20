import express from "express";
import {
  createState,
  createDistrict,
  createCity,
  createLocality,
  getRegionById,
  getRegions,
  updateRegion,
  deleteRegion,
  createOrUpdateDescription,
  getDescription,
  getRegionsAtRoot,
} from "../controllers/regionController.js"; // Controller methods for region management
import { requireAuth } from "@clerk/express"; // To ensure the user is authenticated

const router = express.Router();

// Create State
// router.post('/state', requireAuth(), createState); // Create a new state
router.post("/state", createState); // Create a new state

// Create District
// router.post('/district', requireAuth(), createDistrict); // Create a new district
router.post("/district", createDistrict); // Create a new district

// Create City
// router.post("/city", requireAuth(), createCity); // Create a new city
router.post("/city", createCity); // Create a new city

// Create Locality
// router.post("/locality", requireAuth(), createLocality); // Create a new locality
router.post("/locality", createLocality); // Create a new locality

// Get all states
router.get('/:regionType', getRegionsAtRoot);

// Correct Routes with Region Type
router.get('/district/:regionId', (req, res) => {
  req.params.regionType = 'district';
  getRegionById(req, res);
});

// Get cities by district
router.get('/city/:regionId', (req, res) => {
  req.params.regionType = 'city';
  getRegionById(req, res);
});

// Get localities by city
router.get('/locality/:regionId', (req, res) => {
  req.params.regionType = 'locality';
  getRegionById(req, res);
});

// Get All Regions of a specific type (State, District, City, Locality)
// router.get("/all/:regionType", requireAuth(), getRegions); // Get all regions by type
router.get("/all/:regionType", getRegions); // Get all regions by type

// Update a Region (e.g., name change or other details)
router.patch("/:regionType/:id", requireAuth(), updateRegion); // Update a region's details

// Delete a Region
router.delete("/:regionType/:id", requireAuth(), deleteRegion);

// Route to update description
router.post("/update-description", requireAuth(), createOrUpdateDescription);

// Route to get description
router.get("/:regionType/:id/description", getDescription);

export default router;
