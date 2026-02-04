// 1. ----------- IMPORTS -----------

import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { WebSocketServer } from 'ws'; // Add this to your imports at the top

// 2. ----------- CONFIGURATION -----------
// Creating an Express application
const app = express();
// Creating a port variable to listen on
const PORT = process.env.PORT || 3000;
// Near your PORT variable
const NODE_ENV = process.env.NODE_ENV || 'development';

// 3. ----------- DATA / CONSTANTS-----------
//Creating Variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Course data - place this after imports, before routes
const courses = {
    'CS121': {
        id: 'CS121',
        title: 'Introduction to Programming',
        description: 'Learn programming fundamentals using JavaScript and basic web development concepts.',
        credits: 3,
        sections: [
            { time: '9:00 AM', room: 'STC 392', professor: 'Brother Jack' },
            { time: '2:00 PM', room: 'STC 394', professor: 'Sister Enkey' },
            { time: '11:00 AM', room: 'STC 390', professor: 'Brother Keers' }
        ]
    },
    'MATH110': {
        id: 'MATH110',
        title: 'College Algebra',
        description: 'Fundamental algebraic concepts including functions, graphing, and problem solving.',
        credits: 4,
        sections: [
            { time: '8:00 AM', room: 'MC 301', professor: 'Sister Anderson' },
            { time: '1:00 PM', room: 'MC 305', professor: 'Brother Miller' },
            { time: '3:00 PM', room: 'MC 307', professor: 'Brother Thompson' }
        ]
    },
    'ENG101': {
        id: 'ENG101',
        title: 'Academic Writing',
        description: 'Develop writing skills for academic and professional communication.',
        credits: 3,
        sections: [
            { time: '10:00 AM', room: 'GEB 201', professor: 'Sister Anderson' },
            { time: '12:00 PM', room: 'GEB 205', professor: 'Brother Davis' },
            { time: '4:00 PM', room: 'GEB 203', professor: 'Sister Enkey' }
        ]
    }
};
// 4. ----------- GLOBAL MIDDLEWARES -----------
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

app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV.toLowerCase();
    next();
});
app.use((req, res, next) => {
    // Make NODE_ENV available to all templates
    res.locals.NODE_ENV = NODE_ENV.toLowerCase() || 'production';
    // Continue to the next middleware or route handler
    next();
});
app.use((req, res, next) => {
    // Skip logging for routes that start with /. (like /.well-known/)
    if (!req.path.startsWith('/.')) {
    }
    next(); // Pass control to the next middleware or route
});
// Middleware to add global data to all templates
app.use((req, res, next) => {
    // Add current year for copyright
    res.locals.currentYear = new Date().getFullYear();
    next();
});
// Global middleware for time-based greeting
app.use((req, res, next) => {
    const currentHour = new Date().getHours();
    if(currentHour < 12) {
        res.locals.greeting = "Good Morning"
    } else if(currentHour >= 12 && currentHour < 17){
        res.locals.greeting = "Good Afternoon"
    } else if(currentHour >= 17) {
        res.locals.greeting = "Good Evening"
    }
    next();
});
// Global middleware for random theme selection
app.use((req, res, next) => {
    const themes = ['blue-theme', 'green-theme', 'red-theme'];

    // Pick a random theme
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];

    res.locals.bodyClass = randomTheme;
    next();
});
// Global middleware to share query parameters with templates
app.use((req, res, next) => {
    // Make req.query available to all templates for debugging and conditional rendering
    res.locals.queryParams = req.query || {};
    next();
});




// 5. ----------- ROUTES -----------
app.get('/catalog', (req, res) => {
    res.render('catalog', { 
        title: 'Course Catalog', 
        courses: courses });
});
app.get("/about", (req,res) => {
    const title = 'About Page';
    res.render('about', {title});
});
app.get("/products", (req,res) => {
    const title = 'Products Page';
    res.render('products', {title});
});
app.get('/catalog/:courseId', (req, res, next) => {
    const courseId = req.params.courseId;
    const course = courses[courseId];

    if (!course) {
        const err = new Error(`Course ${courseId} not found`);
        err.status = 404;
        return next(err);
    }

    // Get sort parameter (default to 'time')
    const sortBy = req.query.sort || 'time';

    // Create a copy of sections to sort
    let sortedSections = [...course.sections];

    // Sort based on the parameter
    switch (sortBy) {
        case 'professor':
            sortedSections.sort((a, b) => a.professor.localeCompare(b.professor));
            break;
        case 'room':
            sortedSections.sort((a, b) => a.room.localeCompare(b.room));
            break;
        case 'time':
        default:
            // Keep original time order as default
            break;
    }

    console.log(`Viewing course: ${courseId}, sorted by: ${sortBy}`);

    res.render('course-detail', {
        title: `${course.id} - ${course.title}`,
        course: { ...course, sections: sortedSections },
        currentSort: sortBy
    });
});
const addDemoHeaders = (req, res, next) => {
    res.set({
        'X-Demo-Page': 'true',
        'X-Middleware-Demo': 'Route-specific middleware active'
    });
    next();
};
app.get('/demo', addDemoHeaders, (req, res) => {
    res.render('demo', {
        title: 'Middleware Demo Page'
    });
});

// Creating a route for the html files pages
app.get("/", (req,res) => {
    const title = 'Home Page';
    res.render('home', {title});
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

// 6. ----------- ERROR HANDLING -----------

// Handling 404 errors for undefined routes
app.use((req, res, next) => {
    const err = new Error("Page Not Found");
    err.status = 404;
    next(err);
});
// Test route to trigger a 500 error
app.get('/test-error', (req, res, next) => {
    const err = new Error('This is a test error');
    err.status = 500;
    next(err);
});

// Global error handler
app.use((err, req, res, next) => {
    // Prevent infinite loops, if a response has already been sent, do nothing
    if (res.headersSent || res.finished) {
        return next(err);
    }
    // Determine status and template
    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';
    // Prepare data for the template
    const context = {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: NODE_ENV === 'production' ? 'An error occurred' : err.message,
        stack: NODE_ENV === 'production' ? null : err.stack,
        NODE_ENV // Our WebSocket check needs this and its convenient to pass along
    };
    // Render the appropriate error template with fallback
    try {
        res.status(status).render(`errors/${template}`, context);
    } catch (renderErr) {
        // If rendering fails, send a simple error page instead
        if (!res.headersSent) {
            res.status(status).send(`<h1>Error ${status}</h1><p>An error occurred.</p>`);
        }
    }
});

// 7. ----------- SERVER LISTENING -----------
// Starting the server to listen on the specified port
// Using node server.js to start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
