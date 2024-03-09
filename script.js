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

function handleBuyNow(event) {
  event.preventDefault();
  const email = document.getElementById('email').value.trim();
  const name = document.getElementById('name').value.trim();
  const address = document.getElementById('address').value.trim();

  if (email === '' || name === '' || address === '') {
    alert('Please fill in all required fields: email, name, and address.');
    return;
  }

  const cartItems = document.querySelectorAll('.quantity-input');
  const orderItems = [];

  cartItems.forEach(item => {
    const quantity = parseInt(item.value);
    const itemId = parseInt(item.dataset.itemId);
    if (quantity > 0) {
      orderItems.push({ id: itemId, amount: quantity });
    }
  });

  const orderData = {
    email: email,
    name: name,
    address: address,
    cart: orderItems
  };

  console.log(orderData);
  fetch('https://api.kedufront.juniortaker.com/order/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Erreur lors de la commande');
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
    const message = `Commande exécutée avec succès,\nNuméro de commande : ${data.command_id}`;
    alert(message);
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Erreur lors de la commande');
  });
}

async function fetchItems() {
  try {
    const response = await fetch('https://api.kedufront.juniortaker.com/item/');
    if (!response.ok) {
      throw new Error('Failed to fetch items');
    }
    const items = await response.json();
    displayItems(items);
  } catch (error) {
    console.error('Error:', error);
  }
}

function displayItems(items) {
  const itemsContainer = document.querySelector('.items-container');

  itemsContainer.innerHTML = '';

  items.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.classList.add('item');

    const anchorTag = document.createElement('a');
    anchorTag.href = `product.html?id=${item._id}`;
    const imageUrl = ``;
    anchorTag.innerHTML = `
      <img src="https://api.kedufront.juniortaker.com/item/picture/${item._id}" alt="${item.name}" class="item-image">
      <div class="item-details">
        <h2 class="item-name">${item.name}</h2>
        <p class="item-description">${item.description}</p>
        <p class="item-price">Price: ${item.price}€</p>
      </div>
    `;

    itemElement.appendChild(anchorTag);

    itemsContainer.appendChild(itemElement);
  });
}

async function fetchProductDetails() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');
  try {
    const response = await fetch(`https://api.kedufront.juniortaker.com/item/${productId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product details');
    }
    const product = await response.json();
    const productTitle = document.querySelector('.product-title');
    const productDescription = document.querySelector('.product-description');
    const productPrice = document.querySelector('.product-price');
    const productImage = document.querySelector('.product-image');

    productTitle.textContent = product.item.name;
    productDescription.textContent = product.item.description;
    productPrice.textContent = `Price: ${product.item.price}€`;

    const imageUrl = `https://api.kedufront.juniortaker.com/item/picture/${productId}`;
    console.log(imageUrl);
    productImage.src = imageUrl;
    if (document.querySelector('.product')) {
      const Btn = document.querySelector('.product');

      Btn.addEventListener('click', () => {
        let productCart = parseInt(localStorage.getItem(product.item.name)) || 0;
        productCart++;
        localStorage.setItem(product.item.name, productCart);
        console.log(`product: ${productCart}`);
      });
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

if (document.querySelector('.product-title'))
  fetchProductDetails();


if (document.querySelector('.items-container'))
  window.onload = fetchItems;

if (document.querySelector('.form-group'))
  window.onload = updateCart;