'use strict';

// API url
const API_URL = "https://dummyjson.com/products?limit=0";

// Node elements
const menuBtn = document.querySelector(".navbar-menu-btn");
const cartBtn = document.querySelector(".navbar-cart-btn");
const sectionFilter = document.querySelector(".section-filter");
const sectionCart = document.querySelector(".section-cart");
const sectionProductsContainer = document.querySelector(".section-products-container");
const sectionProductsMask = document.querySelector(".section-products-mask");
const navbarCartBadge = document.querySelector(".navbar-cart-badge");
const SectionProductsResultsValue = document.querySelector(".section-products-results-value");

// Globals
let cartBtnClicked = false;
let menuBtnClicked = false;
let cart;
let products;

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
   // Cart btn
   if(cartBtnClicked) {
      sectionCart.style.transform = "translateX(100%)";
      cartBtnClicked = false;
   };
   // Menu btn
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

// Add to cart btn
document.querySelector(".section-products").addEventListener("click", e => {
   if([...e.target.classList].includes("product-card-buttonbox-cart")) {
      const productId = Number(e.target.closest(".product-card").dataset.id);
      addToCart(productId);
      removeCartBtn(productId);
   };
});

// Cart micro-function #1
const navCartBadgeUpdate = () => {
   navbarCartBadge.innerHTML = cart.length;
};

// Cart micro-function #2
const cartBadgeUpdate = () => {
   if(cart.length === 0) return;
   document.querySelector(".cart-badge-items-quantity").innerHTML = cart.reduce((tot, entry) => tot += entry.qt, 0);
};

// Cart micro-function #3
const cartTotalAmountUpdate = () => {
   if(cart.length === 0) return;
   document.querySelector(".cart-total-products").innerHTML = cart.reduce((tot, entry) => {
      return tot += (entry.discountPercentage >= 10) ? ((entry.price * (1 - entry.discountPercentage / 100)) * entry.qt) : (entry.price * entry.qt);
   }, 0).toFixed(2);
};

// Remove button "Add to Cart" function
const removeCartBtn = function(id) {
   if(cart.find(entry => entry.id === id)?.qt > 9) {
      const btn = document.querySelector(`[data-id="${id}"]`).querySelector(".product-card-buttonbox-cart");
      btn.classList.remove("product-card-buttonbox-cart");
      btn.classList.add("product-card-buttonbox-cart-maxqt");
      btn.setAttribute("disabled", "disabled");
      btn.textContent = "MAX QUANTITY";
   };
};

// Add button "Add to Cart" function
const addCartBtn = function(id, bin = false) {
   const btn = document.querySelector(`[data-id="${id}"]`).querySelector(".product-card-buttonbox-cart-maxqt");
   if(cart.find(entry => entry.id === id).qt < 10 && !bin) {
      btn.classList.remove("product-card-buttonbox-cart-maxqt");
      btn.classList.add("product-card-buttonbox-cart");
      btn.removeAttribute("disabled");
      btn.textContent = "ADD TO CART";
   } else if(bin && cart.find(entry => entry.id === id).qt === 10) {
      btn.classList.remove("product-card-buttonbox-cart-maxqt");
      btn.classList.add("product-card-buttonbox-cart");
      btn.removeAttribute("disabled");
      btn.textContent = "ADD TO CART";
   };
};

// Cart button
cartBtn.addEventListener("click", () => {
   // Menu btn
   if(menuBtnClicked) {
      menuBtn.style.transform = "rotate(0deg)";
      sectionFilter.style.transform = "translateX(-100%)";
      menuBtnClicked = false;
   };
   // Cart btn animation
   if(!cartBtnClicked) {
      sectionProductsMask.classList.remove("d-none");
      sectionCart.style.transform = "translateX(0%)";
      cartBtnClicked = true;
      // Cart btn logic
      populateCart();
      cartBadgeUpdate();
      cartTotalAmountUpdate();
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
         continue;
      };
      optsEl += `<option value="${i + 1}">${i + 1}</option>`;
   };
   return optsEl;
};

// Adding products to cart [localStorage]
const addToCart = function(id) {
   if(cart.find(entry => entry.id === id)?.qt < 10) {
      cart.find(entry => entry.id === id).qt += 1;
   } else if(!cart.find(entry => entry.id === id)) {
      const product = products.find(entry => entry.id === id);
      const cartProduct = {
         id: product.id,
         title: product.title,
         price: product.price,
         discountPercentage: product.discountPercentage,
         qt: 1,
         thumbnail: product.thumbnail
      };
      cart.push(cartProduct);
   };
   localStorage.setItem("data", JSON.stringify(cart));
   navCartBadgeUpdate();
};

