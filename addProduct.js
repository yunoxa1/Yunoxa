const newProduct = {
    name: "Sample Product",
    price: 100,
    description: "This is a test product",
};

async function addProduct(productData) {
    const { data, error } = await supabase.from("products").insert([productData]);

    if (error) {
        console.error("Error adding product:", error);
    } else {
        console.log("Product added successfully:", data);
    }
}

addProduct(newProduct);
