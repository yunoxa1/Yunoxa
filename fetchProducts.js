import supabase from "./supabase.js"; // Ensure supabase.js is correctly set up

async function loadProducts() {
    const { data, error } = await supabase.from("products").select("*");

    if (error) {
        console.error("Error fetching products:", error);
        return;
    }

    const container = document.getElementById("productsContainer");
    
    if (!container) {
        console.error("Error: 'productsContainer' element not found!");
        return;
    }

    container.innerHTML = ""; // Clear existing content

    data.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.classList.add("product");

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" width="200">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <p>Price: LKR ${product.price}</p>
            <button onclick="buyNow('${product.id}')">Buy Now</button>
        `;

        container.appendChild(productCard);
    });
}

loadProducts();
