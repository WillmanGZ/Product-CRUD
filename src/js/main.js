import Swal from "sweetalert2";

//DOM References
const loadBtn = document.getElementById("load-products-btn");
const addBtn = document.getElementById("add-button");
const productNameInput = document.getElementById("product-name");
const productPriceInput = document.getElementById("product-price");
const productDescriptionInput = document.getElementById("product-description");
const productImageUrlInput = document.getElementById("product-image");

//API URL
const apiUrl = "http://localhost:3000/products";

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
  const response = await fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        Toast.fire({
          icon: "error",
          title: `Error ${response.status}: ${response.statusText}`,
        });
      }
      return response.json();
    })
    .then((data) => {
      Toast.fire({
        icon: "success",
        title: `Products were got successfully`,
      });
      console.log(data);
    });
}

//Function to add products to database
async function addProduct() {
  if (isValidProduct()) {
    const productName = productNameInput.value.trim();
    const productPrice = productPriceInput.value.trim();
    const productDescription = productDescriptionInput.value.trim();
    const productImageUrl = productImageUrlInput.value.trim();

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: productName,
        price: productPrice,
        description: productDescription,
        imageUrl: productImageUrl,
      }),
    }).then((response) => {
      if (response.status == 201) {
        Toast.fire({
          icon: "success",
          title: "Product was add successfully!",
        });
      } else {
        Toast.fire({
          icon: "error",
          title: `Error ${response.status}: ${response.statusText}`,
        });
      }
      console.log(response);
    });
  }
}

//Function to validate products
function isValidProduct() {
  const productName = productNameInput.value.trim();
  const productPrice = productPriceInput.value.trim();
  const productDescription = productDescriptionInput.value.trim();
  const productImageUrl = productImageUrlInput.value.trim();

  // Name: required, min 2 chars
  if (!productName || productName.length < 2) {
    Toast.fire({
      icon: "error",
      title: "Product name is required and must be at least 2 characters.",
    });
    productNameInput.focus();
    return false;
  }
  // Price: required, must be a positive number
  if (!productPrice || isNaN(productPrice) || Number(productPrice) <= 0) {
    Toast.fire({
      icon: "error",
      title: "Price is required and must be a positive number.",
    });
    productPriceInput.focus();
    return false;
  }
  // Description: required, min 5 chars
  if (!productDescription || productDescription.length < 5) {
    Toast.fire({
      icon: "error",
      title: "Description is required and must be at least 5 characters.",
    });

    productDescriptionInput.focus();
    return false;
  }
  // Image URL: optional, but if present must be a valid URL
  if (productImageUrl && !/^https?:\/\/.+\..+/.test(productImageUrl)) {
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

loadBtn.addEventListener("click", getProducts);
