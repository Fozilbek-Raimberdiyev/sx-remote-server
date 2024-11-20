import express from "express"

const app = express();

app.use(express.static("public"));
app.use(express.json())
app.get("any", (req, res) => {
    res.send("Hello World");  
})

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
