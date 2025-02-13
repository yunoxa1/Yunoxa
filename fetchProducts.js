import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Initialize Supabase client
const supabase = createClient(
    "https://qopdjgfciakmvhlriixt.supabase.co",
    "your_public_anon_key_here" // Use the Public Key, NOT the Service Role Key
);

async function fetchProducts() {
    let productList = document.getElementById("productList");

    if (!productList) {
        console.error("Error: 'productList' element not found!");
        return;
    }

    const { data, error } = await supabase
        .from("products")
        .select("id, name, price, description, image"); // Select relevant columns

    if (error) {
        console.error("Error fetching products:", error);
        return;
    }

    console.log("Fetched products:", data); // Debugging

    if (data.length === 0) {
        productList.innerHTML = "<p>No products found.</p>";
        return;
    }

    // Clear old content
    productList.innerHTML = "";

    // Loop through the products and create HTML
    data.forEach(product => {
        let productItem = document.createElement("div");
        productItem.classList.add("col-lg-2", "col-md-4", "wow", "fadeInUp");
        productItem.setAttribute("data-wow-delay", "0.3s");

        productItem.innerHTML = `
            <div class="team-item">
                <div class="team-img position-relative overflow-hidden">
                    <img class="img-fluid" src="${product.image}" alt="${product.name}">
                    <div class="team-social">
                        <a class="btn btn-square" href="#"><i class="fa fa-shopping-cart"></i></a>
                    </div>
                </div>
                <div class="bg-secondary text-center p-4">
                    <h5 class="text-uppercase">${product.name}</h5>
                    <span class="text-primary">$${product.price}</span>
                    <p>${product.description}</p>
                </div>
            </div>
        `;
        productList.appendChild(productItem);
    });
}

// Call the function after DOM loads
document.addEventListener("DOMContentLoaded", fetchProducts);
