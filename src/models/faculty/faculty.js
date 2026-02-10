const faculty = {
    'brother-jack': {
        name: 'Brother Jack',
        office: 'STC 392',
        phone: '208-496-1234',
        email: 'jackb@byui.edu',
        department: 'Computer Science',
        title: 'Associate Professor'
    },
    'sister-enkey': {
        name: 'Sister Enkey',
        office: 'STC 394',
        phone: '208-496-2345', 
        email: 'enkeys@byui.edu',
        department: 'Computer Science',
        title: 'Assistant Professor'
    },
    'brother-keers': {
        name: 'Brother Keers',
        office: 'STC 390',
        phone: '208-496-3456',
        email: 'keersb@byui.edu',
        department: 'Computer Science', 
        title: 'Professor'
    },
    'sister-anderson': {
        name: 'Sister Anderson',
        office: 'MC 301',
        phone: '208-496-4567',
        email: 'andersons@byui.edu',
        department: 'Mathematics',
        title: 'Professor'
    },
    'brother-miller': {
        name: 'Brother Miller',
        office: 'MC 305',
        phone: '208-496-5678',
        email: 'millerb@byui.edu',
        department: 'Mathematics',
        title: 'Associate Professor'
    },
    'brother-thompson': {
        name: 'Brother Thompson', 
        office: 'MC 307',
        phone: '208-496-6789',
        email: 'thompsonb@byui.edu',
        department: 'Mathematics',
        title: 'Assistant Professor'
    },
    'brother-davis': {
        name: 'Brother Davis',
        office: 'GEB 205',
        phone: '208-496-7890',
        email: 'davisb@byui.edu',
        department: 'English',
        title: 'Professor'
    },
    'brother-wilson': {
        name: 'Brother Wilson',
        office: 'GEB 301', 
        phone: '208-496-8901',
        email: 'wilsonb@byui.edu',
        department: 'History',
        title: 'Associate Professor'
    },
    'sister-roberts': {
        name: 'Sister Roberts',
        office: 'GEB 305',
        phone: '208-496-9012',
        email: 'robertss@byui.edu',
        department: 'History', 
        title: 'Assistant Professor'
    }
};

/**
 * Get a faculty member by their ID
 * @param {string} facultyId - The faculty member's ID (e.g., 'brother-jack')
 * @returns {object|null} The faculty member object or null if not found
 */
const getFacultyById = (facultyId) => {
    return faculty[facultyId] || null;
};

/**
 * Get all faculty members sorted by a specified property
 * @param {string} sortBy - Property to sort by: 'name', 'department', or 'title'
 * @returns {array} Array of faculty members sorted by the specified property
 */
const getSortedFaculty = (sortBy = 'name') => {
    // Validate sortBy parameter - only allow name, department, or title
    const validSortOptions = ['name', 'department', 'title'];
    const sortField = validSortOptions.includes(sortBy) ? sortBy : 'name';
    
    // Create an array of all faculty members with their IDs
    const facultyArray = [];
    for (const key in faculty) {
        facultyArray.push({ ...faculty[key], id: key });
    }

    // Sort the array by the chosen property
    facultyArray.sort((a, b) => {
        const valueA = a[sortField];
        const valueB = b[sortField];
        
        if (valueA < valueB) {
            return -1;
        }
        if (valueA > valueB) {
            return 1;
        }
        return 0; // They are equal
    });

    return facultyArray;
};

export { getFacultyById, getSortedFaculty };
