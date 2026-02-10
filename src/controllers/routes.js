import { Router } from 'express';
// Import middleware
import { addDemoHeaders } from '../middleware/demo/headers.js';
// Import catalog controllers
import { catalogPage, courseDetailPage } from './catalog/catalog.js';
// Import basic page controllers
import { homePage, aboutPage, demoPage, testErrorPage } from './index.js';
// Import faculty controllers
import { facultyListPage, facultyDetailPage } from './faculty/faculty.js';



// Create a new router instance
const router = Router();

// Home and basic pages
router.get('/', homePage);
router.get('/about', aboutPage);

// Course catalog routes
router.get('/catalog', catalogPage);
router.get('/catalog/:courseId', courseDetailPage);

// Faculty routes
router.get('/faculty', facultyListPage);
router.get('/faculty/:facultyId', facultyDetailPage);

// Demo page with special middleware
router.get('/demo', addDemoHeaders, demoPage);

// Route to trigger a test error
router.get('/test-error', testErrorPage);

export default router;
