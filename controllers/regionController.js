import mongoose from "mongoose";
import { State, District, City, Locality } from "../models/Region.js";
import { clerkClient } from "@clerk/express";

// Create a new state
export const createState = async (req, res) => {
  try {
    // if (req.auth.role !== 'admin') {
    //   return res.status(403).json({ message: 'Forbidden' });
    // }

    const { name, code } = req.body;

    // Check if state with the same name or code already exists
    const existingState = await State.findOne({ $or: [{ name }, { code }] });
    if (existingState) {
      return res
        .status(400)
        .json({ message: "State already exists with this name or code." });
    }

    const newState = new State({ name, code });
    await newState.save();
    res.status(201).json(newState);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new district
export const createDistrict = async (req, res) => {
  try {
    // if (req.auth.role !== 'admin') {
    //   return res.status(403).json({ message: 'Forbidden' });
    // }

    const { name, stateId } = req.body;

    // Check if district with the same name and stateId already exists
    const existingDistrict = await District.findOne({ name, stateId });
    if (existingDistrict) {
      return res
        .status(400)
        .json({ message: "District already exists in this state." });
    }

    const newDistrict = new District({ name, stateId });
    await newDistrict.save();
    res.status(201).json(newDistrict);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new city
export const createCity = async (req, res) => {
  try {
    // if (req.auth.role !== 'admin') {
    //   return res.status(403).json({ message: 'Forbidden' });
    // }

    const { name, districtId } = req.body;

    // Check if city with the same name and districtId already exists
    const existingCity = await City.findOne({ name, districtId });
    if (existingCity) {
      return res
        .status(400)
        .json({ message: "City already exists in this district." });
    }

    const newCity = new City({ name, districtId });
    await newCity.save();
    res.status(201).json(newCity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new locality
export const createLocality = async (req, res) => {
  try {
    // if (req.auth.role !== 'admin') {
    //   return res.status(403).json({ message: 'Forbidden' });
    // }

    const { name, cityId, description } = req.body;

    // Check if locality with the same name and cityId already exists
    const existingLocality = await Locality.findOne({ name, cityId });
    if (existingLocality) {
      return res
        .status(400)
        .json({ message: "Locality already exists in this city." });
    }

    const newLocality = new Locality({ name, cityId, description });
    await newLocality.save();
    res.status(201).json(newLocality);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get regions based on type (State, District, City, Locality)
export const getRegions = async (req, res) => {
  try {
    const { regionType } = req.query; // e.g., "state", "district", etc.
    let regions;

    switch (regionType) {
      case "state":
        regions = await State.find();
        break;
      case "district":
        regions = await District.find();
        break;
      case "city":
        regions = await City.find();
        break;
      case "locality":
        regions = await Locality.find();
        break;
      default:
        return res.status(400).json({ message: "Invalid region type" });
    }

    res.status(200).json(regions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a region (e.g., name change)
export const updateRegion = async (req, res) => {
  try {
    const { regionType, id } = req.params;

    let updatedRegion;

    switch (regionType) {
      case "state":
        updatedRegion = await State.findByIdAndUpdate(id, req.body, {
          new: true,
        });
        break;
      case "district":
        updatedRegion = await District.findByIdAndUpdate(id, req.body, {
          new: true,
        });
        break;
      case "city":
        updatedRegion = await City.findByIdAndUpdate(id, req.body, {
          new: true,
        });
        break;
      case "locality":
        updatedRegion = await Locality.findByIdAndUpdate(id, req.body, {
          new: true,
        });
        break;
      default:
        return res.status(400).json({ message: "Invalid region type" });
    }

    if (!updatedRegion) {
      return res.status(404).json({ message: "Region not found" });
    }

    res.status(200).json(updatedRegion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a region
export const deleteRegion = async (req, res) => {
  try {
    const { regionType, id } = req.params;

    let deletedRegion;

    switch (regionType) {
      case "state":
        deletedRegion = await State.findByIdAndDelete(id);
        break;
      case "district":
        deletedRegion = await District.findByIdAndDelete(id);
        break;
      case "city":
        deletedRegion = await City.findByIdAndDelete(id);
        break;
      case "locality":
        deletedRegion = await Locality.findByIdAndDelete(id);
        break;
      default:
        return res.status(400).json({ message: "Invalid region type" });
    }

    if (!deletedRegion) {
      return res.status(404).json({ message: "Region not found" });
    }

    res.status(200).json({ message: "Region deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to fetch root-level regions (e.g., states)
export const getRegionsAtRoot = async (req, res) => {
  try {
    const { regionType } = req.params;

    let regions;
    switch (regionType.toLowerCase()) {
      case "state":
        regions = await State.find({}, { name: 1, _id: 1 });
        break;
      default:
        return res.status(400).json({ success: false, message: "Invalid region type" });
    }

    return res.status(200).json({ success: true, data: regions });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Controller to get region by ID
// Existing controller for child regions
export const getRegionById = async (req, res) => {
  try {
    const { regionType, regionId } = req.params;

    // VaregionIdate ID format
    if (!mongoose.Types.ObjectId.isValid(regionId)) {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }

    let regions;
    const projection = { name: 1, _id: 1 };

    switch (regionType.toLowerCase()) {
      case "district":
        regions = await District.find({ stateId: regionId }, projection);
        break;
      case "city":
        regions = await City.find({ districtId: regionId }, projection);
        break;
      case "locality":
        regions = await Locality.find({ cityId: regionId }, projection);
        break;
      default:
        return res.status(400).json({ success: false, message: "Invalid region type" });
    }

    if (!regions || regions.length === 0) {
      return res.status(404).json({ success: false, message: "No regions found" });
    }

    return res.status(200).json({ success: true, data: regions });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Create or update description for a region
export const createOrUpdateDescription = async (req, res) => {
  const { regionId, description, regionType } = req.body; // regionType can be 'state', 'district', 'city', or 'locality'

  try {
    let region;
    switch (regionType) {
      case "state":
        region = await State.findById(regionId);
        break;
      case "district":
        region = await District.findById(regionId);
        break;
      case "city":
        region = await City.findById(regionId);
        break;
      case "locality":
        region = await Locality.findById(regionId);
        break;
      default:
        return res.status(400).json({ message: "Invalid region type" });
    }

    if (!region) {
      return res.status(404).json({ message: `${regionType} not found` });
    }

    region.description = description; // Set the description field
    await region.save();

    res
      .status(200)
      .json({
        message: `${regionType} description updated successfully`,
        region,
      });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating description", error: err.message });
  }
};

// Get description for a region
// export const getDescription = async (req, res) => {
//   const { id, regionType } = req.params;

//   try {
//     let region;
//     switch (regionType) {
//       case "state":
//         region = await State.findById(id);
//         break;
//       case "district":
//         region = await District.findById(id);
//         break;
//       case "city":
//         region = await City.findById(id);
//         break;
//       case "locality":
//         region = await Locality.findById(id);
//         break;
//       default:
//         return res.status(400).json({ message: "Invalid region type" });
//     }

//     if (!region) {
//       return res.status(404).json({ message: `${regionType} not found` });
//     }

//     res.status(200).json({ name: region.name , description: region.description });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Error fetching description", error: err.message });
//   }
// };

export const getDescription = async (req, res) => {
  const { id, regionType } = req.params;

  try {
    let region;
    const regionModels = {
      state: State,
      district: District,
      city: City,
      locality: Locality
    };

    const Model = regionModels[regionType];
    if (!Model) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid region type" 
      });
    }

    region = await Model.findById(id);
    if (!region) {
      return res.status(404).json({ 
        success: false,
        message: `${regionType} not found` 
      });
    }

    res.status(200).json({
      success: true,
      data: {
        name: region.name,
        description: region.description
      }
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: "Error fetching region data",
      error: err.message 
    });
  }
};
