import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Initialize Supabase client
const supabase = createClient(
    "https://qopdjgfciakmvhlriixt.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvcGRqZ2ZjaWFrbXZobHJpaXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0NDA2NDAsImV4cCI6MjA1NTAxNjY0MH0.5UAelwww7WpDUExqhc5dH2JhUWlGNgUNjh8fzxPNZvs" // Use Public Key, NOT Service Role Key
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
