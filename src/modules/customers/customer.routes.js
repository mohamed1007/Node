import bcrypt from 'bcrypt';
import { validation } from '../../validation/validation.js';
import { newCustomerSchema, updateCustomerSchema } from './customerValidation.js';
import customerModel from '../../../db/models/customerModel.js';

const customerRoutes = express.Router();

customerRoutes.post("/signup", validation(newCustomerSchema), async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const existingCustomer = await customerModel.findOne({ email: req.body.email });

        if (existingCustomer) {
            return res.status(400).json({ message: "Customer already registered" });
        }

        const newCustomer = await customerModel.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            address: req.body.address,
            phones: req.body.phones
        });

        res.status(201).json({ message: "Customer added", newCustomer });
    } catch (error) {
        console.error("Error adding customer:", error);
        res.status(500).json({ message: "An error occurred while adding the customer" });
    }
});

customerRoutes.post("/signin", validation(signinSchema), async (req, res) => {
    try {
        const { email, password } = req.body;
        const found = await customerModel.findOne({ email });

        if (!found) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const correctPassword = await bcrypt.compare(password, found.password);

        if (!correctPassword) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        res.status(200).json({ message: "Customer found", found });
    } catch (error) {
        console.error("Error signing in customer:", error);
        res.status(500).json({ message: "An error occurred while signing in the customer" });
    }
});

customerRoutes.patch("/customer/update/:name", validation(updateCustomerSchema), async (req, res) => {
    try {
        const found = await customerModel.findOne({ name: req.params.name });
        
        if (!found) {
            return res.status(404).json({ message: "Customer not found" });
        }

        const correctPassword = await bcrypt.compare(req.body.password, found.password);

        if (!correctPassword) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        const hashedNewPassword = await bcrypt.hash(req.body.newPassword, 10);

        const updatedCustomer = await customerModel.findByIdAndUpdate(found._id, {
            name: req.body.name,
            email: req.body.email,
            password: hashedNewPassword,
            role: req.body.role,
            addresses: req.body.addresses 
        }, { new: true });

        res.status(200).json({ message: "Found and updated customer", updatedCustomer });
    } catch (error) {
        console.error("Error updating customer:", error);
        res.status(500).json({ message: "An error occurred while updating the customer" });
    }
});

customerRoutes.delete("/customer/:name", async (req, res) => {
    try {
        const name = req.params.name;
        const password = req.body.password;
        const repeatPassword = req.body.repeatPassword;

        if (password !== repeatPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const found = await customerModel.findOne({ name });

        if (!found) {
            return res.status(404).json({ message: "Customer not found" });
        }

        const correctPassword = await bcrypt.compare(password, found.password);

        if (!correctPassword) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        const deletedCustomer = await customerModel.findByIdAndDelete(found._id);

        res.status(200).json({ message: "Found and deleted customer", deletedCustomer });
    } catch (error) {
        console.error("Error deleting customer:", error);
        res.status(500).json({ message: "An error occurred while deleting the customer" });
    }
});

customerRoutes.get("/getCustomerByEmail/:email", async (req, res) => {
    try {
        const email = req.params.email;
        const found = await customerModel.findOne({ email });

        if (found) {
            return res.status(200).json({ message: "Customer found", found });
        } else {
            return res.status(404).json({ message: "Customer not found" });
        }
    } catch (error) {
        console.error("Error fetching customer by email:", error);
        return res.status(500).json({ message: "An error occurred while fetching the customer" });
    }
});

customerRoutes.get("/getAllCustomers", async (req, res) => {
    try {
        const found = await customerModel.find();

        if (found.length > 0) {
            return res.status(200).json({ message: "All customers", customers: found });
        } else {
            return res.status(404).json({ message: "There are no customers" });
        }
    } catch (error) {
        console.error("Error fetching all customers:", error);
        return res.status(500).json({ message: "An error occurred while fetching all customers" });
    }
});

export default customerRoutes;


