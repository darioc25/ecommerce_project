'use strict';

// API url
const API_URL = "https://dummyjson.com/products?limit=0";

// Own functions
const ownFilter = function(array, callback) {
   let validEntryID = 0;
   for(let i = 0; i < array.length; i++) {
      if(callback(array[i])) {
         array[validEntryID] = array[i];
         validEntryID++;
      };
   };
   array.length = validEntryID;
   return array;
};

// Node elements
const menuBtn = document.querySelector(".navbar-menu-btn");
const cartBtn = document.querySelector(".navbar-cart-btn");
const sectionFilter = document.querySelector(".section-filter");
const filterFormInputAlert = document.querySelector(".filter-form-input-alert");
const filterFormInputAlertText = document.querySelector(".filter-form-input-alert-text");
const minPriceEl = sectionFilter.querySelector("input[name='min-price']");
const maxPriceEl = sectionFilter.querySelector("input[name='max-price']");
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
const sectionProductsPagination = document.querySelector(".section-products-pagination");
const currentPageValue = document.querySelector(".current-page-value");
const totalPageValue = document.querySelector(".total-page-value");

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

// Set button "ADD TO CART" to "MAX QUANTITY"
const removeCartBtn = function(id) {
   const btnContainer = document.querySelector(`[data-id="${id}"]`).querySelector(".product-card-buttonbox");
   if(btnContainer) {
      if(cart.find(entry => entry.id === id)?.qt > 9) btnContainer.innerHTML = '<button class="product-card-buttonbox-cart-maxqt" disabled>MAX QUANTITY</button>';
   };
};

