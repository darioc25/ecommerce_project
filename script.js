'use strict';

// API url
const API_URL = "https://dummyjson.com/products?limit=0";

// Node elements
const menuBtn = document.querySelector(".navbar-menu-btn");
const cartBtn = document.querySelector(".navbar-cart-btn");
const sectionFilter = document.querySelector(".section-filter");
const sectionCart = document.querySelector(".section-cart");
const sectionProductsMask = document.querySelector(".section-products-mask");

// Global flags
let cartBtnClicked = false;
let menuBtnClicked = false;

// Fetching from API and populating categories list
const categoriesListEl = document.querySelector(".filter-categories-win-list");
const getCategories = async function() {
   try {
      const res = await fetch("https://dummyjson.com/products/categories");
      const categories = await res.json();
      categories.forEach(entry => {
         const categoryEl = `
            <li class="mb-2">
               <label><input type="checkbox" name="category" value="${entry.slug}"><span class="ms-2">${entry.name}</span></label>
            </li>
         `;
         categoriesListEl.insertAdjacentHTML("beforeend", categoryEl);
      });
   } catch(error) {
      console.error(error);
   };
};

// Menu button logic
menuBtn.addEventListener("click", () => {
   if(cartBtnClicked) {
      sectionCart.style.transform = "translateX(100%)";
      cartBtnClicked = false;
   };
   if(!menuBtnClicked) {
      menuBtn.style.transform = "rotate(90deg)";
      sectionProductsMask.classList.remove("d-none");
      sectionFilter.style.transform = "translateX(0%)";
      menuBtnClicked = true;
   } else {
      menuBtn.style.transform = "rotate(0deg)";
      sectionProductsMask.classList.add("d-none");
      sectionFilter.style.transform = "translateX(-100%)";
      menuBtnClicked = false;
   };
});

// Cart button logic
cartBtn.addEventListener("click", () => {
   // Menu btn
   if(menuBtnClicked) {
      menuBtn.style.transform = "rotate(0deg)";
      sectionFilter.style.transform = "translateX(-100%)";
      menuBtnClicked = false;
   };
   if(!cartBtnClicked) {
      sectionProductsMask.classList.remove("d-none");
      sectionCart.style.transform = "translateX(0%)";
      cartBtnClicked = true;
   } else {
      sectionProductsMask.classList.add("d-none");
      sectionCart.style.transform = "translateX(100%)";
      cartBtnClicked = false;
   };
});

// Filter collapse buttons logic
const filterCollapseBtn = document.querySelectorAll(".filter-collapse-btn");
filterCollapseBtn.forEach(btn => {
   let filterCollapseBtnClicked = false;
   btn.addEventListener("click", () => {
      if(!filterCollapseBtnClicked) {
         btn.style.transform = "rotate(180deg)";
         filterCollapseBtnClicked = true;
      } else {
         btn.style.transform = "rotate(0deg)";
         filterCollapseBtnClicked = false;
      }
      document.querySelector(`.${btn.dataset.refer}`).classList.toggle("d-none");
   });
});

// Getting all the active inputs data from filter settings
const submitBtn = document.querySelector(".filter-form-apply-btn");
submitBtn.addEventListener("click", (e) => {
   e.preventDefault();
   const filterInputsData = [...sectionFilter.querySelectorAll("input")].filter((entry) => {
      return (entry.checked) || (entry.type === "number" && entry.value !== "");
   });
   filterInputsData.forEach(entry => console.log(`${entry.name}: ${entry.value}`));
});

// Generating option elements for cart products
const genOpt = function(qt = 1) {
   let optsEl = "";
   for(let i = 0; i < 10; i++) {
      if(i + 1 === qt) {
         optsEl += `<option value="${i + 1}" selected>${i + 1}</option>`;
      };
      optsEl += `<option value="${i + 1}">${i + 1}</option>`;
   };
   return optsEl;
};

