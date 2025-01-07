// Get all employees from localStorage
function getAllEmployee() {
    return JSON.parse(localStorage.getItem('employees')) || [];
}

// Add employee to localStorage
function addEmployee(employeeData) {
    let employees = getAllEmployee(); // Get existing employees or initialize as an empty array
    employees.push(employeeData); // Add the new employee data
    localStorage.setItem('employees', JSON.stringify(employees)); // Save the updated list of employees to localStorage
}

// Update employee in localStorage
function updateEmployee(id, updatedData) {
    let employees = getAllEmployee(); // Get existing employees
    const index = employees.findIndex(employee => employee.id === id); // Find the employee by ID

    if (index !== -1) {
        employees[index] = { ...employees[index], ...updatedData }; // Update the employee data
        localStorage.setItem('employees', JSON.stringify(employees)); // Save the updated list of employees to localStorage
    }
}

// Validate employee form
function validateEmployeeForm(employeeData) {
    if (!employeeData.name || !employeeData.email || !employeeData.gender || !employeeData.dob || !employeeData.role) {
        Swal.fire('Error', 'Please fill in all the fields!', 'error');
        return false;
    }

    // Check if the email format is valid
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(employeeData.email)) {
        Swal.fire('Error', 'Please enter a valid email address!', 'error');
        return false;
    }

    return true;  // All validations passed
}

// Get employee by ID
function getEmployeeById(id) {
    const employees = getAllEmployee();
    return employees.find(employee => employee.id === id);
}

// Remove employee from localStorage
function removeEmployee(id) {
    let employees = getAllEmployee(); // Get existing employees
    employees = employees.filter(employee => employee.id !== id); // Remove the employee with the given ID
    localStorage.setItem('employees', JSON.stringify(employees)); // Save the updated list of employees to localStorage
}

// Add event listeners on page load
window.onload = function () {
    // Render employee table when the page loads
    renderEmployeeTable();

    // Event listener for the add employee button
    document.getElementById('addEmployeeBtn').addEventListener('click', showAddEmployeeModal);

    // Event listener for submitting the employee form
    document.getElementById('submitEmployeeBtn').addEventListener('click', submitEmployeeForm);

    // Event listener for searching employees
    document.getElementById('searchEmployee').addEventListener('input', searchEmployee);
};

// Show modal for adding a new employee
function showAddEmployeeModal() {
    clearForm();
    const modal = new bootstrap.Modal(document.getElementById('employeeModal'));
    modal.show();  // Show the modal
}

// Submit the employee form and add or update the employee in localStorage
function submitEmployeeForm() {
    const employeeData = {
        id: Date.now(),
        name: document.getElementById('username').value,
        email: document.getElementById('email').value,
        gender: document.querySelector('input[name="gender"]:checked')?.value,
        dob: document.getElementById('dob').value,
        role: document.getElementById('role').value,
        image: document.getElementById('image').files[0]?.name || '',
    };

    // Validate form data
    if (!validateEmployeeForm(employeeData)) {
        return;
    }

    // Check if we're updating an employee (id exists)
    if (employeeData.id && employeeData.id !== 'new') {
        updateEmployee(employeeData.id, employeeData); // Update the existing employee
        Swal.fire('Success', 'Employee updated successfully!', 'success');
    } else {
        addEmployee(employeeData); // Add a new employee
        Swal.fire('Success', 'Employee added successfully!', 'success');
    }

    renderEmployeeTable();

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('employeeModal'));
    modal.hide();
}

// Render the employee table from localStorage
function renderEmployeeTable() {
    const employees = getAllEmployee();
    const tbody = document.getElementById('employeeTableBody');
    tbody.innerHTML = '';

    employees.forEach((employee) => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${employee.name}</td>
        <td>${employee.email}</td>
        <td>${employee.gender}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="editEmployee(${employee.id})"><i class="fas fa-edit"></i></button>
          <button class="btn btn-sm btn-danger" onclick="deleteEmployee(${employee.id})"><i class="fas fa-trash"></i></button>
          <button class="btn btn-sm btn-info" onclick="toggleDetails(this)"><i class="fas fa-plus"></i></button>
        </td>
      `;

        const detailsRow = document.createElement('tr');
        detailsRow.classList.add('collapse');
        detailsRow.innerHTML = `
        <td colspan="4">
          <strong>Date of Birth:</strong> ${employee.dob}<br>
          <strong>Role:</strong> ${employee.role}<br>
          <strong>Image:</strong> ${employee.image || 'N/A'}
        </td>
      `;
        tbody.appendChild(row);
        tbody.appendChild(detailsRow);
    });
}

// Edit employee data
function editEmployee(id) {
    const employee = getEmployeeById(id);

    if (!employee) return;

    document.getElementById('username').value = employee.name;
    document.getElementById('email').value = employee.email;
    document.querySelector(`input[name="gender"][value="${employee.gender}"]`).checked = true;
    document.getElementById('dob').value = employee.dob;
    document.getElementById('role').value = employee.role;

    // Set the id of the employee to indicate we're editing
    document.getElementById('submitEmployeeBtn').setAttribute('data-employee-id', id);

    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('employeeModal'));
    modal.show();

    // Change the submit button to update employee
    document.getElementById('submitEmployeeBtn').onclick = function () {
        const updatedData = {
            name: document.getElementById('username').value,
            email: document.getElementById('email').value,
            gender: document.querySelector('input[name="gender"]:checked')?.value,
            dob: document.getElementById('dob').value,
            role: document.getElementById('role').value,
            image: document.getElementById('image').files[0]?.name || employee.image,
        };

        updateEmployee(id, updatedData); // Update the employee data

        renderEmployeeTable();
        const modal = bootstrap.Modal.getInstance(document.getElementById('employeeModal'));
        modal.hide();
        Swal.fire('Success', 'Employee updated successfully!', 'success');
    };
}

// Delete an employee
function deleteEmployee(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
        if (result.isConfirmed) {
            removeEmployee(id);
            renderEmployeeTable();
            Swal.fire('Deleted!', 'The employee has been deleted.', 'success');
        }
    });
}

// Search employee based on the query
function searchEmployee(event) {
    const query = event.target.value.toLowerCase();
    const filteredEmployees = getEmployeeByFilters(query);
    renderEmployeeTable(filteredEmployees);
}

// Filter employees by name, email, or role
function getEmployeeByFilters(query) {
    const employees = getAllEmployee();
    return employees.filter(employee =>
        employee.name.toLowerCase().includes(query) ||
        employee.email.toLowerCase().includes(query) ||
        employee.role.toLowerCase().includes(query)
    );
}

// Toggle employee details
function toggleDetails(button) {
    const detailsRow = button.closest('tr').nextElementSibling;
    detailsRow.classList.toggle('collapse');

    // Toggle the icon
    button.querySelector('i').classList.toggle('fa-plus');
    button.querySelector('i').classList.toggle('fa-minus');
}

// Clear the form data
function clearForm() {
    document.getElementById('employeeForm').reset();
}
