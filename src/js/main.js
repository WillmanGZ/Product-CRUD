import Swal from "sweetalert2";

//DOM References
const addBtn = document.getElementById("add-button");
const productNameInput = document.getElementById("product-name");
const productPriceInput = document.getElementById("product-price");
const productDescriptionInput = document.getElementById("product-description");
const productImageUrlInput = document.getElementById("product-image");

//API URL
const apiUrl = "http://localhost:3000/products";

//Products Storage
let products = [];

//Load products
getProducts();

//Toast
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

//Function to get all products
async function getProducts() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      Toast.fire({
        icon: "error",
        title: `Error ${response.status}: ${response.statusText}`,
      });
      return;
    }
    const data = await response.json();
    products = data;
    renderProducts(data);
  } catch (err) {
    Toast.fire({
      icon: "error",
      title: `Error loading products`,
    });
  }
}

// Render products in the grid
function renderProducts(products) {
  const grid = document.getElementById("products-grid");
  grid.innerHTML = "";
  if (!products || products.length === 0) {
    grid.innerHTML = `<p class="no-products">No products found.</p>`;
    return;
  }
  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    // Imagen
    let imgHtml = "";
    if (product.imageUrl && product.imageUrl.trim() !== "") {
      imgHtml = `<img src="${product.imageUrl}" alt="${product.name}" />`;
    } else {
      imgHtml = `<div>🛒</div>`;
    }

    card.innerHTML = `
      ${imgHtml}
      <h3>${product.name}</h3>
      <p class="product-description">${product.description}</p>
      <p><b>Price:</b> $${product.price}</p>
      <div class="product-actions">
        <button class="edit" onclick="editProduct('${product.id}')">Edit</button>
        <button class="delete" onclick="deleteProduct('${product.id}')">Delete</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

//Function to add products to database
async function addProduct() {
  const productName = productNameInput.value.trim();
  const productPrice = productPriceInput.value.trim();
  const productDescription = productDescriptionInput.value.trim();
  const productImageUrl = productImageUrlInput.value.trim();

  const newProduct = {
    name: productName,
    price: productPrice,
    description: productDescription,
    imageUrl: productImageUrl,
  };

  if (isValidProduct(newProduct)) {
    let productExist = false;
    products.forEach((product) => {
      if (product.name.toLowerCase() == newProduct.name.toLowerCase())
        productExist = true;
      return;
    });

    if (productExist) {
      Toast.fire({
        icon: "warning",
        title: "Can't create this product, this product already exist",
      });
      return;
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    }).then((response) => {
      if (response.status == 201) {
        Toast.fire({
          icon: "success",
          title: "Product was add successfully!",
        });
        getProducts();
      } else {
        Toast.fire({
          icon: "error",
          title: `Error ${response.status}: ${response.statusText}`,
        });
      }
    });
  }
}

//Function to edit products
async function editProduct(productId) {
  const product = products.find((p) => p.id == productId);

  if (!product) {
    Toast.fire({
      icon: "error",
      title: "Product doesn't exist!",
    });
    return;
  }

  const { value: formValues } = await Swal.fire({
    title: "Edit Product",
    html: `<input id="swal-edit-name" class="swal2-input" placeholder="Name" value="${
      product.name
    }" autofocus>
      <input id="swal-edit-price" class="swal2-input" placeholder="Price" type="number" value="${
        product.price
      }">
      <textarea id="swal-edit-description" class="swal2-textarea" placeholder="Description">${
        product.description
      }</textarea>
      <input id="swal-edit-image" class="swal2-input" placeholder="Image URL" value="${
        product.imageUrl || ""
      }">`,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Save",
    preConfirm: () => {
      const name = document.getElementById("swal-edit-name").value.trim();
      const price = document.getElementById("swal-edit-price").value.trim();
      const description = document
        .getElementById("swal-edit-description")
        .value.trim();
      const imageUrl = document.getElementById("swal-edit-image").value.trim();

      const newProduct = { name, price, description, imageUrl };

      if (isValidProduct(newProduct)) return newProduct;
      else return false;
    },
  });

  if (formValues) {
    // Actualizar producto en la API
    const response = await fetch(apiUrl + `/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...product,
        name: formValues.name,
        price: formValues.price,
        description: formValues.description,
        imageUrl: formValues.imageUrl,
      }),
    });
    if (response.ok) {
      Toast.fire({ icon: "success", title: "Product updated!" });
      getProducts();
    } else {
      Toast.fire({
        icon: "error",
        title: `Error ${response.status}: ${response.statusText}`,
      });
    }
  }
}

//Function to delete products
async function deleteProduct(productId) {
  const product = products.find((p) => p.id == productId);
  if (!product) {
    Toast.fire({
      icon: "error",
      title: "Product doesn't exist!",
    });
    return;
  }

  const result = await Swal.fire({
    title: `Do you want to delete the product ${product.name}`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#dc3545",
    cancelButtonColor: "#888",
  });
  if (result.isConfirmed) {
    const response = await fetch(apiUrl + `/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status == 200) {
      Toast.fire({
        icon: "success",
        title: "Product was deleted successfully!",
      });
      getProducts();
    } else {
      Toast.fire({
        icon: "error",
        title: `Error ${response.status}: ${response.statusText}`,
      });
    }
  }
}

//Function to validate products
function isValidProduct(product) {
  const name = product.name;
  const price = product.price;
  const description = product.description;
  const imageUrl = product.imageUrl;

  // Name: required, min 2 chars
  if (!name || name.length < 2) {
    Toast.fire({
      icon: "error",
      title: "Product name is required and must be at least 2 characters.",
    });
    productNameInput.focus();
    return false;
  }
  // Price: required, must be a positive number
  if (!price || isNaN(price) || Number(price) <= 0) {
    Toast.fire({
      icon: "error",
      title: "Price is required and must be a positive number.",
    });
    productPriceInput.focus();
    return false;
  }
  // Description: required, min 5 chars
  if (!description || description.length < 5) {
    Toast.fire({
      icon: "error",
      title: "Description is required and must be at least 5 characters.",
    });

    productDescriptionInput.focus();
    return false;
  }
  // Image URL: optional, but if present must be a valid URL
  if (imageUrl && !/^https?:\/\/.+\..+/.test(imageUrl)) {
    Toast.fire({
      icon: "error",
      title:
        "If provided, the image URL must be valid (start with http/https).",
    });
    productImageUrlInput.focus();
    return false;
  }
  return true;
}

addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  addProduct();
});

//Global references
window.deleteProduct = deleteProduct;
window.editProduct = editProduct;
