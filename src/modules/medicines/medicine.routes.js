import express from 'express';
import { newMedicineSchema, updateMedicineSchema } from './medicine.validation.js';
import medicineModel from '../../../db/models/medicineModel.js';
import { validateCategory, validation } from '../../validation/validation.js';

const medicineRoutes = express.Router();

medicineRoutes.post("/addMedicine", validateCategory, validation(newMedicineSchema), async (req, res) => {
    try {
        const newMedicine = await medicineModel.findOneAndUpdate(
            { name: req.body.name },
            { ...req.body, category: req.body.categoryId },
            { upsert: true, new: true }
        );

        res.status(201).json({ message: "Medicine added successfully", newMedicine });
    } catch (error) {
        console.error("Error adding medicine:", error);
        res.status(500).json({ message: "An error occurred while adding the medicine" });
    }
});

medicineRoutes.patch("/updateMedicine/:name", validateCategory, validation(updateMedicineSchema), async (req, res) => {
    const { price, image, mfgDate, expDate, company, stock } = req.body;

    try {
        const found = await medicineModel.findOneAndUpdate(
            { name: req.params.name },
            { price, image, mfgDate, expDate, company, stock, category: req.body.categoryId },
            { new: true }
        );

        if (found) {
            res.json({ message: "Medicine updated successfully", found });
        } else {
            res.status(404).json({ message: "Medicine not found" });
        }
    } catch (error) {
        console.error("Error updating medicine:", error);
        res.status(500).json({ message: "An error occurred while updating the medicine" });
    }
});

medicineRoutes.delete("/deleteMedicine/:name", async (req, res) => {
    try {
        const name = req.params.name;
        const found = await medicineModel.findOneAndDelete({ name: name });

        if (found) {
            res.status(200).json({ message: "Medicine deleted successfully", found });
        } else {
            res.status(404).json({ message: "Medicine not found" });
        }
    } catch (error) {
        console.error("Error deleting medicine:", error);
        res.status(500).json({ message: "An error occurred while deleting the medicine" });
    }
});

medicineRoutes.get("/getAllMedicines", async (req, res) => {
    try {
        const allMedicines = await medicineModel.find().lean();

        if (allMedicines.length > 0) {
            res.json({ message: "Medicines found", allMedicines });
        } else {
            res.status(404).json({ message: "No medicines found" });
        }
    } catch (error) {
        console.error("Error fetching medicines:", error);
        res.status(500).json({ message: "An error occurred while fetching medicines" });
    }
});

medicineRoutes.get("/getMedicineByName/:name", async (req, res) => {
    try {
        const name = req.params.name;
        const found = await medicineModel.findOne({ name: { $regex: new RegExp(name, "i") } });

        if (found) {
            res.json({ message: "Medicine found", found });
        } else {
            res.status(404).json({ message: "Medicine not found" });
        }
    } catch (error) {
        console.error("Error fetching medicine:", error);
        res.status(500).json({ message: "An error occurred while fetching the medicine" });
    }
});

medicineRoutes.get("/getMedicineByCategory/:category", async (req, res) => {
    try {
        const category = req.params.category;
        const found = await medicineModel.find({ category: { $regex: new RegExp(category, "i") } });

        if (found.length > 0) {
            res.json({ message: "Medicines found", found });
        } else {
            res.status(404).json({ message: "No medicines found for the specified category" });
        }
    } catch (error) {
        console.error("Error fetching medicines by category:", error);
        res.status(500).json({ message: "An error occurred while fetching medicines by category" });
    }
});

export default medicineRoutes;
