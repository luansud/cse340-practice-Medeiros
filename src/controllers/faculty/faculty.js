import { getFacultyById, getSortedFaculty } from '../../models/faculty/faculty.js';

/**
 * Route handler for the faculty list page
 * Displays all faculty members with optional sorting
 */
const facultyListPage = (req, res) => {
    // Get sort parameter from query string, default to 'name'
    const sortBy = req.query.sort || 'name';
    
    // Get sorted faculty array from model
    const facultyList = getSortedFaculty(sortBy);
    
    res.render('faculty/list', {
        title: 'Faculty Directory',
        faculty: facultyList,
        currentSort: sortBy
    });
};

/**
 * Route handler for individual faculty detail page
 * Uses route parameter to display specific faculty member
 */
const facultyDetailPage = (req, res, next) => {
    const facultyId = req.params.facultyId;
    const facultyMember = getFacultyById(facultyId);
    
    // If faculty member doesn't exist, create 404 error
    if (!facultyMember) {
        const err = new Error(`Faculty member ${facultyId} not found`);
        err.status = 404;
        return next(err);
    }
    
    res.render('faculty/detail', {
        title: `${facultyMember.name} - Faculty Profile`,
        faculty: { ...facultyMember, id: facultyId }
    });
};

export { facultyListPage, facultyDetailPage };
