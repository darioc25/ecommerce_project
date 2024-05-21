'use strict';

const API_URL = "https://dummyjson.com/products?limit=0";

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