import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { WebSocketServer } from 'ws'; // Add this to your imports at the top

// Creating an Express application
const app = express();
// Creating a port variable to listen on
const PORT = process.env.PORT || 3000;
// Near your PORT variable
const NODE_ENV = process.env.NODE_ENV || 'development';

//Creating Variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Telling the express to use EJS for design the pages
app.set("view engine", "ejs");
// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));


// Creating my first middleware function using static public
app.use(express.static("public"));
// Creating another middleware to read URL
app.use(express.urlencoded({ extended: true }));

//Creating a response for POST requests to /submit
//app.post("/submit", (req, res) => {
//    const name = req.body.name;
//    res.render("index", { name: name });
//});

// Creating a basic route 
//app.get("/", (req,res) => {
//    res.render("index", {name: null});
//});

app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV.toLowerCase();
    next();
});

// Creating a route with a URL parameter for practice
//app.get("/users/:userId", (req, res) => {
//    const userId = req.params.userId;
//    res.send(`User ID requested: ${userId}`);
//    // Simulating a user fetch operation
//});

// Creating a route for the html files pages
app.get("/", (req,res) => {
    const title = 'Home Page';
    res.render('home', {title});
});
app.get("/about", (req,res) => {
    const title = 'About Page';
    res.render('about', {title});
});
app.get("/products", (req,res) => {
    const title = 'Products Page';
    res.render('products', {title});
});

app.use((req, res, next) => {
    // Make NODE_ENV available to all templates
    res.locals.NODE_ENV = NODE_ENV.toLowerCase() || 'production';
    // Continue to the next middleware or route handler
    next();
});

// When in development mode, start a WebSocket server for live reloading
if (NODE_ENV.includes('dev')) {
    const ws = await import('ws');

    try {
        const wsPort = parseInt(PORT) + 1;
        const wsServer = new ws.WebSocketServer({ port: wsPort });

        wsServer.on('listening', () => {
            console.log(`WebSocket server is running on port ${wsPort}`);
        });

        wsServer.on('error', (error) => {
            console.error('WebSocket server error:', error);
        });
    } catch (error) {
        console.error('Failed to start WebSocket server:', error);
    }
}


// Handling 404 errors for undefined routes
app.use((req, res, next) => {
    res.status(404).render("404",{pageTitle: "Page not found", path: req.url});
});

// Handling 500 errors for server issues
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("500",{pageTitle: "Server Error", path: req.url});
});


// Starting the server to listen on the specified port
// Using node server.js to start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
