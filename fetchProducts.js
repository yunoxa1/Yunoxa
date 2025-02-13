import supabase from "./supabase.js";

async function loadProducts() {
    const { data, error } = await supabase.from("products").select("*");

    if (error) {
        console.error("Error fetching products:", error);
        return;
    }

    const container = document.getElementById("productsContainer");
    container.innerHTML = ""; // Clear existing content

    data.forEach((product) => {
        const productCard = `
            <div class="product">
                <img src="${product.image}" alt="${product.name}" width="200">
                <h2>${product.name}</h2>
                <p>${product.details}</p>
                <p>Price: LKR ${product.price}</p>
                <button onclick="buyNow('${product.id}')">Buy Now</button>
            </div>
        `;
        container.innerHTML += productCard;
    });
}

loadProducts();
