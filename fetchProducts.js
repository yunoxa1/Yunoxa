import supabase from "./supabase.js"; 

async function loadProductDetails(productId) {
    const { data, error } = await supabase.from("products").select("*").eq('id', productId).single();

    if (error) {
        console.error("Error fetching product details:", error);
        return;
    }

    const container = document.getElementById("productDetailsContainer");

    if (!container) {
        console.error("Error: 'productDetailsContainer' element not found!");
        return;
    }

    // Fill in the product details dynamically
    document.getElementById('productTitle').innerText = data.name;
    document.getElementById('productDescription').innerText = data.description;
    document.getElementById('productPrice').innerText = `LKR ${data.price}`;

    // Assuming you have an array of images for each product
    const carouselInner = document.querySelector('.carousel-inner');
    carouselInner.innerHTML = '';  // Clear any existing carousel items

    data.images.forEach((image, index) => {
        const carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item', index === 0 ? 'active' : '');
        carouselItem.innerHTML = `<img class="img-fluid h-100" src="${image}" alt="Image ${index + 1}">`;
        carouselInner.appendChild(carouselItem);
    });

    // Update the "Buy Now" button dynamically
    const buyNowButton = document.getElementById('buyNowLink');
    buyNowButton.href = `https://wa.me/+94726472827?text=Product%20order%20(Product%20ID%20-%20${data.id})`;
}

// Example: Get the product ID from the URL (e.g., ?productId=123)
const productId = new URLSearchParams(window.location.search).get('productId');
if (productId) {
    loadProductDetails(productId);
} else {
    console.error("Product ID not found in URL.");
}
