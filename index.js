import express from 'express';
import initConnection from "./db/initConnection.js";
import medicineRoutes from './src/modules/medicines/medicine.routes.js';
import categoryRoutes from './src/modules/categories/category.routes.js';

initConnection();
const server = express();
server.use(express.json())
server.use(medicineRoutes)
server.use(categoryRoutes)

server.listen(3000);
export default server