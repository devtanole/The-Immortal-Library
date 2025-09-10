const library = [];

function Book(title, author, pages, read = false) {
  if (!new.target) {
    throw Error("You must use 'new' operator to call constructor");
  }
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  console.log(`new Book: ${this.title} by ${this.author}`);
}

Book.prototype.info = function () {
  return `${this.title} by ${this.author}, ${this.pages} pages, ${
    this.read ? "read" : "not read yet"
  }`;
};

library.push(new Book("Dune", "Frank Herbert", 412, false));
library.push(
  new Book("Hellboy Omnibus Volume 3: The Wild Hunt", "Mike Mignola", 528, true)
);

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
  renderLibrary();

  document.getElementById("book-submit-form").reset();
  document.querySelector("dialog").close();
}

function renderLibrary() {
  const container = document.querySelector(".book-container");
  container.innerHTML = "";
  library.forEach((book, index) => {
    const card = document.createElement("div");
    card.classList.add("book-card");

    const toggleClass = book.read ? "read" : "unread";
    const toggleText = book.read ? "Read" : "Unread";

    card.innerHTML = `
      <p><strong>${book.title}</strong> by ${book.author}</p>
      <p>${book.pages} pages</p>
      <p>Status: <span class="read-status">${
        book.read ? "Read" : "Not read"
      }</span></p>
      <button data-index="${index}" class="toggle-read-button ${toggleClass}">${toggleText}</button>
      <button data-index="${index}" class="remove-button">Remove</button>
    `;

    container.appendChild(card);
  });
}

document.querySelector(".book-container").addEventListener("click", (e) => {
  const index = e.target.getAttribute("data-index");

  if (e.target.classList.contains("remove-button")) {
    library.splice(index, 1);
    renderLibrary();
  }

  if (e.target.classList.contains("toggle-read-button")) {
    library[index].read = !library[index].read;
    renderLibrary(); // re-render to reflect change
  }
});

document.getElementById("book-submit-form").addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent default dialog behavior
  addBook();
});

const dialog = document.querySelector(".add-book-modal");
const addBookBtn = document.querySelector(".add-book-button");
const cancelBtn = document.querySelector(".cancel-form-button");

addBookBtn.addEventListener("click", () => dialog.showModal());
cancelBtn.addEventListener("click", () => dialog.close());

renderLibrary();
