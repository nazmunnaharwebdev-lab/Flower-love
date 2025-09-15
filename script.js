// === Storage Setup ===
let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// === DOM Selectors ===
const favouriteIcons = document.querySelectorAll(".fa-heart");
const cartIcons = document.querySelectorAll(".fa-cart-plus");
const shareIcons = document.querySelectorAll(".fa-share");
const navFavourite = document.getElementById("nav-favourite");
const navCart = document.getElementById("nav-cart");
const favouriteModal = document.getElementById("favourite-modal");
const cartModal = document.getElementById("cart-modal");

// === Utility Functions ===
function getProductName(icon) {
  const box = icon.closest(".box");
  const name = box?.querySelector(".content h3");
  return name ? name.textContent.trim() : "Unnamed Product";
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  Object.assign(toast.style, {
    position: "fixed",
    bottom: "2rem",
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgb(238, 140, 157)",
    color: "#fff",
    padding: "0.8rem 1.2rem",
    borderRadius: "0.5rem",
    boxShadow: "0 0.2rem 0.6rem rgba(0,0,0,0.2)",
    fontSize: "1rem",
    zIndex: "9999",
    opacity: "0",
    transition: "opacity 0.3s ease"
  });

  document.body.appendChild(toast);
  setTimeout(() => (toast.style.opacity = "1"), 10);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// === Save to Favourites ===
favouriteIcons.forEach(icon => {
  icon.addEventListener("click", e => {
    e.preventDefault();
    const name = getProductName(icon);
    if (!favourites.includes(name)) {
      favourites.push(name);
      localStorage.setItem("favourites", JSON.stringify(favourites));
      showToast(`${name} saved to favourites 💖`);
    } else {
      showToast(`${name} is already in favourites`);
    }
  });
});

// === Add to Cart ===
cartIcons.forEach(icon => {
  icon.addEventListener("click", e => {
    e.preventDefault();
    const name = getProductName(icon);
    if (!cart.includes(name)) {
      cart.push(name);
      localStorage.setItem("cart", JSON.stringify(cart));
      showToast(`${name} added to cart 🛒`);
    } else {
      showToast(`${name} is already in cart`);
    }
  });
});

// === Share Product ===
shareIcons.forEach(icon => {
  icon.addEventListener("click", e => {
    e.preventDefault();
    const name = getProductName(icon);
    const url = window.location.href;

    if (navigator.share) {
      navigator.share({
        title: name,
        text: `Check out this flower: ${name}`,
        url: url
      }).catch(err => console.log("Share failed:", err));
    } else {
      navigator.clipboard.writeText(url);
      showToast("Product link copied 📋");
    }
  });
});

// === Show Favourites in Modal ===
navFavourite?.addEventListener("click", e => {
  e.preventDefault();
  favouriteModal.innerHTML = `
    <h3>Favourites</h3>
    <ul>
      ${favourites.length > 0
        ? favourites.map(item => `<li>${item}</li>`).join("")
        : "<li>No favourites yet.</li>"}
    </ul>
  `;
  favouriteModal.style.display = "block";
});

// === Show Cart in Modal ===
navCart?.addEventListener("click", e => {
  e.preventDefault();
  cartModal.innerHTML = `
    <h3>Cart Items</h3>
    <ul>
      ${cart.length > 0
        ? cart.map(item => `<li>${item}</li>`).join("")
        : "<li>Your cart is empty.</li>"}
    </ul>
  `;
  cartModal.style.display = "block";
});

// === Close Modals on Outside Click ===
document.addEventListener("click", e => {
  if (!e.target.closest(".modal") && !e.target.matches("#nav-cart, #nav-favourite")) {
    favouriteModal.style.display = "none";
    cartModal.style.display = "none";
  }
});