import express from "express"
import cors from "cors"
import { connectToDatabase } from "./helpers/db.js";
import authRoute from "./routes/authRoute.js"
import unitRoute from "./routes/unitRoute.js"
import incidentRoute from "./routes/incidentRoute.js"
import userRoute from "./routes/userRoute.js"
import "./helpers/cronJobs.js"
import { dirname } from 'path';
import { fileURLToPath } from 'url';  // Import fileURLToPath
import path from 'path';


const app = express();

app.use(cors({
  origin: '*',  // Allow requests from any origin
}));
app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const staticPath = path.resolve(__dirname, 'client-portal', 'dist');
app.use(express.static(staticPath));

app.use("/api/api-trkclt",authRoute)
app.use("/api/api-trkclt",unitRoute)
app.use("/api/api-trkclt",incidentRoute)
app.use("/api/api-trkclt",userRoute)


app.get('*', (req, res) => {
  res.sendFile(path.resolve(staticPath, 'index.html'));
});

app.listen(7026, () => {
  console.log('Client Portal server is running on port 7026');
  connectToDatabase()
});