// Populate Cart
const populateCart = function() {
   sectionCart.innerHTML = "";
   if(cart.length === 0) {
      // Logic for empty cart
      sectionCart.innerHTML = `
         <div class="h-100 d-flex flex-column justify-content-center align-items-center">
            <h1 class="display-3"><i class="bi bi-emoji-frown"></i></h1>
            <h3 class="m-0 text-center">Your Cart is <span class="text-danger">Empty</span></h3>
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
                  <h6 class="m-0 text-secondary"><span class="cart-badge-items-quantity"></span> Items</h6>
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
                     <h6 class="m-0 cart-product-price">${entry.discountPercentage >= 10 ? "<del>" + entry.price + "$</del> " + (entry.price * (1 - (entry.discountPercentage / 100))).toFixed(2) + "$" : entry.price + "$"}</h6>
                  </div>
                  <!-- Buttons Box -->
                  <div class="cart-product-btn-box d-flex justify-content-between align-items-center">
                     <div class="d-flex align-items-center">
                        <label for="cart-product-quantity" class="me-1">Qt.</label>
                        <select name="cart-product-quantity" class="cart-product-quantity">${genOpt(entry.qt)}</select>
                     </div>
                     <button class="p-0"><i class="bi bi-trash3 cart-trash-btn"></i></button>
                  </div>
                  <!-- Discount Badge -->
                  ${entry.discountPercentage >= 10 ? "<span class='cart-product-discount'>" + entry.discountPercentage.toFixed() + "% OFF</span>" : ""}
               </div>
            </div>
         `;
         sectionCartContainer.innerHTML += cartProductCard;
      });
   };
};

// Cart event listener for delete product
sectionCart.addEventListener("click", e => {
   if(e.target.classList.contains("cart-trash-btn")) {
      const cartProduct = e.target.closest(".cart-product");
      addCartBtn(Number(cartProduct.dataset.id), true);
      cart.splice(cart.findIndex(entry => entry.id === Number(cartProduct.dataset.id)), 1);
      localStorage.setItem("data", JSON.stringify(cart));
      cartProduct.remove();
      navCartBadgeUpdate();
      cartBadgeUpdate();
      cartTotalAmountUpdate();
      // Logic for last item on cart
      if(cart.length === 0) {
         sectionCart.innerHTML = `
            <div class="h-100 d-flex flex-column justify-content-center align-items-center">
               <h1 class="display-3"><i class="bi bi-emoji-frown"></i></h1>
               <h3 class="m-0 text-center">Your Cart is <span class="text-danger">Empty</span></h3>
            </div>
         `;
      };
   };
});

// Cart event listener for change quantity (two event listener to resolve a smartphone bug)
sectionCart.addEventListener("change", e => {
   const selectQt = Number(e.target.value);
   const cartProduct = cart.find(entry => entry.id === Number(e.target.closest(".cart-product").dataset.id));
   if(selectQt !== cartProduct.qt) {
      cartProduct.qt = selectQt;
      localStorage.setItem("data", JSON.stringify(cart));
      cartBadgeUpdate();
      cartTotalAmountUpdate();
      addCartBtn(cartProduct.id)
      removeCartBtn(cartProduct.id);
   };
});

// Populate products list
const populateProductsList = async function() {
   try {
      const res = await fetch("https://dummyjson.com/products?limit=24&skip=50");
      const {products: data} = await res.json();
      products = data;
      SectionProductsResultsValue.innerHTML = products.length;
      products.forEach(entry => {
         const productCard = `
            <div class="col-12 col-sm-6 col-lg-4 col-xl-3 py-2">
               <div data-id="${entry.id}" class="product-card">
                  ${entry.discountPercentage >= 10 ? "<span class='product-card-discount-badge'>" + entry.discountPercentage.toFixed() + "% OFF</span>" : ""}
                  <div class="product-card-imagebox">
                     <img src="${entry.images[0]}">
                  </div>
                  <div class="product-card-textbox">
                     <h3 class="product-card-textbox-sku">SKU: ${entry.sku}</h3>
                     <h3 class="product-card-textbox-title">${entry.title.length > 20 ? entry.title.substring(0, 20) + '<span class="opacity-75">...</span>' : entry.title}</h3>
                     <h3 class="product-card-textbox-rating">
                        <span class="product-card-textbox-rating-stars" style="background: linear-gradient(90deg, orange ${((entry.rating * 100) / 5).toFixed()}%, rgba(0, 0, 0, 0.15) 0%)">
                           <i class="bi bi-star-fill"></i>
                           <i class="bi bi-star-fill"></i>
                           <i class="bi bi-star-fill"></i>
                           <i class="bi bi-star-fill"></i>
                           <i class="bi bi-star-fill"></i>
                        </span>
                        <span class="product-card-textbox-rating-value ms-2">${entry.rating}</span>
                     </h3>
                     <h3 class="product-card-textbox-price">${entry.discountPercentage >= 10 ? "<del>" + entry.price + "$</del> " + (entry.price * (1 - (entry.discountPercentage / 100))).toFixed(2) + "$" : entry.price + "$" }</h3>
                  </div>
                  <div class="product-card-buttonbox">
                     <button class="product-card-buttonbox-cart">ADD TO CART</button>
                  </div>
               </div>
            </div>
         `;
         sectionProductsContainer.innerHTML += productCard;
         removeCartBtn(entry.id);
      });
   } catch(error) {
      console.error(error);
   }
};

// Executing functions on window load event
window.addEventListener("load", () => {
   getCategories();
   cart = JSON.parse(localStorage.getItem("data")) || new Array();
   navCartBadgeUpdate();
   populateProductsList();
});