// Set button "MAX QUANTITY" to "ADD TO CART"
const addCartBtn = function(id, bin = false) {
   const btnContainer = document.querySelector(`[data-id="${id}"]`).querySelector(".product-card-buttonbox");
   if(btnContainer) {
      if(cart.find(entry => entry.id === id).qt < 10 && !bin) {
         btnContainer.innerHTML = '<button class="product-card-buttonbox-cart">ADD TO CART</button>';
      } else if(bin && cart.find(entry => entry.id === id).qt === 10) {
         btnContainer.innerHTML = '<button class="product-card-buttonbox-cart">ADD TO CART</button>';
      };
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
                  ${entry.stock === 0 ? '<button class="product-card-buttonbox-unavailable" disabled>SOLD OUT</button>' : (entry.stock > 0 && (!cart.find(element => element.id === entry.id) || cart.find(element => element.id === entry.id)?.qt < 10)) ? '<button class="product-card-buttonbox-cart">ADD TO CART</button>' : '<button class="product-card-buttonbox-cart-maxqt" disabled>MAX QUANTITY</button>'}
               </div>
            </div>
         </div>
      `;
      sectionProductsContainer.innerHTML += productCard;
   });
};

// Get all products from AJAX call
const getProducts = async function() {
   try {
      const res = await fetch("products.json");
      const data = await res.json();
      return data;
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
const searchbarFilter = function(obj, objPage) {
   sectionProductsSearchbarInput.addEventListener("input", () => {
      let filteredArr = obj.filterArr.concat([]);
      const queryStr = sectionProductsSearchbarInput.value.toLowerCase().trim();
      ownFilter(filteredArr, entry => entry.title.toLowerCase().includes(queryStr));
      // Update products result badge value
      sectionProductsResultsValue.innerHTML = filteredArr.length;
      obj.searchArr = filteredArr;
      // Update pagination
      updatePagination(obj.searchArr, obj);
      // Populate products list
      populateProductsList(obj.searchArr.slice(objPage.s, objPage.e + 1));
   });
};

// Getting all the active inputs data from filter settings
const filterSettings = function(obj, objPage) {
   // Set the min. and max. price in the inputs price range field
   minPriceEl.value = Math.floor(Math.min(...obj.products.map(entry => entry.price)));
   maxPriceEl.value = Math.ceil(Math.max(...obj.products.map(entry => entry.price)));
   // Submit btn event listener
   submitBtn.addEventListener("click", e => {
      e.preventDefault();
      filterFormInputAlert.classList.add("d-none");
      // Set the array equal to the other filter resulting array
      let filteredArr = obj.products.concat([]);
      // Fetch all the input fields coming from the form
      const filterInputsData = [...sectionFilter.querySelectorAll("input")]
         .filter(entry => (entry.checked) || (entry.type === "number" && entry.value !== ""))
         .map(entry => [entry.name, entry.value]);
      // Change the category title in the main page with the actual selected categorty
      sectionProductsTitleCategory.innerHTML = filterInputsData.find(entry => entry[0] === "category")[1].replace("-", " ");
      // Checking for valid input price range
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
      // Loop over all the inputs
      filterInputsData.forEach(([input, value]) => {
         switch(input) {
            case "sort-by":
               switch(value) {
                  case "min-max":
                     filteredArr.sort((a, b) => a.price - b.price);
                     break;
                  case "max-min":
                     filteredArr.sort((a, b) => b.price - a.price);
                     break;
                  case "a-z":
                     filteredArr.sort((a, b) => {
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
                     filteredArr.sort((a, b) => {
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
                     ownFilter(filteredArr, entry => entry.discountPercentage >= 10).sort((a, b) => b.discountPercentage - a.discountPercentage);
                     break;
                  case "lower-higher":
                     ownFilter(filteredArr, entry => entry.discountPercentage >= 10).sort((a, b) => a.discountPercentage - b.discountPercentage);
                     break;
               };
               break;
            case "min-price":
               if(priceRangeFlag) break;
               if(minPriceEl.value && !maxPriceEl.value) {
                  ownFilter(filteredArr, entry => entry.price >= parseInt(minPriceEl.value));
               } else if(minPriceEl.value && maxPriceEl.value) {
                  ownFilter(filteredArr, entry => entry.price >= parseInt(minPriceEl.value) && entry.price <= parseInt(maxPriceEl.value));
               };
               break;
            case "max-price":
               if(priceRangeFlag) break;
               if(!minPriceEl.value && maxPriceEl.value) {
                  ownFilter(filteredArr, entry => entry.price <= maxPriceEl.value);
               };
               break;
            case "category":
               if(value === "all") break;
               ownFilter(filteredArr, entry => entry.category === value);
               break;
         };
      });
      sectionProductsResultsValue.innerHTML = filteredArr.length;
      obj.filterArr = filteredArr;
      obj.searchArr = obj.filterArr;
      // Update pagination
      updatePagination(obj.filterArr, objPage);
      // Populate products list
      populateProductsList(obj.filterArr.slice(objPage.s, objPage.e + 1));
   });
   // Reset btn
   resetBtn.addEventListener("click", e => {
      e.preventDefault();
      // Change the category title in the main page with the default value
      sectionProductsTitleCategory.innerHTML = "All";
      // Clear searchbar
      sectionProductsSearchbarInput.value = "";
      // Reset and clear all the active input fields
      const sortByActive = [...sectionFilter.querySelectorAll("input[name='sort-by']")].filter(entry => entry.checked)[0];
      if(sortByActive) sortByActive.checked = false;
      minPriceEl.value = Math.floor(Math.min(...obj.products.map(entry => entry.price)));
      maxPriceEl.value = Math.floor(Math.max(...obj.products.map(entry => entry.price)));
      const categoryActive = [...sectionFilter.querySelectorAll("input[name='category']")].filter(entry => entry.checked);
      if(categoryActive !== "all") {
         categoryActive.checked = false;
         sectionFilter.querySelector("input[value='all']").checked = true;
      };
      // Remove alert banner
      filterFormInputAlert.classList.add("d-none");
      // Update products result badge value
      sectionProductsResultsValue.innerHTML = obj.products.length;
      // Reset array filter
      obj.filterArr = obj.products.concat([]);
      obj.searchArr = obj.filterArr;
      // Update pagination
      updatePagination(obj.filterArr, objPage);
      // Populate products list
      populateProductsList(obj.products.slice(objPage.s, objPage.e + 1));
   });
};

// Adding products to cart [localStorage]
const addToCart = function(obj) {
   if(cart.find(entry => entry.id === obj.id)?.qt < 10) {
      cart.find(entry => entry.id === obj.id).qt += 1;
   } else if(!cart.find(entry => entry.id === obj.id)) {
      obj.qt = 1;
      cart.push(obj);
   };
   localStorage.setItem("data", JSON.stringify(cart));
   navCartBadgeUpdate();
};

// Add to cart btn logic
const addToCartListener = function(arr) {
   document.querySelector(".section-products").addEventListener("click", e => {
      if([...e.target.classList].includes("product-card-buttonbox-cart")) {
         const productId = Number(e.target.closest(".product-card").dataset.id);
         const product = arr.find(entry => entry.id === productId);
         const cartProduct = {
            id: product.id,
            title: product.title,
            category: product.category,
            price: product.price,
            discountPercentage: product.discountPercentage,
            thumbnail: product.thumbnail
         };
         addToCart(cartProduct);
         removeCartBtn(cartProduct.id);
      };
   });
};

// Pagination logic
const pagination = function(objProduct, objPage) {
   const prevPage = document.querySelector(".section-products-pagination-btn-prev");
   const nextPage = document.querySelector(".section-products-pagination-btn-next");
   currentPageValue.innerHTML = objPage.currPage + 1;
   totalPageValue.innerHTML = objPage.pageNum;
   // Prev page btn
   prevPage.addEventListener("click", () => {
      if(objPage.currPage > 0) {
         objPage.currPage--;
         if(objProduct.searchArr.slice(objPage.s).length >= 12) {
            objPage.e -= 12;
         } else {
            objPage.e -= objProduct.searchArr.slice(objPage.s).length;
         };
         objPage.s -= 12;
         currentPageValue.innerHTML = objPage.currPage + 1;
         populateProductsList(objProduct.searchArr.slice(objPage.s, objPage.e + 1));
         document.querySelector(".section-products").scrollTo({top: 0});
      };
   });
   // Next page btn
   nextPage.addEventListener("click", () => {
      if(objPage.currPage < objPage.pageNum - 1) {
         objPage.currPage++;
         objPage.s += 12;
         if(objProduct.searchArr.slice(objPage.s).length >= 12) {
            objPage.e += 12;
         } else {
            objPage.e += objProduct.searchArr.slice(objPage.s).length;
         };
         currentPageValue.innerHTML = objPage.currPage + 1;
         populateProductsList(objProduct.searchArr.slice(objPage.s, objPage.e + 1));
         document.querySelector(".section-products").scrollTo({top: 0});
      };
   });
};

const updatePagination = function(arr, obj) {
   sectionProductsPagination.classList.remove("d-none");
   obj.pageNum = Math.ceil(arr.length / 12);
   obj.currPage = 0;
   obj.s = 0;
   arr.length >= 12 ? (obj.e = 11) : (obj.e = arr.length - 1);
   currentPageValue.innerHTML = obj.currPage + 1;
   totalPageValue.innerHTML = obj.pageNum;
   if(obj.pageNum <= 1) sectionProductsPagination.classList.add("d-none");
};

// Initialize the whole async part of the code
const init = async function() {
   // Fetching all products from an AJAX call
   const data = await getProducts();
   // Creating global variables
   const productsObj = {
      products: data,
      filterArr: data,
      searchArr: data
   };
   const paginationObj = {
      pageNum: Math.ceil(productsObj.products.length / 12),
      currPage: 0,
      s: 0,
      e: 11
   };
   // Init products result badge value
   sectionProductsResultsValue.innerHTML = productsObj.products.length;
   // Getting all categories
   getCategories(productsObj.products);
   // Searchbar init
   searchbarFilter(productsObj, paginationObj);
   // Filter init
   filterSettings(productsObj, paginationObj);
   // Add to cart btn logic init
   addToCartListener(productsObj.products);
   // Render products list
   populateProductsList(productsObj.products.slice(paginationObj.s, paginationObj.e + 1));
   // Pagination init
   pagination(productsObj, paginationObj);
};

// Executing functions on window load event
window.addEventListener("load", () => {
   cart = JSON.parse(localStorage.getItem("data")) || new Array();
   navCartBadgeUpdate();
   init();
});