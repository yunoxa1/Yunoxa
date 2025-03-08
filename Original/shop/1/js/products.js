
        import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
    
        const supabaseUrl = 'https://qopdjgfciakmvhlriixt.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvcGRqZ2ZjaWFrbXZobHJpaXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0NDA2NDAsImV4cCI6MjA1NTAxNjY0MH0.5UAelwww7WpDUExqhc5dH2JhUWlGNgUNjh8fzxPNZvs';
        const supabase = createClient(supabaseUrl, supabaseKey);
    
        // Star rating function
        function generateStarRating() {
    // Generate random rating between 3.7 and 5.0
    const rating = (Math.random() * (5 - 3.7) + 3.7).toFixed(1);
    
    // Calculate stars
    const fullStars = Math.floor(rating);
    const halfStar = (rating - fullStars) >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    // Build HTML
    let starHtml = '';
    for (let i = 0; i < fullStars; i++) {
        starHtml += '<small class="fa fa-star mr-1" style="color: #FFD700;"></small>';
    }
    if (halfStar) {
        starHtml += '<small class="fa fa-star-half-alt mr-1" style="color: #FFD700;"></small>';
    }
    for (let i = 0; i < emptyStars; i++) {
        starHtml += '<small class="far fa-star mr-1" style="color: #d3d3d3;"></small>';
    }

    // Return BOTH properties
    return { starHtml, rating }; // This line was likely missing
}
    
        async function fetchProducts() {
            const { data, error } = await supabase.from('products').select('*');
    
            if (error) {
                console.error("Supabase Error:", error);
                return;
            }
    
            const productsContainer = document.getElementById('products');
            productsContainer.innerHTML = '';
    
            data.forEach(product => {
                const imageUrl = product.image || 'https://via.placeholder.com/250';
                const { starHtml, rating } = generateStarRating();
            
                const productElement = document.createElement('div');
                productElement.classList.add('col-lg-4', 'col-md-6', 'col-6', 'pb-1');
            
                productElement.innerHTML = `
                    <div class="product-item mb-4" style="background-color: white;">
                        <div class="product-img position-relative overflow-hidden">
                            <img class="img-fluid w-100" src="${imageUrl}" alt="${product.name}">
                            <div class="product-action">
                                <a class="btn btn-outline-dark btn-square add-to-cart" 
                                   data-product='${JSON.stringify(product).replace(/'/g, "&apos;")}'>
                                    <i class="fa fa-shopping-cart"></i>
                                </a>
                            </div>
                        </div>
                        <div class="text-center py-4">
                            <a class="h6 text-decoration-none text-truncate d-block" href="open.html?id=${product.id}">
                                ${product.name}
                            </a>
                            <div class="d-flex align-items-center justify-content-center mt-2">
                                <h6>LKR ${parseFloat(product.price).toFixed(2)}</h6>
                            </div>
                            <div class="d-flex align-items-center justify-content-center mb-1">
                                ${starHtml} 
                                <small class="ml-1">(${rating})</small>
                            </div>
                            <!-- Description (visible only in list view) -->
                            <div class="list-view-description">
                                <p class="description">
                                    ${product.description}
                                </p>
                            </div>
                        </div>
                    </div>
                `;
            
                productsContainer.appendChild(productElement);
            });
    
            // Add event listeners to "Add to Cart" buttons
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', (event) => {
                    event.preventDefault();
                    const product = JSON.parse(button.dataset.product);
                    addToCart(product);
                });
            });
        }
    
        // Cart Logic
        function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.id === product.id);

        // Ensure price is a number
        const price = typeof product.price === 'string' 
            ? parseFloat(product.price.replace('$', '')) 
            : product.price;

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: price,
                quantity: 1,
                image: product.image
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        window.updateCartCount(); // Call global function
        window.showToast(); // Call global function
    }
    
        // Initialize when the DOM loads
        document.addEventListener('DOMContentLoaded', fetchProducts);

        async function searchProducts() {
    const searchQuery = document.getElementById('search-input').value.toLowerCase();
    const { data, error } = await supabase.from('products').select('*');

    if (error) {
        console.error("Supabase Error:", error);
        return;
    }

    const filteredProducts = data.filter(product => 
        product.name.toLowerCase().includes(searchQuery)
    );

    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = '';

    filteredProducts.forEach(product => {
        const imageUrl = product.image || 'https://via.placeholder.com/250';
        const { starHtml, rating } = generateStarRating();

        const productElement = document.createElement('div');
productElement.classList.add('col-lg-4', 'col-md-6', 'col-6', 'pb-1'); // Added col-6 for mobile

productElement.innerHTML = `
    <div class="product-item mb-4" style="background-color: white;">
        <div class="product-img position-relative overflow-hidden">
            <img class="img-fluid w-100" src="${imageUrl}" alt="${product.name}">
            <div class="product-action">
                <a class="btn btn-outline-dark btn-square add-to-cart" 
                   data-product='${JSON.stringify(product)}'>
                    <i class="fa fa-shopping-cart"></i>
                </a>
            </div>
        </div>
        <div class="text-center py-4">
            <a class="h6 text-decoration-none text-truncate d-block" href="open.html?id=${product.id}">
                ${product.name}
            </a>
            <div class="d-flex align-items-center justify-content-center mt-2">
                <h6>LKR ${parseFloat(product.price).toFixed(2)}</h6>
            </div>
            <div class="d-flex align-items-center justify-content-center mb-1">
                ${starHtml} 
                <small class="ml-1">(${rating})</small>
            </div>
        </div>
    </div>
`;

productsContainer.appendChild(productElement);
    });

    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const product = JSON.parse(button.dataset.product);
            addToCart(product);
        });
    });
} 
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts(); // Fetch and display all products initially
    document.getElementById('search-input').addEventListener('input', searchProducts);
});
    