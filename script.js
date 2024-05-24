'use strict';

const API_URL = "https://dummyjson.com/products?limit=10";

const getProducts = async function() {
   const res = await fetch(API_URL);
   const data = await res.json();
   const {products} = data;
   return products;
};

const categoriesListEl = document.querySelector(".filter-categories-win-list");
const getCategories = async function() {
   try {
      const products = await getProducts();
      const categories = new Map();
      // Map creation with categories and amount of items for each
      products.forEach(entry => {
         if(!categories.has(entry.category)) {
            categories.set(entry.category, 1);
         } else {
            categories.set(entry.category, categories.get(entry.category) + 1);
         };
      });
      // Creation of categories input for filter setting
      for(let [key, value] of categories) {
         const categoryStr = key.split("-").length > 1 
         ? `${key.split("-")[0][0].toUpperCase() + key.split("-")[0].slice(1)} ${key.split("-")[1][0].toUpperCase() + key.split("-")[1].slice(1)}`
         : key[0].toUpperCase() + key.slice(1);
         const categoryEl = `
            <li class="my-2 d-flex justify-content-between">
               <label><input type="checkbox" name="category" value="${key}"> ${categoryStr}</label>
               <span class="category-quantity">(${value})</span>
            </li>
         `;
         categoriesListEl.insertAdjacentHTML("beforeend", categoryEl);
      };
   } catch(error) {
      console.error(error);
   };
};

// Node elements
const menuBtn = document.querySelector(".navbar-menu-btn");
const cartBtn = document.querySelector(".navbar-cart-btn");
const sectionFilter = document.querySelector(".section-filter");
const sectionCart = document.querySelector(".section-cart");
const sectionProductsMask = document.querySelector(".section-products-mask");

let menuBtnClicked = false;
let cartBtnClicked = false;

// Menu button logic
menuBtn.addEventListener("click", () => {
   if(cartBtnClicked) {
      sectionCart.style.transform = "translateX(100%)";
      cartBtnClicked = false;
   }

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

// Fetching inputs data
const submitBtn = document.querySelector(".filter-form-apply-btn");
submitBtn.addEventListener("click", (e) => {
   e.preventDefault();
   const filterInputData = [...sectionFilter.querySelectorAll("input")].filter((entry) => {
      return (entry.checked) || (entry.type === "number" && entry.value !== "");
   });
   filterInputData.forEach(entry => console.log(`${entry.name}: ${entry.value}`));
});

// Filter collapse buttons
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

const genOpt = function() {
   let optsEl = "";
   for(let i = 0; i < 10; i++) {
      optsEl += `<option value="${i + 1}">${i + 1}</option>`;
   };
   return optsEl;
};

// Populate Cart
const populateCart = function() {
   sectionCart.innerHTML = "";
   const items = 10;
   // Logic for empty cart
   if(items === 0) {
      const emptyMsg = `
         <div class="h-100 d-flex flex-column justify-content-center align-items-center">
            <h1 class="display-3"><i class="bi bi-emoji-frown"></i></h1>
            <h3 class="m-0 text-center">Your Cart is<br><span class="text-danger">Empty</span></h3>
         </div>
      `;
      sectionCart.innerHTML += emptyMsg;
      return;
   };
   // Logic for cart with items
   const sectionCartContent = `
      <div class="container-fluid h-100">
         <div class="row h-100">
            <!-- Cart Title -->
            <div class="col-12 d-flex justify-content-between align-items-center section-cart-title-box">
               <h4 class="m-0">Shopping Cart</h4>
               <h6 class="m-0">${items} Items</h6>
            </div>
            <!-- Cart Products Container -->
            <div class="section-cart-container col-12 d-flex flex-column pt-3"></div>
            <div class="col-12 section-cart-total-box d-flex justify-content-between align-items-center">
               <h3 class="m-0">Total</h3>
               <h5 class="m-0"><span class="cart-total-products">0</span>$</h5>
            </div>
         </div>
      </div>
   `;
   sectionCart.innerHTML = sectionCartContent;
   const sectionCartContainer = document.querySelector(".section-cart-container");
   const cartTotalProducts = document.querySelector(".cart-total-products");
   getProducts().then(products => {
      for(let i = 0; i < 10; i++) {
         const cartProductCard = `
            <div class="cart-product d-flex w-100 mb-3" data-id="${products[i].id}">
               <!-- Image Box -->
               <div class="cart-product-image-box d-flex justify-content-center align-items-center">
                  <img src="${products[i].thumbnail}" class="img-fluid">
               </div>
               <div class="d-flex flex-column ps-2 flex-grow-1">
                  <!-- Details Box -->
                  <div class="cart-product-details-box d-flex justify-content-between">
                     <h6 class="m-0 cart-product-details-title">${products[i].title.length > 15 ? products[i].title.substring(0, 15) + '<span class="opacity-75">...</span>' : products[i].title}</h6>
                     <h6 class="m-0 cart-product-price">${products[i].price}$</h6>
                  </div>
                  <!-- Buttons Box -->
                  <div class="cart-product-btn-box d-flex justify-content-between align-items-center">
                     <div class="d-flex align-items-center">
                        <label for="cart-product-quantity" class="me-1">Qt.</label>
                        <select name="cart-product-quantity">${genOpt()}</select>
                     </div>
                     <button class="p-0"><i class="bi bi-trash3"></i></button>
                  </div>
               </div>
            </div>
         `;
         sectionCartContainer.innerHTML += cartProductCard;
         cartTotalProducts.innerHTML = (Number(cartTotalProducts.innerHTML) + products[i].price).toFixed(2);
      };
   });
};

// On window load event
window.addEventListener("load", () => {
   // getCategories();
   populateCart();
   console.log("Content loaded...");
});