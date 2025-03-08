document.addEventListener('DOMContentLoaded', function() {
    // Initialize Supabase client
    const supabaseUrl = 'https://qopdjgfciakmvhlriixt.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvcGRqZ2ZjaWFrbXZobHJpaXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0NDA2NDAsImV4cCI6MjA1NTAxNjY0MH0.5UAelwww7WpDUExqhc5dH2JhUWlGNgUNjh8fzxPNZvs';  // Never expose this in the frontend
    const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey); 

    async function fetchProducts() {
        try {
            const { data, error } = await supabaseClient
                .from('products')
                .select('*');

            if (error) throw error;
            displayProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error.message);
            showErrorToUser();
        }
    }

    function displayProducts(products) {
        const carousel = document.getElementById('product-carousel');
        if (!carousel) {
            console.error('Carousel element not found');
            return;
        }

        carousel.innerHTML = '';
        products.forEach(product => {
            carousel.appendChild(createProductItem(product));
        });

        initializeCarousel();
    }

    function createProductItem(product) {
        const item = document.createElement('div');
        item.className = 'product-item bg-light';
        item.innerHTML = `
            <div class="product-img position-relative overflow-hidden">
                <img class="img-fluid w-100" src="${product.image}" alt="${product.name}" loading="lazy">
                <div class="product-action">
                    ${createActionButtons()}
                </div>
            </div>
            <div class="text-center py-4">
                <a class="h6 text-decoration-none text-truncate" href="#">${product.name}</a>
                <div class="d-flex align-items-center justify-content-center mt-2">
                    <h5>$${(product.price || 0).toFixed(2)}</h5> <!-- Added a fallback to avoid errors -->
                </div>
                ${createRatingSection()}
            </div>
        `;
        return item;
    }

    function createActionButtons() {
        return [
            {icon: 'fa-shopping-cart', action: 'cart'},
            {icon: 'far fa-heart', action: 'wishlist'},
            {icon: 'fa-sync-alt', action: 'compare'},
            {icon: 'fa-search', action: 'quick-view'}
        ].map(btn => ` 
            <a class="btn btn-outline-dark btn-square" href="#" data-action="${btn.action}">
                <i class="${btn.icon}"></i>
            </a>
        `).join('');
    }

    function createRatingSection() {
        return `
            <div class="d-flex align-items-center justify-content-center mb-1">
                ${Array(5).fill('<small class="fa fa-star text-primary mr-1"></small>').join('')}
                <small>(99)</small>
            </div>
        `;
    }

    function initializeCarousel() {
        if (typeof $.fn.owlCarousel === 'function') {
            $('#product-carousel').owlCarousel({
                loop: true,
                margin: 20,
                nav: true,
                dots: false,
                responsive: {
                    0: { items: 1 },
                    576: { items: 2 },
                    768: { items: 3 },
                    992: { items: 4 }
                }
            });
        } else {
            console.error('Owl Carousel not loaded');
        }
    }

    function showErrorToUser() {
        const carousel = document.getElementById('product-carousel');
        if (carousel) {
            carousel.innerHTML = `
                <div class="alert alert-danger m-3">
                    Failed to load products. Please try again later.
                </div>
            `;
        }
    }

    // Initialize the process
    fetchProducts();
});
