const bookList = document.getElementById("bookList");
const addBookForm = document.getElementById("addBookForm");
const titleInput = document.getElementById("titleInput");
const authorInput = document.getElementById("authorInput");
const searchInput = document.getElementById("searchInput");

function renderBook(id, data) {
  const li = document.createElement("li");
  li.className = "book-item";
  li.dataset.id = id;

  const info = document.createElement("div");
  info.className = "book-info";
  info.innerText = `${data.title} by ${data.author}`;

  const btn = document.createElement("button");
  btn.innerText = "Delete";
  btn.className = "delete-btn";
  btn.onclick = () => db.ref("books/" + id).remove();

  li.appendChild(info);
  li.appendChild(btn);
  bookList.appendChild(li);
}

function clearBooks() {
  bookList.innerHTML = "";
}

function updateDisplay(snapshot) {
  clearBooks();
  const filter = searchInput.value.toLowerCase();
  snapshot.forEach(child => {
    const book = child.val();
    const id = child.key;
    if (
      book.title.toLowerCase().includes(filter) ||
      book.author.toLowerCase().includes(filter)
    ) {
      renderBook(id, book);
    }
  });
}

db.ref("books").on("value", updateDisplay);

addBookForm.onsubmit = (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  if (!title || !author) return;

  db.ref("books").push({ title, author });

  titleInput.value = "";
  authorInput.value = "";
};

function resetSearch() {
  searchInput.value = "";
  db.ref("books").once("value", updateDisplay);
}

searchInput.oninput = () => {
  db.ref("books").once("value", updateDisplay);
};
