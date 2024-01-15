import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import userRoutes from './routes/user.routes';

// create express app
const app = express();

// connecting to datasource
AppDataSource.initialize().then(() => {
    console.log("Datasource initialized successfully!");   
    
}).catch(error => {
    console.error("Failed to initialize datasource");
    process.exit(1);
});

app.use(bodyParser.json());
app.get('/', (req: Request, res: Response)=>{
    res.send("Welcome to Basic OAuth")
});

app.use('/users', userRoutes);

// start express server
const port = process.env.PORT || 8000;
app.listen(port, ()=>{
    console.log(`Served is running on port ${port}`);
});
