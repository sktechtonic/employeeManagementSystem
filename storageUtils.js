// storageUtils.js

let employees = [];

// Add a new employee to the array and save to localStorage
// Add employee to localStorage
function addEmployee(employeeData) {
    let employees = JSON.parse(localStorage.getItem('employees')) || []; // Get existing employees or initialize as an empty array
    employees.push(employeeData); // Add the new employee data
    localStorage.setItem('employees', JSON.stringify(employees)); // Save the updated list of employees to localStorage
}


// Get all employees from localStorage
function getAllEmployee() {
    const storedEmployees = localStorage.getItem('employees');
    if (storedEmployees) {
        employees = JSON.parse(storedEmployees);
    }
    return employees;
}

// Get a specific employee by their ID
function getEmployeeById(id) {
    const employees = getAllEmployee();
    return employees.find(employee => employee.id === id);
}
// Remove an employee from the array and update localStorage
function removeEmployee(id) {
    let employees = getAllEmployee(); // Get existing employees
    employees = employees.filter(employee => employee.id !== id); // Remove the employee with the given ID
    localStorage.setItem('employees', JSON.stringify(employees)); // Save the updated list of employees to localStorage
}
// Update an employee's data and update localStorage
function updateEmployee(id, updatedData) {
    const index = employees.findIndex(employee => employee.id === id);
    if (index !== -1) {
        employees[index] = { ...employees[index], ...updatedData };
        localStorage.setItem('employees', JSON.stringify(employees));
    }
}

// Filter employees by search query (name or email)
function getEmployeeByFilters(filters) {
    const query = filters.query.toLowerCase();
    return employees.filter(employee =>
        employee.name.toLowerCase().includes(query) ||
        employee.email.toLowerCase().includes(query)
    );
}
