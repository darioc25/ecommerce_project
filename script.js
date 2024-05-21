'use strict';

const API_URL = "https://dummyjson.com/products?limit=0";

const mdBreakPoint = 768;

const menuBtn = document.querySelector(".navbar-menu-btn");
const sectionFilter = document.querySelector(".section-filter");
const sectionListFilter = document.querySelector(".section-list-filter");

const example = {
   id: 1,
   title: "iPhone 9",
   description: "An apple mobile which is nothing like apple",
   price: 549,
   discountPercentage: 12.96,
   rating: 4.69,
   stock: 94,
   brand: "Apple",
   category: "smartphones",
   thumbnail: "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
   images: [
      "https://cdn.dummyjson.com/product-images/1/1.jpg",
      "https://cdn.dummyjson.com/product-images/1/2.jpg",
      "https://cdn.dummyjson.com/product-images/1/3.jpg",
      "https://cdn.dummyjson.com/product-images/1/4.jpg",
      "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg"
   ]
};

const getProducts = async function() {
   const res = await fetch(API_URL);
   const data = await res.json();
   const {products} = data;
   products.forEach(entry => console.log(entry));
};

// getProducts();

let menuBtnFlag = false;
menuBtn.addEventListener("click", () => {
   const position = sectionFilter.style.left;
   const bodyWidth = document.body.clientWidth;
   if(menuBtnFlag) {
      menuBtn.style.transform = "rotate(0deg)";
      menuBtnFlag = false;
   } else {
      menuBtn.style.transform = "rotate(90deg)";
      menuBtnFlag = true;
   };
   if(!position || position !== "0%") {
      sectionFilter.style.left = "0%";
      sectionListFilter.style.opacity = "50%";
   } else if(position && bodyWidth >= mdBreakPoint) {
      sectionFilter.style.left = "-50%";
      sectionListFilter.style.opacity = "0%";
      sectionFilter.style.removeProperty("left");
   } else if(position && bodyWidth < mdBreakPoint) {
      sectionFilter.style.left = "-100%"
      sectionListFilter.style.opacity = "0%";
      sectionFilter.style.removeProperty("left");
   }
});