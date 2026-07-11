// =============================
// Select HTML Elements
// =============================

const studentForm = document.getElementById("studentForm");
const studentList = document.getElementById("studentList");

let editRow = null;

// =============================
// Student Data
// =============================

let students = [];
let editIndex = -1;

// =============================
// Event Listeners
// =============================

studentForm.addEventListener("submit", addStudent);
studentList.addEventListener("click", handleActions);

// =============================
// Add or Update Student
// =============================

function addStudent(event){

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const studentId = document.getElementById("studentId").value.trim();
    const email = document.getElementById("email").value.trim();
    const course = document.getElementById("course").value.trim();

    if(
        name === "" ||
        studentId === "" ||
        email === "" ||
        course === ""
    ){
        alert("Please fill in all fields.");
        return;
    }

    // =============================
    // UPDATE EXISTING STUDENT
    // =============================

    if(editRow){

        editRow.cells[0].textContent = name;
        editRow.cells[1].textContent = studentId;
        editRow.cells[2].textContent = email;
        editRow.cells[3].textContent = course;

        editRow = null;

        studentForm.querySelector("button").textContent = "Add Student";

    }else{

        // =============================
        // ADD NEW STUDENT
        // =============================

        if(studentList.querySelector(".empty")){
            studentList.innerHTML = "";
        }

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${name}</td>
            <td>${studentId}</td>
            <td>${email}</td>
            <td>${course}</td>
            <td>
                <button class="action-btn edit-btn">Edit</button>
                <button class="action-btn delete-btn">Delete</button>
            </td>
        `;

        studentList.appendChild(row);

    }

    studentForm.reset();

}

// =============================
// Handle Buttons
// =============================

function handleActions(event){

    const target = event.target;

    // DELETE

    if(target.classList.contains("delete-btn")){

        target.closest("tr").remove();

        checkEmptyTable();

    }

    // EDIT

    if(target.classList.contains("edit-btn")){

        editRow = target.closest("tr");

        document.getElementById("name").value = editRow.cells[0].textContent;
        document.getElementById("studentId").value = editRow.cells[1].textContent;
        document.getElementById("email").value = editRow.cells[2].textContent;
        document.getElementById("course").value = editRow.cells[3].textContent;

        studentForm.querySelector("button").textContent = "Update Student";

    }

}

// =============================
// Empty Table Message
// =============================

function checkEmptyTable(){

    if(studentList.children.length === 0){

        studentList.innerHTML = `
            <tr>
                <td colspan="5" class="empty">
                    No students added yet.
                </td>
            </tr>
        `;

    }

}