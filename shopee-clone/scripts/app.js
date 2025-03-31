// Cart functionality
class Cart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem('cart')) || [];
    this.initCart();
  }

  initCart() {
    if (document.getElementById('cart-count')) {
      this.updateCartCount();
    }
  }

  addItem(product) {
    const existingItem = this.items.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({...product, quantity: 1});
    }
    this.saveCart();
    this.updateCartCount();
  }

  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.saveCart();
    this.updateCartCount();
  }

  updateQuantity(productId, quantity) {
    const item = this.items.find(item => item.id === productId);
    if (item) {
      item.quantity = quantity;
      this.saveCart();
    }
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  getTotalItems() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  updateCartCount() {
    const count = this.getTotalItems();
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'inline-block' : 'none';
    });
  }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.cart = new Cart();

  // Handle add to cart buttons
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
      const productCard = e.target.closest('.product-card');
      const product = {
        id: productCard.dataset.productId,
        name: productCard.querySelector('.product-name').textContent,
        price: parseFloat(productCard.querySelector('.product-price').textContent.replace('$', '')),
        image: productCard.querySelector('img').src
      };
      window.cart.addItem(product);
      
      // Show added to cart feedback
      const originalText = e.target.innerHTML;
      e.target.innerHTML = '<i class="fas fa-check mr-1"></i> Added';
      e.target.classList.add('bg-green-500');
      setTimeout(() => {
        e.target.innerHTML = originalText;
        e.target.classList.remove('bg-green-500');
      }, 2000);
    });
  });

  // Inject header component
  const headerElement = document.getElementById('header');
  if (headerElement) {
    fetch('components/header.html')
      .then(response => response.text())
      .then(data => {
        headerElement.innerHTML = data;
        window.cart.updateCartCount();
      });
  }
});