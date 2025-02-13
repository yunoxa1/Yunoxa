import supabase from "./supabase.js"; 

async function loadProducts() {
    const { data, error } = await supabase.from("products").select("*");

    if (error) {
        console.error("Error fetching products:", error);
        return;
    }

    const container = document.getElementById("productsContainer");
    if (!container) {
        console.error("Error: 'productsContainer' not found!");
        return;
    }

    container.innerHTML = ""; // Clear previous products

    data.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.classList.add("product");

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" width="200">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <p>Price: LKR ${product.price}</p>
            <button onclick="openProduct('${product.id}')">
                <i class="fa fa-shopping-cart"></i>
            </button>
        `;

        container.appendChild(productCard);
    });
}

function openProduct(productId) {
    window.location.href = `open.html?productId=${productId}`;
}

loadProducts();
