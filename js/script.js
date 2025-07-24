// Toggle class active untuk hamburger menu
const navbarNav = document.querySelector(".navbar-nav");

document.querySelector("#hamburger-menu").onclick = (e) => {
  navbarNav.classList.toggle("active");
  e.preventDefault();
};

// Toggle class active untuk search form
const searchForm = document.querySelector(".search-form");
const searchBox = document.querySelector("#search-box");

document.querySelector("#search-button").onclick = (e) => {
  searchForm.classList.toggle("active");
  searchBox.focus();
  e.preventDefault();
};

// Toggle class active untuk shopping cart
const shoppingCart = document.querySelector(".shopping-cart");

document.querySelector("#shopping-cart-button").onclick = (e) => {
  shoppingCart.classList.toggle("active");
  e.preventDefault();
};

// Klik diluar elemen
const hm = document.querySelector("#hamburger-menu");
const sb = document.querySelector("#search-button");
const sc = document.querySelector("#shopping-cart-button");

document.addEventListener("click", function (e) {
  if (!hm.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove("active");
  }
});

// Tutup menu hamburger ketika link navigasi diklik
document.querySelectorAll(".navbar-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    navbarNav.classList.remove("active");
  });
});

document.addEventListener("click", function (e) {
  if (!sb.contains(e.target) && !searchForm.contains(e.target)) {
    searchForm.classList.remove("active");
  }
});

document.addEventListener("click", function (e) {
  // Jangan tutup shopping cart jika mengklik tombol add/remove atau elemen di dalam shopping cart
  if (e.target.closest("#add") || e.target.closest("#remove") || e.target.closest(".shopping-cart")) {
    return;
  }

  // Jangan tutup jika mengklik shopping cart button
  if (sc.contains(e.target)) {
    return;
  }

  // Tutup shopping cart jika mengklik di luar area
  shoppingCart.classList.remove("active");
});

// Prevent shopping cart from closing when clicking remove/add buttons
document.addEventListener("click", function (e) {
  // Cek apakah yang diklik adalah tombol add/remove di shopping cart
  const isAddButton = e.target.id === "add" || e.target.closest("#add");
  const isRemoveButton = e.target.id === "remove" || e.target.closest("#remove");

  if (isAddButton || isRemoveButton) {
    e.stopPropagation();

    // Pastikan shopping cart tetap terbuka setelah DOM update
    setTimeout(() => {
      if (!shoppingCart.classList.contains("active")) {
        shoppingCart.classList.add("active");
      }
    }, 10);
  }
});

// Modal Box
const itemDetailModal = document.querySelector("#item-detail-modal");

// Klik tombol close modal
document.querySelector(".modal .close-icon").onclick = (e) => {
  itemDetailModal.style.display = "none";
  e.preventDefault();
};

// Klik di luar modal
window.onclick = (e) => {
  if (e.target === itemDetailModal) {
    itemDetailModal.style.display = "none";
  }
};
