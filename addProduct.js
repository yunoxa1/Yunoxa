import supabase from "./supabase.js";

document.getElementById("addProductForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("productName").value;
    const details = document.getElementById("productDetails").value;
    const image = document.getElementById("productImage").value;
    const price = document.getElementById("productPrice").value;

    const { data, error } = await supabase.from("products").insert([
        { name, details, image, price }
    ]);

    if (error) {
        console.error("Error inserting product:", error);
    } else {
        console.log("Product added successfully:", data);
        alert("Product added!");
    }
});
