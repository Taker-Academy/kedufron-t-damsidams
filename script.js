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

if (document.querySelector('.premium')) {
  const premiumBtn = document.querySelector('.premium');

  premiumBtn.addEventListener('click', () => {
    let premium = parseInt(localStorage.getItem('premium')) || 0;
    premium++;

    localStorage.setItem('premium', premium);

    console.log(`Premium: ${premium}`);
  });
}

if (document.querySelector('.eco')) {
  const ecoBtn = document.querySelector('.eco');

  ecoBtn.addEventListener('click', () => {
    let eco = parseInt(localStorage.getItem('eco')) || 0;
    eco++;

    localStorage.setItem('eco', eco);

    console.log(`eco: ${eco}`);
  });
}

function updateCart() {
  const cartItems = document.getElementById('cart-items');
  cartItems.innerHTML = '';

  const premiumQuantity = parseInt(localStorage.getItem('premium')) || 0;
  const ecoQuantity = parseInt(localStorage.getItem('eco')) || 0;

  let cartRows = '';

  function generateCoffinRow(coffinType, price, quantity) {
    const subtotal = quantity * price;
    const formattedSubtotal = subtotal.toFixed(2);
    return `
      <tr>
        <td class="cart-img">
          <h4>${coffinType} Coffin</h4>
          <a href="assets/${coffinType.toLowerCase()}.png">
            <div class="coffin-cotainer">
             <img class="coffin_img" src="assets/${coffinType.toLowerCase()}.png" alt="">
            <div class="centered">PREVIEW</div>
          </a>
        </td>
        <td>${price}€</td>
        <td>
        <div class="quantity-container">
            <button class="quantity-btn minus">-</button>
            <input type="number" class="quantity-input" value="${quantity}" min="0" data-coffin-type="${coffinType}">
            <button class="quantity-btn plus">+</button>
          </div>
        </td>
        <td>${formattedSubtotal}€</td>
      </tr>
    `;
  }

  if (premiumQuantity > 0) {
    cartRows += generateCoffinRow('PREMIUM', 8999.99, premiumQuantity);
  }

  if (ecoQuantity > 0) {
    cartRows += generateCoffinRow('ECO', 4999.99, ecoQuantity);
  }

  cartItems.innerHTML = cartRows;

  if (!cartRows) {
    cartItems.innerHTML = '<tr><td colspan="4">Your cart is empty!</td></tr>';
  }

  const quantityBtns = document.querySelectorAll('.quantity-btn');

  quantityBtns.forEach(btn => {
    btn.addEventListener('click', handleQuantityChange);
  });
}

function handleQuantityChange(event) {
  const btn = event.target;
  const input = btn.parentElement.querySelector('.quantity-input');
  const coffinType = input.dataset.coffinType;

  let currentQuantity = parseInt(input.value);

  if (btn.classList.contains('minus')) {
    currentQuantity = Math.max(currentQuantity - 1, 0);
  } else if (btn.classList.contains('plus')) {
    currentQuantity++;
  }

  input.value = currentQuantity;

  localStorage.setItem(coffinType, currentQuantity);

  updateCart();
}

function handleBuyNow() {
  const cartItems = document.querySelectorAll('.quantity-input');
  const orderItems = [];

  cartItems.forEach(item => {
    const quantity = parseInt(item.value);
    const id = parseInt(item.dataset.itemId);
    if (quantity > 0) {
      orderItems.push({ id, amount: quantity });
    }
  });

  const orderData = {
    email: "client@example.com",
    name: "Client Name",
    address: "Delivery Address",
    cart: orderItems
  };

  fetch('https://api.kedufront.juniortaker.com/order/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to place the order');
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
    alert('Order placed successfully!');
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Failed to place the order. Please try again.');
  });
}

window.onload = updateCart;