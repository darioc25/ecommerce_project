'use strict';

// API url
const API_URL = "https://dummyjson.com/products?limit=0";

// Node elements
const menuBtn = document.querySelector(".navbar-menu-btn");
const cartBtn = document.querySelector(".navbar-cart-btn");
const sectionFilter = document.querySelector(".section-filter");
const filterFormInputAlert = document.querySelector(".filter-form-input-alert");
const filterFormInputAlertText = document.querySelector(".filter-form-input-alert-text");
const categoriesListEl = document.querySelector(".filter-categories-win-list");
const submitBtn = document.querySelector(".filter-form-apply-btn");
const resetBtn = document.querySelector(".filter-form-reset-btn");
const sectionCart = document.querySelector(".section-cart");
const sectionProductsContainer = document.querySelector(".section-products-container");
const sectionProductsMask = document.querySelector(".section-products-mask");
const navbarCartBadge = document.querySelector(".navbar-cart-badge");
const sectionProductsTitleCategory= document.querySelector(".section-products-title-category");
const sectionProductsSearchbarInput = document.querySelector(".section-products-searchbar-input");
const sectionProductsResultsValue = document.querySelector(".section-products-results-value");

// Globals
let cartBtnClicked = false;
let menuBtnClicked = false;
let cart;

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
   if(cart.length > 0 && cart.length < 100) {
      navbarCartBadge.innerHTML = cart.length;
   } else if(cart.length >= 100) {
      navbarCartBadge.innerHTML = "99+";
   } else {
      navbarCartBadge.innerHTML = "";
   };
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
const addToCart = async function(id) {
   try{
      if(cart.find(entry => entry.id === id)?.qt < 10) {
         cart.find(entry => entry.id === id).qt += 1;
      } else if(!cart.find(entry => entry.id === id)) {
         const res = await fetch(`https://dummyjson.com/products/${id}?select=title,category,price,discountPercentage,thumbnail`);
         const product = await res.json();
         product.qt = 1;
         cart.push(product);
      };
      localStorage.setItem("data", JSON.stringify(cart));
      navCartBadgeUpdate();
   } catch(error) {
      console.error(error);
   };
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
            <div class="cart-product mb-3" data-id="${entry.id}">
               <div class="cart-product-image-box">
                  <img src="${entry.thumbnail}">
                  ${entry.discountPercentage >= 10 ? "<span class='cart-product-discount'>-" + entry.discountPercentage.toFixed() + "%</span>" : ""}
               </div>
               <div class="cart-product-box">
                  <h6 class="cart-product-title">${entry.title}</h6>
                  <h6 class="cart-product-category">${entry.category.replaceAll("-", " ")}</h6>
                  ${entry.discountPercentage >= 10 ? `<h6 class="cart-product-price"><del class="cart-product-price-deleted me-1">${entry.price}$</del><span class="text-danger">${(entry.price * (1 - (entry.discountPercentage / 100))).toFixed(2)}$</span></h6>` : `<h6 class="cart-product-price">${entry.price}$</h6>`}
                  <div class="cart-product-btn">
                     <div class="d-flex align-items-center">
                        <label for="cart-product-quantity" class="me-1">Qt.</label>
                        <select name="cart-product-quantity" class="cart-product-btn-quantity">${genOpt(entry.qt)}</select>
                     </div>
                     <button class="cart-product-btn-delete"><i class="bi bi-x cart-trash-btn"></i></button>
                  </div>
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
const populateProductsList = function(arr) {
   sectionProductsContainer.innerHTML = "";
   arr.forEach(entry => {
      const productCard = `
         <div class="col-12 col-sm-6 col-lg-4 col-xl-3 py-2">
            <div data-id="${entry.id}" class="product-card">
               ${entry.discountPercentage >= 10 ? `<span class="product-card-discount-badge">${entry.discountPercentage.toFixed()}% OFF</span>` : ""}
               ${entry.stock === 0 ? '<span class="product-card-bell-badge"><i class="bi bi-bell-fill"></i></span>' : ""}
               <div class="product-card-imagebox">
                  <img src="${entry.images[0]}" class="img-fluid">
               </div>
               <div class="product-card-textbox">
                  <h6 class="product-cart-textbox-sku">SKU: ${entry.sku}</h6>
                  ${entry.stock > 10 ? '<h6 class="product-cart-textbox-stock-avaible">In Stock</h6>' : (entry.stock === 0 ? '<h6 class="product-cart-textbox-stock-out">Out of Stock</h6>' : '<h6 class="product-cart-textbox-stock-low">Low Stock</h6>')}
                  <h3 class="product-card-textbox-title">${entry.title}</h3>
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
                  ${entry.discountPercentage >= 10 ? `<h3 class="product-card-textbox-price"><del class="product-card-textbox-price-deleted me-1">${entry.price}$</del>${(entry.price * (1 - (entry.discountPercentage / 100))).toFixed(2)}$</h3>` : `<h3 class="product-card-textbox-price">${entry.price}$</h3>`}
               </div>
               <div class="product-card-buttonbox">
                  ${entry.stock === 0 ? '<button class="product-card-buttonbox-unavailable" disabled>SOLD OUT</button>' : '<button class="product-card-buttonbox-cart">ADD TO CART</button>'}
               </div>
            </div>
         </div>
      `;
      sectionProductsContainer.innerHTML += productCard;
      removeCartBtn(entry.id);
   });
};

// Get all products from API call
const getProducts = async function() {
   try {
      console.log("API call...");
      const res = await fetch("https://dummyjson.com/products?limit=12");
      const {products} = await res.json();
      return products;
   } catch(error) {
      console.error(error);
   };
};

// Populate categories list
const getCategories = function(products) {
      const categories = new Map();
      products.forEach(entry => !categories.has(entry.category) ? categories.set(entry.category, 1) : categories.set(entry.category, categories.get(entry.category) + 1));
      categoriesListEl.insertAdjacentHTML("beforeend", `
         <li class="mb-2 d-flex justify-content-between">
            <label><input type="radio" name="category" value="all" checked><span class="ms-2">All</span></label>
            <span class="text-primary">[${[...categories].reduce((tot, entry) => tot += entry[1], 0)}]</span>
         </li>
      `);
      [...categories].forEach(([str, value], id, arr) => {
         const categoryStr = str.includes("-") ? str.replace("-", " ") : str;
         const categoryEl = `
            <li class="${id === arr.length - 1 ? "mb-0" : "mb-2"} d-flex justify-content-between">
               <label><input type="radio" name="category" value="${str}"><span class="ms-2 text-capitalize">${categoryStr}</span></label>
               <span class="text-primary">[${value}]</span>
            </li>
         `;
         categoriesListEl.insertAdjacentHTML("beforeend", categoryEl);
      });
};

// Searchbar eventListener
const searchbarFilter = function(arr) {
   sectionProductsSearchbarInput.addEventListener("input", () => {
      const queryStr = sectionProductsSearchbarInput.value.toLowerCase().trim();
      const resultProducts = arr.filter(entry => entry.title.toLowerCase().includes(queryStr));
      sectionProductsResultsValue.innerHTML = resultProducts.length;
      console.log(resultProducts);
   });
};

// Getting all the active inputs data from filter settings
const filterSettings = function(arr) {
   const minPriceEl = sectionFilter.querySelector("input[name='min-price']");
   const maxPriceEl = sectionFilter.querySelector("input[name='max-price']");
   const minProductPrice = Math.floor(Math.min(...arr.map(entry => entry.price)));
   const maxProductPrice = Math.ceil(Math.max(...arr.map(entry => entry.price)));
   minPriceEl.value = minProductPrice;
   maxPriceEl.value = maxProductPrice;
   // Submit btn
   submitBtn.addEventListener("click", e => {
      e.preventDefault();
      filterFormInputAlert.classList.add("d-none");
      const filterInputsData = [...sectionFilter.querySelectorAll("input")]
      .filter(entry => (entry.checked) || (entry.type === "number" && entry.value !== ""))
      .map(entry => [entry.name, entry.value]);
      sectionProductsTitleCategory.innerHTML = filterInputsData.find(entry => entry[0] === "category")[1].replace("-", "");
      let filteredArr = arr;
      let priceRangeFlag = false;
      if((minPriceEl.value && maxPriceEl.value) && (parseInt(minPriceEl.value) > parseInt(maxPriceEl.value))) {
         filterFormInputAlert.classList.remove("d-none");
         filterFormInputAlertText.innerHTML = "Min-Price greater than Max-Price."
         priceRangeFlag = true;
      } else if((minPriceEl.value && maxPriceEl.value) && (parseInt(minPriceEl.value) === parseInt(maxPriceEl.value))) {
         filterFormInputAlert.classList.remove("d-none");
         filterFormInputAlertText.innerHTML = "Min-Price equal to Max-Price."
         priceRangeFlag = true;
      };
      filterInputsData.forEach(([input, value]) => {
         switch(input) {
            case "sort-by":
               switch(value) {
                  case "min-max":
                     filteredArr = arr.sort((a, b) => a.price - b.price);
                     break;
                  case "max-min":
                     filteredArr = arr.sort((a, b) => b.price - a.price);
                     break;
                  case "a-z":
                     filteredArr = arr.sort((a, b) => {
                        const charA = a.title.toLowerCase();
                        const charB = b.title.toLowerCase();
                        if(charA > charB) {
                           return 1;
                        } else if(charA < charB) {
                           return -1;
                        } else {
                           return 0;
                        };
                     });
                     break;
                  case "z-a":
                     filteredArr = arr.sort((a, b) => {
                        const charA = a.title.toLowerCase();
                        const charB = b.title.toLowerCase();
                        if(charA > charB) {
                           return -1;
                        } else if(charA < charB) {
                           return 1;
                        } else {
                           return 0;
                        };
                     });
                     break;
                  case "higher-lower":
                     filteredArr = arr.filter(entry => entry.discountPercentage >= 10).sort((a, b) => b.discountPercentage - a.discountPercentage);
                     break;
                  case "lower-higher":
                     filteredArr = arr.filter(entry => entry.discountPercentage >= 10).sort((a, b) => a.discountPercentage - b.discountPercentage);
                     break;
               };
               console.log(`${input} -> ${value}`);
               break;
            case "min-price":
               if(priceRangeFlag) break;
               if(minPriceEl.value && !maxPriceEl.value) {
                  filteredArr = filteredArr.filter(entry => entry.price >= parseInt(minPriceEl.value));
               } else if(minPriceEl.value && maxPriceEl.value) {
                  filteredArr = filteredArr.filter(entry => entry.price >= parseInt(minPriceEl.value) && entry.price <= parseInt(maxPriceEl.value));
               };
               console.log(input, parseInt(value));
               break;
            case "max-price":
               if(priceRangeFlag) break;
               if(!minPriceEl.value && maxPriceEl.value) {
                  filteredArr = filteredArr.filter(entry => entry.price <= maxPriceEl.value);
               };
               console.log(input, parseInt(value));
               break;
            case "category":
               if(value === "all") {
                  console.log(`${input} -> ${value}`);
                  break;
               };
               filteredArr = filteredArr.filter(entry => entry.category === value);
               console.log(`${input} -> ${value}`);
               break;
         };
      });
      console.log(filteredArr);
      // Populate products list
      // populateProductsList(filteredArr);
   });
   // Reset btn
   resetBtn.addEventListener("click", e => {
      e.preventDefault();
      const sortByActive = [...sectionFilter.querySelectorAll("input[name='sort-by']")].filter(entry => entry.checked)[0];
      if(sortByActive) sortByActive.checked = false;
      minPriceEl.value = minProductPrice;
      maxPriceEl.value = maxProductPrice;
      const categoryActive = [...sectionFilter.querySelectorAll("input[name='category']")].filter(entry => entry.checked);
      if(categoryActive !== "all") {
         categoryActive.checked = false;
         sectionFilter.querySelector("input[value='all']").checked = true;
      };
      filterFormInputAlert.classList.add("d-none");
   });
};

// Initialize the whole async part of the code
const init = async function() {
   // Fetching all products from API call
   const res = await fetch("products.json");
   const products = await res.json();
   // Creating all the categories
   getCategories(products);
   // Searchbar init
   searchbarFilter(products);
   // Filter settings init
   filterSettings(products);
};

// Executing functions on window load event
window.addEventListener("load", () => {
   cart = JSON.parse(localStorage.getItem("data")) || new Array();
   navCartBadgeUpdate();
   init();
});