document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            mobileBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a link
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            mobileBtn.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- E-COMMERCE LOGIC ---

    // 1. Mock Data
    const defaultProducts = [
        {
            id: 1,
            name: "Manzanas Orgánicas",
            category: "Frutas & Verduras",
            price: 2.50,
            image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6fac6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            badge: "Fresco"
        },
        {
            id: 2,
            name: "Bebida Energética 500ml",
            category: "Bebidas Frías",
            price: 1.80,
            image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            badge: "Oferta"
        },
        {
            id: 3,
            name: "Chips de Papas Artesanales",
            category: "Snacks & Dulces",
            price: 3.20,
            image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            badge: ""
        },
        {
            id: 4,
            name: "Pan Integral Multigrano",
            category: "Abarrotes",
            price: 4.50,
            image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            badge: ""
        },
        {
            id: 5,
            name: "Leche Entera 1L",
            category: "Abarrotes",
            price: 1.50,
            image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            badge: ""
        },
        {
            id: 6,
            name: "Chocolate Amargo 70%",
            category: "Snacks & Dulces",
            price: 2.90,
            image: "https://images.unsplash.com/photo-1548907040-4baa42d10919?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            badge: "Premium"
        }
    ];

    let products = JSON.parse(localStorage.getItem('flics_products')) || defaultProducts;

    function saveProducts() {
        localStorage.setItem('flics_products', JSON.stringify(products));
    }

    if (!localStorage.getItem('flics_products')) {
        saveProducts();
    }

    // 2. Render Products
    const productsContainer = document.getElementById('products-container');
    
    window.renderPublicProducts = function() {
        if (!productsContainer) return;
        productsContainer.innerHTML = '';
        products.forEach(product => {
            const badgeHtml = product.badge ? `<div class="product-badge">${product.badge}</div>` : '';
            const productHtml = `
                <div class="product-card" data-id="${product.id}">
                    <div class="product-img-container">
                        ${badgeHtml}
                        <img src="${product.image}" alt="${product.name}" class="product-img">
                    </div>
                    <div class="product-info">
                        <span class="product-category">${product.category}</span>
                        <h3 class="product-title">${product.name}</h3>
                        <div class="product-price">$${Number(product.price).toFixed(2)}</div>
                        <button class="btn-add-cart" onclick="addToCart(${product.id})">
                            <i class="fas fa-cart-plus"></i> Añadir
                        </button>
                    </div>
                </div>
            `;
            productsContainer.insertAdjacentHTML('beforeend', productHtml);
        });
    };

    renderPublicProducts();

    // 3. Cart State Management
    let cart = JSON.parse(localStorage.getItem('flics_cart')) || [];
    
    const cartIcon = document.getElementById('cart-icon');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.getElementById('close-cart');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('checkout-btn');
    const toastContainer = document.getElementById('toast-container');

    // Cart UI Toggle
    cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        openCart();
    });

    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    function openCart() {
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        renderCart();
    }

    function closeCart() {
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('show');
        document.body.style.overflow = '';
    }

    // Add to Cart (Global function so inline onclick can use it)
    window.addToCart = function(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }

        saveCart();
        updateCartBadge();
        showToast(`Se añadió "${product.name}" al carrito.`);
    };

    // Remove from Cart
    window.removeFromCart = function(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        renderCart();
        updateCartBadge();
    };

    // Update Quantity
    window.updateQuantity = function(productId, change) {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                removeFromCart(productId);
            } else {
                saveCart();
                renderCart();
                updateCartBadge();
            }
        }
    };

    // Save & Render logic
    function saveCart() {
        localStorage.setItem('flics_cart', JSON.stringify(cart));
    }

    function updateCartBadge() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Add a little pop animation
        cartCount.style.transform = 'scale(1.3)';
        setTimeout(() => {
            cartCount.style.transform = 'scale(1)';
        }, 200);
    }

    function renderCart() {
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Tu carrito está vacío.</p>';
            cartTotalPrice.textContent = '$0.00';
            return;
        }

        let total = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const itemHtml = `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        <div class="cart-item-actions">
                            <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        </div>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${item.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartItemsContainer.insertAdjacentHTML('beforeend', itemHtml);
        });

        cartTotalPrice.textContent = `$${total.toFixed(2)}`;
    }

    // Checkout
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showToast("El carrito está vacío.");
                return;
            }
            
            alert('¡Gracias por tu compra! (Simulación de pago)');
            cart = [];
            saveCart();
            renderCart();
            updateCartBadge();
            closeCart();
        });
    }

    // Toast Notification System
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <i class="fas fa-check-circle toast-icon"></i>
            <span>${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Trigger reflow to apply transition
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // Remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // Initialize Badge on load
    updateCartBadge();

    // --- ADMIN LOGIC ---
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const navLoginBtn = document.getElementById('nav-login-btn');
    const adminLoginModal = document.getElementById('admin-login-modal');
    const closeLoginBtn = document.getElementById('close-login');
    const loginSubmitBtn = document.getElementById('login-submit');
    const adminPasswordInput = document.getElementById('admin-password');
    const loginError = document.getElementById('login-error');

    const adminDashboardModal = document.getElementById('admin-dashboard-modal');
    const closeDashboardBtn = document.getElementById('close-dashboard');
    const adminProductsContainer = document.getElementById('admin-products-container');
    const addProductBtn = document.getElementById('add-product-btn');

    function openLoginModal(e) {
        if(e) e.preventDefault();
        adminLoginModal.classList.add('show');
        adminPasswordInput.value = '';
        loginError.textContent = '';
    }

    if (adminLoginBtn) adminLoginBtn.addEventListener('click', openLoginModal);
    if (navLoginBtn) navLoginBtn.addEventListener('click', openLoginModal);

    if (closeLoginBtn) {
        closeLoginBtn.addEventListener('click', () => {
            adminLoginModal.classList.remove('show');
        });
    }

    if (loginSubmitBtn) {
        loginSubmitBtn.addEventListener('click', () => {
            if (adminPasswordInput.value === 'admin123') {
                adminLoginModal.classList.remove('show');
                openAdminDashboard();
            } else {
                loginError.textContent = 'Contraseña incorrecta.';
            }
        });
    }

    if (closeDashboardBtn) {
        closeDashboardBtn.addEventListener('click', () => {
            adminDashboardModal.classList.remove('show');
        });
    }

    function openAdminDashboard() {
        adminDashboardModal.classList.add('show');
        renderAdminProducts();
    }

    function renderAdminProducts() {
        if (!adminProductsContainer) return;
        adminProductsContainer.innerHTML = '';

        products.forEach(product => {
            const adminHtml = `
                <div class="admin-item">
                    <div class="admin-item-info">
                        <div class="admin-item-title">${product.name}</div>
                        <div class="admin-item-cat">${product.category}</div>
                    </div>
                    <div class="admin-item-price-edit">
                        <span>$</span>
                        <input type="number" id="edit-price-${product.id}" value="${Number(product.price).toFixed(2)}" step="0.01">
                        <button class="btn-save-price" onclick="updateProductPrice(${product.id})">Guardar</button>
                    </div>
                </div>
            `;
            adminProductsContainer.insertAdjacentHTML('beforeend', adminHtml);
        });
    }

    window.updateProductPrice = function(id) {
        const input = document.getElementById(`edit-price-${id}`);
        const newPrice = parseFloat(input.value);
        if (isNaN(newPrice) || newPrice < 0) {
            showToast("Precio inválido");
            return;
        }

        const productIndex = products.findIndex(p => p.id === id);
        if (productIndex !== -1) {
            products[productIndex].price = newPrice;
            saveProducts();
            renderPublicProducts();
            renderCart(); // Actualiza el carrito si es que había de ese producto
            showToast("Precio actualizado");
        }
    };

    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => {
            const nameInput = document.getElementById('new-name');
            const catInput = document.getElementById('new-category');
            const priceInput = document.getElementById('new-price');
            const imgInput = document.getElementById('new-image');
            const badgeInput = document.getElementById('new-badge');

            if (!nameInput.value || !catInput.value || !priceInput.value || !imgInput.value) {
                showToast("Por favor llena los campos requeridos.");
                return;
            }

            const newProduct = {
                id: Date.now(),
                name: nameInput.value,
                category: catInput.value,
                price: parseFloat(priceInput.value),
                image: imgInput.value,
                badge: badgeInput.value || ""
            };

            products.push(newProduct);
            saveProducts();
            renderPublicProducts();
            renderAdminProducts();
            showToast("Producto añadido");

            nameInput.value = '';
            catInput.value = '';
            priceInput.value = '';
            imgInput.value = '';
            badgeInput.value = '';
        });
    }
});
