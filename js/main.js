const menuToggle = document.querySelector(".menu-toggle");

const navLinks = document.querySelector(".nav-links");

const links = document.querySelectorAll(".nav-links a");


menuToggle.addEventListener("click", function () {

  navLinks.classList.toggle("active");

  if (navLinks.classList.contains("active")) {

    menuToggle.textContent = "✕";

  } else {

    menuToggle.textContent = "☰";

  }

});


links.forEach(function (link) {

  link.addEventListener("click", function () {

    navLinks.classList.remove("active");

    menuToggle.textContent = "☰";

  });

});

const header = document.querySelector(".header");

window.addEventListener("scroll", function () {

  if (window.scrollY > 80) {

    header.classList.add("scrolled");

  } else {

    header.classList.remove("scrolled");

  }

});