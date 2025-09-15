const addBtn = document.getElementById("addRecordBtn");
const updateBtn = document.getElementById("updateRecordBtn");
const tableBody = document.getElementById("resultTable");
const errorMsg = document.getElementById("errorMsg");
const formTitle = document.getElementById("formTitle");

let studentCount = 0;
let editIndex = null; // Track which row is being edited

// Grade calculation helper
function calculateGrade(total) {
  if (total >= 240) return "A+";
  else if (total >= 200) return "A";
  else if (total >= 150) return "B";
  else if (total >= 100) return "C";
  else return "Fail";
}

// Create/Update Record
function addOrUpdateRecord(isUpdate = false) {
  const name = document.getElementById("studentName").value.trim();
  const roll = document.getElementById("rollNumber").value.trim();
  const m1 = document.getElementById("marks1").value.trim();
  const m2 = document.getElementById("marks2").value.trim();
  const m3 = document.getElementById("marks3").value.trim();

  errorMsg.textContent = "";

  // Input Validation
  if (!name || !roll || !m1 || !m2 || !m3) {
    errorMsg.textContent = "⚠️ Please fill in all fields.";
    return;
  }

  const marks1 = Number(m1);
  const marks2 = Number(m2);
  const marks3 = Number(m3);

  if ([marks1, marks2, marks3].some(m => m < 0 || m > 100)) {
    errorMsg.textContent = "⚠️ Marks must be between 0 and 100.";
    return;
  }

  const total = marks1 + marks2 + marks3;
  const grade = calculateGrade(total);

  if (isUpdate) {
    // Update existing row
    const row = tableBody.children[editIndex];
    row.children[1].textContent = name;
    row.children[2].textContent = roll;
    row.children[3].textContent = marks1;
    row.children[4].textContent = marks2;
    row.children[5].textContent = marks3;
    row.children[6].textContent = total;
    row.children[7].textContent = grade;

    resetForm();
  } else {
    // Add new row
    studentCount++;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${studentCount}</td>
      <td>${name}</td>
      <td>${roll}</td>
      <td>${marks1}</td>
      <td>${marks2}</td>
      <td>${marks3}</td>
      <td>${total}</td>
      <td>${grade}</td>
      <td>
        <button class="btn btn-sm btn-warning me-2 editBtn">Edit</button>
        <button class="btn btn-sm btn-danger deleteBtn">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  }

  clearInputs();
}

// Clear input fields
function clearInputs() {
  document.getElementById("studentName").value = "";
  document.getElementById("rollNumber").value = "";
  document.getElementById("marks1").value = "";
  document.getElementById("marks2").value = "";
  document.getElementById("marks3").value = "";
}

// Reset form to Add mode
function resetForm() {
  editIndex = null;
  addBtn.classList.remove("d-none");
  updateBtn.classList.add("d-none");
  formTitle.textContent = "Enter Student Details";
}

// Handle Edit
function handleEdit(row, index) {
  editIndex = index;
  formTitle.textContent = "✏️ Edit Student Record";

  document.getElementById("studentName").value = row.children[1].textContent;
  document.getElementById("rollNumber").value = row.children[2].textContent;
  document.getElementById("marks1").value = row.children[3].textContent;
  document.getElementById("marks2").value = row.children[4].textContent;
  document.getElementById("marks3").value = row.children[5].textContent;

  addBtn.classList.add("d-none");
  updateBtn.classList.remove("d-none");
}

// Handle Delete
function handleDelete(row) {
  row.remove();
  // Recalculate serial numbers
  studentCount = 0;
  Array.from(tableBody.children).forEach((tr, i) => {
    tr.children[0].textContent = ++studentCount;
  });
}

// Event Listeners
addBtn.addEventListener("click", () => addOrUpdateRecord(false));
updateBtn.addEventListener("click", () => addOrUpdateRecord(true));

tableBody.addEventListener("click", (e) => {
  const row = e.target.closest("tr");
  const index = Array.from(tableBody.children).indexOf(row);

  if (e.target.classList.contains("editBtn")) {
    handleEdit(row, index);
  } else if (e.target.classList.contains("deleteBtn")) {
    handleDelete(row);
    resetForm();
    clearInputs();
  }
});
