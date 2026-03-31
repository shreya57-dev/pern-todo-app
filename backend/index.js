import express from 'express';
import cors from "cors";
import todoRoutes from "./routes/todo.js";

const app=express();

app.use(cors());//to enable cors so that react app can communicate with this server 
app.use(express.json());//parse incomming json requests and puts the data inside req.body

app.use("/todos",todoRoutes);//any req we have at /todos will be handled by todoRoutes

app.listen(5000,()=>{
    console.log("Server is running on port 5000");
});