async function fetchProducts() {
    const { data, error } = await supabase
        .from("products")
        .select("id, name, price, description, image"); // Fetch correct fields

    if (error) {
        console.error("Error fetching products:", error);
        return;
    }

    console.log("Fetched products:", data); // Debugging
}
