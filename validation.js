// Validation.js

// Function to validate employee form
function validateEmployeeForm(employeeData) {
    // Basic validation to check if required fields are filled
    if (!employeeData.name || !employeeData.email || !employeeData.gender) {
      Swal.fire('Error', 'Please fill in all fields correctly!', 'error');
      return false;
    }
    // Email validation
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(employeeData.email)) {
      Swal.fire('Error', 'Please enter a valid email!', 'error');
      return false;
    }
    return true;
  }
  