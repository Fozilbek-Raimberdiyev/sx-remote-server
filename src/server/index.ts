import express from "express"
import {config} from "dotenv"
import mongoose from "mongoose";
import router from "./src/routes";
import cors from "cors"
const app = express();
const dotenv = config();
app.use(express.static("public"));
app.use(express.json());
app.use(cors({
    origin : "*",
    credentials : true,
    methods : ["GET","POST","PUT","DELETE"],
    allowedHeaders : ["Content-Type","Authorization"],
}))
// api routes
app.use("/api", router);
app.get("any", (req, res) => {
    res.send("Hello World");  
})

// connection to database
mongoose.connect(dotenv.parsed.DB_URL || "mongodb://localhost:27017/sx-remote-server").then((res) => {
    console.log("Connected to database");
}).catch((err) => {
    console.log("Error connecting to database", err);
});

app.listen(dotenv.parsed.PORT || 3000, () => {
    console.log("Server started on port", dotenv.parsed.PORT || 3000);
});
