function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

const btns = document.querySelectorAll(".acc-btn-rules");

function accordion() {
  this.classList.toggle("is-open");

  const content = this.nextElementSibling;

  if (content.style.maxHeight) content.style.maxHeight = null;
  else content.style.maxHeight = content.scrollHeight + "px";
}

btns.forEach((el) => el.addEventListener("click", accordion));