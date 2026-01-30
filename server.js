import express from 'express';

// Creating an Express application
const app = express();

// Creating a port variable to listen on
const PORT = process.env.PORT || 3000;

// Telling the express to use EJS for design the pages
app.set("view engine", "ejs");

// Creating my first middleware function using static public
app.use(express.static("public"));
// Creating another middleware to read URL
app.use(express.urlencoded({ extended: true }));

//Creating a response for POST requests to /submit
app.post("/submit", (req, res) => {
    const name = req.body.name;
    res.render("index", { name: name });
});

// Creating a basic route 
app.get("/", (req,res) => {
    res.render("index", {name: null});
});

// Starting the server to listen on the specified port
// Using node server.js to start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
