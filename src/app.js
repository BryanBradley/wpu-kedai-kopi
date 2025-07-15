document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      { id: 1, name: "Robusta Brazil", img: "1.jpg", price: 20000 },
      { id: 2, name: "Arabica Blend", img: "2.jpg", price: 25000 },
      { id: 3, name: "Primo Passo", img: "3.jpg", price: 30000 },
      { id: 4, name: "Aceh Gayo", img: "4.jpg", price: 35000 },
      { id: 5, name: "Sumatra Mandheling", img: "5.jpg", price: 40000 },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      // Cek apakah item sudah ada di keranjang
      const cartItem = this.items.find((item) => item.id === newItem.id);

      // Jika item belum ada, tambahkan ke keranjang
      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.total += newItem.price;
        this.quantity++;
      } else {
        // Jika item sudah ada, perbarui quantity dan totalnya
        this.item = this.items.map((item) => {
          // Jika item berbeda, kembalikan seperti semula
          if (item.id !== newItem.id) {
            return item;
          } else {
            // Jika item sama, tambahkan quantity dan perbarui total
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
      // Cari item yang ingin dihapus berdasarkan id
      const cartItem = this.items.find((item) => item.id === id);

      // Jika item memiliki quantity lebih dari 1
      if (cartItem.quantity > 1) {
        // Kurangi quantity dan total item tersebut
        this.items = this.items.map((item) => {
          // Jika bukan item yang dimaksud, kembalikan seperti semula
          if (item.id !== id) {
            return item;
          } else {
            // Jika item yang dimaksud, kurangi quantity dan perbarui total
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        // Jika item hanya tersisa 1, hapus dari keranjang
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

// Konversi ke Rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(number);
};
