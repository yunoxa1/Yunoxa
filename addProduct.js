import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Initialize Supabase client
const supabase = createClient(
    "https://qopdjgfciakmvhlriixt.supabase.co",
    "your_public_anon_key_here" // Use Public Key, NOT Service Role Key
);

// Function to add product
async function addProduct(productData) {
    const { data, error } = await supabase
        .from("products")
        .insert([productData])
        .select(); // Ensure it returns inserted data

    if (error) {
        console.error("Error adding product:", error);
    } else {
        console.log("Product added successfully:", data);
    }
}

// Example product (update as needed)
const newProduct = {
    name: "Samsung Galaxy S24",
    price: 999,
    description: "Latest flagship smartphone from Samsung.",
    image: "https://example.com/samsung-s24.jpg" // Make sure image URLs are valid
};

addProduct(newProduct);
