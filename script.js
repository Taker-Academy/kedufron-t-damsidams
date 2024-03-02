function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

function accordion() {
  this.classList.toggle("is-open");
  const content = this.nextElementSibling;
  content.style.maxHeight = content.style.maxHeight ? null : content.scrollHeight + "px";
}

document.querySelectorAll(".acc-btn-rules").forEach(btn => {
  if (btn) {
    btn.addEventListener("click", accordion);
  }
});

const buyButton = document.querySelector('.btn-color-1');

buyButton.addEventListener('click', () => {
  let premium = parseInt(localStorage.getItem('premium')) || 0;
  premium++;

  localStorage.setItem('premium', premium);

  console.log(`Buy count: ${premium}`);
});
