// Konversi ke Rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(number);
};

// Menampilkan notifikasi sukses
const showSuccessNotification = (message) => {
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #4CAF50;
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    max-width: 300px;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = "1";
    notification.style.transform = "translateX(0)";
  }, 100);
  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 5000);
};

// Load Midtrans script secara dinamis
const loadMidtransScript = () => {
  return new Promise((resolve, reject) => {
    if (window.snap) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", "SB-Mid-client-XXXXXXXXXXXXXXXX");
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// Menambahkan produk ke keranjang dari modal
window.addToCartFromModal = function (event) {
  event.preventDefault();
  const modal = document.querySelector("#item-detail-modal");
  const productData = modal.getAttribute("data-current-product");
  if (productData && window.Alpine && window.Alpine.store) {
    const product = JSON.parse(productData);
    window.Alpine.store("cart").add(product);
  }
};

document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      { id: 1, name: "Robusta Brazil", img: "1.jpg", price: 20000 },
      { id: 2, name: "Arabica Blend", img: "2.jpg", price: 25000 },
      { id: 3, name: "Primo Passo", img: "3.jpg", price: 30000 },
      { id: 4, name: "Aceh Gayo", img: "4.jpg", price: 35000 },
      { id: 5, name: "Sumatra Mandheling", img: "5.jpg", price: 40000 },
    ],
    showProductDetail(product) {
      const modal = document.querySelector("#item-detail-modal");
      const modalImg = modal.querySelector(".modal-content img");
      const modalTitle = modal.querySelector(".product-content h3");
      const modalDescription = modal.querySelector(".product-content p");
      const modalPrice = modal.querySelector(".product-price");

      modalImg.src = `img/products/${product.img}`;
      modalImg.alt = product.name;
      modalTitle.textContent = product.name;
      modalDescription.textContent = this.getProductDescription(product.id);
      modalPrice.innerHTML = `${rupiah(product.price)}`;

      modal.setAttribute("data-current-product", JSON.stringify(product));
      modal.style.display = "flex";
    },
    getProductDescription(productId) {
      const descriptions = {
        1: "Robusta Brazil dengan cita rasa kuat dan aroma yang menggugah selera. Cocok untuk pencinta kopi dengan karakter bold.",
        2: "Arabica Blend premium dengan keseimbangan sempurna antara keasaman dan body. Ideal untuk segala suasana.",
        3: "Primo Passo dengan karakteristik unik dan kompleksitas rasa yang memanjakan lidah penikmat kopi sejati.",
        4: "Aceh Gayo dengan cita rasa khas dari dataran tinggi Aceh. Aroma earthy dengan aftertaste yang panjang.",
        5: "Sumatra Mandheling dengan body yang full dan low acidity. Cocok untuk brewing manual maupun espresso.",
      };
      return descriptions[productId] || "Biji kopi premium dengan cita rasa yang kaya dan aroma yang menggugah selera.";
    },
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,

    add(newItem) {
      const cartItem = this.items.find((item) => item.id === newItem.id);

      if (!cartItem) {
        // Item belum ada, tambahkan ke keranjang
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.total += newItem.price;
        this.quantity++;
      } else {
        // Item sudah ada, perbarui quantity dan totalnya
        this.items = this.items.map((item) => {
          if (item.id !== newItem.id) {
            return item;
          } else {
            item.quantity++;
            item.total = item.price * item.quantity;
            this.total += newItem.price;
            this.quantity++;
            return item;
          }
        });
      }
    },

    remove(id) {
      const cartItem = this.items.find((item) => item.id === id);

      if (cartItem.quantity > 1) {
        // Kurangi quantity dan total item tersebut
        this.items = this.items.map((item) => {
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        // Hapus item dari keranjang
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },

    clear() {
      this.items = [];
      this.total = 0;
      this.quantity = 0;
    },
  });
});

// Form Validation
const checkoutButton = document.querySelector(".checkout-button");
const form = document.querySelector("#checkoutForm");

if (checkoutButton) {
  checkoutButton.disabled = true;
}

if (form) {
  form.addEventListener("input", function () {
    let allFilled = true;
    for (let i = 0; i < form.elements.length; i++) {
      const el = form.elements[i];
      if (el.tagName === "INPUT" && el.type !== "submit" && el.value.trim() === "") {
        allFilled = false;
        break;
      }
    }

    if (checkoutButton) {
      checkoutButton.disabled = !allFilled;
      if (allFilled) {
        checkoutButton.classList.remove("disabled");
      } else {
        checkoutButton.classList.add("disabled");
      }
    }
  });
}

// Proses Checkout
if (checkoutButton) {
  checkoutButton.addEventListener("click", async function (e) {
    e.preventDefault();
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);

    try {
      await loadMidtransScript();

      const response = await fetch("php/placeOrder.php", {
        method: "POST",
        body: data,
      });
      const token = await response.text();

      window.snap.pay(token, {
        onSuccess: function (result) {
          console.log("Payment success:", result);
          if (window.Alpine && window.Alpine.store) {
            window.Alpine.store("cart").clear();
          }
          const shoppingCart = document.querySelector(".shopping-cart");
          if (shoppingCart) {
            shoppingCart.classList.remove("active");
          }
          form.reset();
          if (checkoutButton) {
            checkoutButton.classList.add("disabled");
            checkoutButton.disabled = true;
          }
          showSuccessNotification("🎉 Pembayaran berhasil! Terima kasih atas pesanan Anda. Semua item telah dihapus dari keranjang.");
        },
        onPending: function (result) {
          console.log("Payment pending:", result);
          alert("Pembayaran sedang diproses. Silakan selesaikan pembayaran Anda.");
        },
        onError: function (result) {
          console.log("Payment error:", result);
          alert("Terjadi kesalahan dalam proses pembayaran. Silakan coba lagi.");
        },
        onClose: function () {
          console.log("Payment popup closed");
        },
      });
    } catch (err) {
      console.log(err.message);
      alert("Terjadi kesalahan dalam memproses pesanan. Silakan coba lagi.");
    }
  });
}

// Format pesan WhatsApp (disabled)
// const formatMessage = (obj) => {
//   return `Data Customer
//     Nama   : ${obj.name}
//     Email  : ${obj.email}
//     No. HP : ${obj.phone}
// Data Pesanan
//     ${JSON.parse(obj.items)
//       .map((item) => `${item.name} (${item.quantity} x ${rupiah(item.total)})`)
//       .join("\n    ")}
// Total Harga: ${rupiah(obj.total)}
// Terima kasih.`;
// };
