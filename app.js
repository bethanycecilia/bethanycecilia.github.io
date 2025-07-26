const addBookForm = document.getElementById("addBookForm");
const titleInput = document.getElementById("titleInput");
const authorInput = document.getElementById("authorInput");
const boughtInput = document.getElementById("boughtInput");
const searchInput = document.getElementById("searchInput");
const tableBody = document.querySelector("#bookTable tbody");

let booksData = {}; // Will store the fetched data
let currentSort = { column: null, direction: 1 };

// Render a row
function renderRow(id, data) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${data.title}</td>
    <td>${data.author}</td>
    <td class="${data.bought === 'bought' ? 'bought' : 'not-bought'}">${data.bought}</td>
    <td><button class="delete-btn" onclick="deleteBook('${id}')">Delete</button></td>
  `;
  return tr;
}

// Filter and sort
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

  if (currentSort.column) {
    rows.sort((a, b) => {
      const valA = a[currentSort.column].toLowerCase();
      const valB = b[currentSort.column].toLowerCase();
      return valA.localeCompare(valB) * currentSort.direction;
    });
  }

  tableBody.innerHTML = "";
  rows.forEach(({ id, title, author, bought }) => {
    tableBody.appendChild(renderRow(id, { title, author, bought }));
  });
}

// Fetch and listen
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

// Delete function
function deleteBook(id) {
  db.ref("books/" + id).remove();
}

// Sorting
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

// Filter on input
searchInput.oninput = () => updateDisplay();
