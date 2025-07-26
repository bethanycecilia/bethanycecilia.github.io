const addBookForm = document.getElementById("addBookForm");
const titleInput = document.getElementById("titleInput");
const authorInput = document.getElementById("authorInput");
const boughtInput = document.getElementById("boughtInput");
const searchInput = document.getElementById("searchInput");
const tableBody = document.querySelector("#bookTable tbody");

let booksData = {};
let currentSort = { column: null, direction: 1 };

// Render one row
function renderRow(id, data) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${data.title}</td>
    <td>${data.author}</td>
    <td class="${data.bought === 'bought' ? 'bought' : 'not-bought'}">
        ${data.bought.charAt(0).toUpperCase() + data.bought.slice(1)}
    </td>
    <td><button class="delete-btn" onclick="deleteBook('${id}')">Delete</button></td>
  `;
  return tr;
}

// Update display from booksData
function updateDisplay() {
  const filter = searchInput.value.toLowerCase();
  let rows = [];

  for (let id in booksData) {
    const book = booksData[id];

    if (
      book.title.toLowerCase().includes(filter) ||
      book.author.toLowerCase().includes(filter) ||
      book.bought.toLowerCase().includes(filter)
    ) {
      rows.push({ id, ...book });
    }
  }

  // Apply sorting
  if (currentSort.column) {
    rows.sort((a, b) => {
      const valA = a[currentSort.column]?.toLowerCase() || '';
      const valB = b[currentSort.column]?.toLowerCase() || '';
      return valA.localeCompare(valB) * currentSort.direction;
    });
  }

  // Clear and re-render
  tableBody.innerHTML = "";
  rows.forEach(row => {
    tableBody.appendChild(renderRow(row.id, row));
  });
}

// Listen for DB changes
db.ref("books").on("value", (snapshot) => {
  booksData = snapshot.val() || {};
  updateDisplay();
});

// Form submit
addBookForm.onsubmit = (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const bought = boughtInput.value;

  if (!title || !author || !bought) return;

  db.ref("books").push({ title, author, bought });

  titleInput.value = "";
  authorInput.value = "";
  boughtInput.value = "";
};

// Delete book
function deleteBook(id) {
  db.ref("books/" + id).remove();
}

// Handle sorting
document.querySelectorAll("#bookTable th[data-column]").forEach(th => {
  th.addEventListener("click", () => {
    const column = th.dataset.column;
    if (currentSort.column === column) {
      currentSort.direction *= -1;
    } else {
      currentSort.column = column;
      currentSort.direction = 1;
    }
    updateDisplay();
  });
});

// Handle filter input
searchInput.oninput = () => updateDisplay();
