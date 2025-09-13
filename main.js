const library = [];

function Book(title, author, pages, read = false) {
  if (!new.target) {
    throw Error("You must use 'new' operator to call constructor");
  }
  this.id = crypto.randomUUID();
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

Book.prototype.info = function () {
  return `${this.title} by ${this.author}, ${this.pages} pages, ${
    this.read ? "read" : "not read yet"
  }`;
};

function saveLibrary() {
  localStorage.setItem("library", JSON.stringify(library));
}

function getLibrary() {
  const stored = localStorage.getItem("library");
  if (stored) {
    const parsed = JSON.parse(stored);
    library.length = 0;
    parsed.forEach((bookData) => {
      library.push(
        new Book(bookData.title, bookData.author, bookData.pages, bookData.read)
      );
    });
  }
}

// DOM Elements
const addBookBtn = document.querySelector(".add-book-button");
const addBookDialog = document.querySelector(".add-book-modal");
const bookForm = document.getElementById("book-submit-form");
const bookContainer = document.querySelector(".book-container");
const cancelFormButton = document.querySelector(".cancel-form-button");

// Confirm Delete Modal Elements
const confirmDialog = document.querySelector(".confirm-delete-modal");
const confirmMsg = document.getElementById("confirm-message");
const confirmYes = document.getElementById("confirm-delete-yes");
const confirmNo = document.getElementById("confirm-delete-no");

let bookToDeleteIndex = null;

// Open Add Book Modal
addBookBtn.addEventListener("click", () => addBookDialog.showModal());

// Cancel Add Book Modal
cancelFormButton.addEventListener("click", () => addBookDialog.close());

// Submit Form
bookForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addBook();
});

// Add Book Function
function addBook() {
  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();
  const pages = parseInt(document.getElementById("pages").value);
  const read = document.getElementById("read")?.checked || false;

  if (!title || !author) {
    alert("Please fill in required fields.");
    return;
  }

  const newBook = new Book(title, author, pages, read);
  library.push(newBook);
  saveLibrary();
  renderLibrary();

  bookForm.reset();
  addBookDialog.close();
}

// Render Library to Page
function renderLibrary() {
  bookContainer.innerHTML = "";
  library.forEach((book, index) => {
    const card = document.createElement("div");
    card.classList.add("book-card");

    const toggleClass = book.read ? "read" : "unread";
    const toggleText = book.read ? "Mark Unread" : " Mark Read";

    card.innerHTML = `
      <p><strong>${book.title}</strong> by ${book.author}</p>
      <p>${book.pages} pages</p>
      <p>Status: <span class="read-status">${toggleClass}</span></p>
      <button data-id="${book.id}" class="toggle-read-button ${toggleClass}">${toggleText}</button>
      <button data-id="${book.id}" class="remove-button">Remove</button>
    `;

    bookContainer.appendChild(card);
  });
}

// Event Delegation for Book Actions
bookContainer.addEventListener("click", (e) => {
  const bookId = e.target.getAttribute("data-id");
  const bookIndex = library.findIndex((b) => b.id === bookId);

  if (bookIndex === -1) return;

  if (e.target.classList.contains("remove-button")) {
    const book = library[bookIndex];
    bookToDeleteIndex = bookIndex;
    confirmMsg.textContent = `Remove "${book.title}" by ${book.author}?`;
    confirmDialog.showModal();
  }

  if (e.target.classList.contains("toggle-read-button")) {
    library[bookIndex].read = !library[bookIndex].read;
    saveLibrary();
    renderLibrary();
  }
});

// Confirm Deletion
confirmYes.addEventListener("click", () => {
  if (bookToDeleteIndex !== null) {
    library.splice(bookToDeleteIndex, 1);
    saveLibrary();
    renderLibrary();
    bookToDeleteIndex = null;
  }
  confirmDialog.close();
});

// Cancel Deletion
confirmNo.addEventListener("click", () => {
  bookToDeleteIndex = null;
  confirmDialog.close();
});

// Optional: Initial seed data (can remove)
// library.push(new Book("Dune", "Frank Herbert", 412, false));
// library.push(
//   new Book("Hellboy Omnibus Volume 3: The Wild Hunt", "Mike Mignola", 528, true)
// );

getLibrary();
renderLibrary();
