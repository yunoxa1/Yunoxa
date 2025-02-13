import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
    "https://qopdjgfciakmvhlriixt.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvcGRqZ2ZjaWFrbXZobHJpaXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0NDA2NDAsImV4cCI6MjA1NTAxNjY0MH0.5UAelwww7WpDUExqhc5dH2JhUWlGNgUNjh8fzxPNZvs"
);

// Example function to insert product data
async function addProduct(productData) {
    const { data, error } = await supabase.from("products").insert([productData]);

    if (error) {
        console.error("Error adding product:", error);
    } else {
        console.log("Product added successfully:", data);
    }
}

// Example usage
const newProduct = {
    name: "Sample Product",
    price: 100,
    description: "This is a test product",
};

addProduct(newProduct);
