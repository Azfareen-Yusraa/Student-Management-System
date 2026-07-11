// =============================
// Select HTML Elements
// =============================

const studentForm = document.getElementById("studentForm");
const studentList = document.getElementById("studentList");
const searchInput = document.getElementById("searchInput");
const totalStudents = document.getElementById("totalStudents");
const totalCourses = document.getElementById("totalCourses");
const courseChart = document.getElementById("courseChart");
const toast = document.getElementById("toast");
const exportBtn = document.getElementById("exportBtn");

let chart;
// =============================
// Student Data
// =============================

let students = JSON.parse(localStorage.getItem("students")) || [];
let editIndex = -1;

// =============================
// Load Students When Page Opens
// =============================

document.addEventListener("DOMContentLoaded", () => {
    renderStudents();
    updateDashboard();
});

// =============================
// Search Event
// =============================

searchInput.addEventListener("keyup", searchStudents);
exportBtn.addEventListener("click", exportCSV);

// =============================
// Form Submit Event
// =============================

studentForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const studentId = document.getElementById("studentId").value.trim();
    const email = document.getElementById("email").value.trim();
    const course = document.getElementById("course").value.trim();

    if (
        name === "" ||
        studentId === "" ||
        email === "" ||
        course === ""
    ) {
        showToast("Please fill all fields.");
        return;
    }

// Check for duplicate Student ID
const duplicateStudent = students.find((student, index) => {

    return (
        student.studentId === studentId &&
        index !== editIndex
    );

});

if (duplicateStudent) {

    showToast("Student ID already exists!");

    return;

}

    const student = {
        name,
        studentId,
        email,
        course
    };

    // Update Existing Student
    if (editIndex !== -1) {

        students[editIndex] = student;
        editIndex = -1;

        studentForm.querySelector("button").textContent = "Add Student";

    }
    // Add New Student
    else {

        students.push(student);

    }

    saveStudents();
    renderStudents();
    updateDashboard();

    studentForm.reset();
    showToast("Student added successfully!");

});

// =============================
// Display Students
// =============================

function renderStudents() {

    studentList.innerHTML = "";

    if (students.length === 0) {

        studentList.innerHTML = `
        <tr>
            <td colspan="5" class="empty">
                No students added yet.
            </td>
        </tr>
        `;

        return;
    }

    students.forEach((student, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `
        <td>${student.name}</td>
        <td>${student.studentId}</td>
        <td>${student.email}</td>
        <td>${student.course}</td>

        <td>
            <button
                class="action-btn edit-btn"
                onclick="editStudent(${index})">
                Edit
            </button>

            <button
                class="action-btn delete-btn"
                onclick="deleteStudent(${index})">
                Delete
            </button>
        </td>
        `;

        studentList.appendChild(row);

    });

}

// =============================
// Delete Student
// =============================

function deleteStudent(index) {

    const confirmDelete = confirm("Are you sure you want to delete this student?");

    if (confirmDelete) {

        students.splice(index, 1);

        saveStudents();
        renderStudents();
        updateDashboard();
        showToast("Student deleted successfully!");

    }

}

// =============================
// Edit Student
// =============================

function editStudent(index) {

    const student = students[index];

    document.getElementById("name").value = student.name;
    document.getElementById("studentId").value = student.studentId;
    document.getElementById("email").value = student.email;
    document.getElementById("course").value = student.course;

    editIndex = index;

    studentForm.querySelector("button").textContent = "Update Student";

}

// =============================
// Save Data
// =============================

function saveStudents() {

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );

}

// =============================
// Search Students
// =============================

function searchStudents() {

    const searchText = searchInput.value.toLowerCase();

    // Show all students if search box is empty
    if (searchText === "") {
        renderStudents();
        return;
    }

    const filteredStudents = students.filter(student => {

        return (

            student.name.toLowerCase().includes(searchText) ||

            student.studentId.toLowerCase().includes(searchText) ||

            student.course.toLowerCase().includes(searchText)

        );

    });

    displayFilteredStudents(filteredStudents);

}

// =============================
// Display Search Results
// =============================

function displayFilteredStudents(data) {

    studentList.innerHTML = "";

    if (data.length === 0) {

        studentList.innerHTML = `
        <tr>
            <td colspan="5" class="empty">
                No matching students found.
            </td>
        </tr>
        `;

        return;

    }

    data.forEach((student) => {

        const index = students.indexOf(student);

        const row = document.createElement("tr");

        row.innerHTML = `
        <td>${student.name}</td>
        <td>${student.studentId}</td>
        <td>${student.email}</td>
        <td>${student.course}</td>

        <td>

            <button
                class="action-btn edit-btn"
                onclick="editStudent(${index})">
                Edit
            </button>

            <button
                class="action-btn delete-btn"
                onclick="deleteStudent(${index})">
                Delete
            </button>

        </td>
        `;

        studentList.appendChild(row);

    });

}

// =============================
// Toast Notification
// =============================

function showToast(message){

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}

// =============================
// Export CSV
// =============================

function exportCSV(){

    if(students.length===0){

        showToast("No student data to export.");

        return;

    }

    let csv =
        "Name,Student ID,Email,Course\n";

    students.forEach(student=>{

        csv += `"${student.name}","${student.studentId}","${student.email}","${student.course}"\n`;

    });

    const blob = new Blob([csv],{
        type:"text/csv"
    });

    const url =
        window.URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download = "students.csv";

    a.click();

    window.URL.revokeObjectURL(url);

    showToast("CSV exported successfully!");

}

// =============================
// Dashboard Statistics & Chart
// =============================

function updateDashboard() {

    // Total Students
    totalStudents.textContent = students.length;

    // Count students per course
    const courseCount = {};

    students.forEach(student => {

        const course = student.course.trim();

        courseCount[course] = (courseCount[course] || 0) + 1;

    });

    // Total Courses
    totalCourses.textContent = Object.keys(courseCount).length;

    // Prepare chart data
    const labels = Object.keys(courseCount);
    const data = Object.values(courseCount);

    // Destroy old chart before creating a new one
    if (chart) {
        chart.destroy();
    }

    chart = new Chart(courseChart, {

        type: "pie",

        data: {

            labels: labels,

            datasets: [{

                data: data,

                backgroundColor: [

                    "#2563eb",
                    "#10b981",
                    "#f59e0b",
                    "#ef4444",
                    "#8b5cf6",
                    "#06b6d4",
                    "#84cc16",
                    "#ec4899"

                ],

                borderWidth: 2,
                borderColor: "#ffffff"

            }]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    position: "bottom"

                }

            }

        }

    });

}