// responsive Nav Bar

function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

// Check and display all elements stored in local storage for the Cart

async function displayCartItemsFromLocalStorage() {
  const cartItems = document.getElementById('cart-items');
  cartItems.innerHTML = '';
  let cartIsEmpty = true;

  for (let i = 0; i < localStorage.length; i++) {
    const itemId = localStorage.key(i);
    const itemQuantity = parseInt(localStorage.getItem(itemId));

    if (itemQuantity > 0) {
      try {
        const response = await fetch(`https://api.kedufront.juniortaker.com/item/${itemId}`);
        if (!response.ok) {
          console.error('Failed to fetch item details:', response.statusText);
          continue;
        }
        const itemData = await response.json();
        const itemName = itemData.item.name;
        const itemPrice = itemData.item.price;

        const subtotal = itemPrice * itemQuantity;

        const row = document.createElement('tr');
        row.dataset.itemId = itemId;
        row.innerHTML = `
        <td>${itemName}</td>
        <td>${itemPrice}€</td>
        <td>
        <button class="quantity-btn minus-btn" onclick="decreaseQuantity(this)">-</button>
        <span class="quantity">${itemQuantity}</span>
        <button class="quantity-btn plus-btn" onclick="increaseQuantity(this)">+</button>
        </td>
        <td>${subtotal}€</td>
        `;
        cartItems.appendChild(row);
        cartIsEmpty = false;
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }
  if (cartIsEmpty) {
    const emptyCartMessage = document.createElement('tr');
    emptyCartMessage.innerHTML = `<td colspan="4">Your cart is empty</td>`;
    cartItems.appendChild(emptyCartMessage);
  }
}

// Handle the command creation and confirmation with buy now button in the cart

function handleBuyNow(event) {
  event.preventDefault();
  const email = document.getElementById('email').value.trim();
  const name = document.getElementById('name').value.trim();
  const address = document.getElementById('address').value.trim();

  if (email === '' || name === '' || address === '') {
    alert('Please fill in all required fields: email, name, and address.');
    return;
  }

  const cartRows = document.querySelectorAll('#cart-items tr[data-item-id]');
  const orderItems = [];

  cartRows.forEach(row => {
    const itemId = row.dataset.itemId;
    const quantity = parseInt(row.querySelector('.quantity').textContent);
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
    window.location.href = `confirmation.html?command_id=${data.command_id}`;
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Erreur lors de la commande');
  });
}

// + and - button on cart handling

function increaseQuantity(button) {
  const row = button.closest('tr');
  const quantityElement = row.querySelector('.quantity');
  let quantity = parseInt(quantityElement.textContent);
  quantity++;
  quantityElement.textContent = quantity;
  updateLocalStorage(row);
  updateSubtotal(row);
}

function decreaseQuantity(button) {
  const row = button.closest('tr');
  const quantityElement = row.querySelector('.quantity');
  let quantity = parseInt(quantityElement.textContent);
  if (quantity > 0) {
    quantity--;
    quantityElement.textContent = quantity;
    updateLocalStorage(row);
    if (quantity === 0) {
      row.remove();
    }
    updateSubtotal(row);
  }
}

function updateLocalStorage(row) {
  const itemId = row.dataset.itemId;
  const quantity = parseInt(row.querySelector('.quantity').textContent);
  localStorage.setItem(itemId, quantity);
}

function updateSubtotal(row) {
  const itemPrice = parseFloat(row.querySelector('td:nth-child(2)').textContent);
  const quantity = parseInt(row.querySelector('.quantity').textContent);
  const subtotal = itemPrice * quantity;
  row.querySelector('td:nth-child(4)').textContent = `${subtotal.toFixed(2)}€`;
}

// Get and display all element avaible in API for index

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

// Get and display one element for product pages

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
        let productCart = parseInt(localStorage.getItem(productId)) || 0;
        productCart++;
        localStorage.setItem(productId, productCart);
        console.log(`product: ${productCart}`);
        window.alert("Product Added to Cart");
      });
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

if (document.querySelector('.confirmed')) {
  document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const commandId = urlParams.get('command_id');
    if (commandId) {
        const commandIdSpan = document.getElementById('command-id-value');
        commandIdSpan.textContent = commandId;
    }
  });
  localStorage.clear();
}

if (document.querySelector('.product-title'))
  fetchProductDetails();


if (document.querySelector('.items-container'))
  window.onload = fetchItems;

if (document.querySelector('.form-group'))
  window.onload = displayCartItemsFromLocalStorage;