// Fake cart data
const cart = [
   {
      "id": 36,
      "title": "Protein Powder",
      "price": 19.99,
      "thumbnail": "https://cdn.dummyjson.com/products/images/groceries/Protein%20Powder/thumbnail.png"
   },
   {
      "id": 37,
      "title": "Red Onions",
      "price": 1.99,
      "thumbnail": "https://cdn.dummyjson.com/products/images/groceries/Red%20Onions/thumbnail.png"
   },
   {
      "id": 38,
      "title": "Rice",
      "price": 5.99,
      "thumbnail": "https://cdn.dummyjson.com/products/images/groceries/Rice/thumbnail.png"
   },
   {
      "id": 39,
      "title": "Soft Drinks",
      "price": 1.99,
      "thumbnail": "https://cdn.dummyjson.com/products/images/groceries/Soft%20Drinks/thumbnail.png"
   },
   {
      "id": 40,
      "title": "Strawberry",
      "price": 3.99,
      "thumbnail": "https://cdn.dummyjson.com/products/images/groceries/Strawberry/thumbnail.png"
   },
   {
      "id": 41,
      "title": "Tissue Paper Box",
      "price": 2.49,
      "thumbnail": "https://cdn.dummyjson.com/products/images/groceries/Tissue%20Paper%20Box/thumbnail.png"
   }
];

// Populate Cart
const populateCart = function() {
   sectionCart.innerHTML = "";
   if(cart.length === 0) {
      // Logic for empty cart
      sectionCart.innerHTML += `
         <div class="h-100 d-flex flex-column justify-content-center align-items-center">
            <h1 class="display-3"><i class="bi bi-emoji-frown"></i></h1>
            <h3 class="m-0 text-center">Your Cart is<br><span class="text-danger">Empty</span></h3>
         </div>
      `;
   } else {
      // Logic for cart with items
      sectionCart.innerHTML = `
         <div class="container-fluid h-100">
            <div class="row h-100">
               <!-- Cart Title -->
               <div class="col-12 d-flex justify-content-between align-items-center section-cart-title-box">
                  <h4 class="m-0">Shopping Cart</h4>
                  <h6 class="m-0">${cart.length} Items</h6>
               </div>
               <!-- Cart Products Container -->
               <div class="section-cart-container col-12 d-flex flex-column pt-3"></div>
               <!-- Cart Total Amount -->
               <div class="col-12 section-cart-total-box d-flex justify-content-between align-items-center">
                  <h3 class="m-0">Total</h3>
                  <h5 class="m-0"><span class="cart-total-products">0</span>$</h5>
               </div>
            </div>
         </div>
      `;
      const sectionCartContainer = document.querySelector(".section-cart-container");
      const cartTotalAmount = document.querySelector(".cart-total-products");
      cart.forEach(entry => {
         const cartProductCard = `
            <div class="cart-product d-flex w-100 mb-3" data-id="${entry.id}">
               <!-- Image Box -->
               <div class="cart-product-image-box d-flex justify-content-center align-items-center">
                  <img src="${entry.thumbnail}" class="img-fluid">
               </div>
               <div class="d-flex flex-column ps-2 flex-grow-1">
                  <!-- Details Box -->
                  <div class="cart-product-details-box d-flex justify-content-between">
                     <h6 class="m-0 cart-product-details-title">${entry.title.length > 15 ? entry.title.substring(0, 15) + '<span class="opacity-75">...</span>' : entry.title}</h6>
                     <h6 class="m-0 cart-product-price">${entry.price}$</h6>
                  </div>
                  <!-- Buttons Box -->
                  <div class="cart-product-btn-box d-flex justify-content-between align-items-center">
                     <div class="d-flex align-items-center">
                        <label for="cart-product-quantity" class="me-1">Qt.</label>
                        <select name="cart-product-quantity">${genOpt(1)}</select>
                     </div>
                     <button class="p-0"><i class="bi bi-trash3"></i></button>
                  </div>
               </div>
            </div>
         `;
         sectionCartContainer.innerHTML += cartProductCard;
         cartTotalAmount.innerHTML = (Number(cartTotalAmount.innerHTML) + entry.price).toFixed(2);
      });
   };
};

// Executing functions on window load event
window.addEventListener("load", () => {
   getCategories();
   populateCart();
   console.log("Content loaded...");
});