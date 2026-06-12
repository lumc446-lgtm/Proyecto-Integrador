document.addEventListener('DOMContentLoaded', () => {
    
    //  CATÁLOGO DE PRODUCTOS
    
    const defaultProducts = [
        { id: 1, name: "Plátano Seda Organico (Kg)", category: "Frutas & Verduras", price: 4.50, image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600", badge: "Fresco" },
        { id: 2, name: "Manzana Delicia Seleccionada", category: "Frutas & Verduras", price: 5.20, image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600", badge: "" },
        { id: 3, name: "Papas Fritas Lay's Clásicas Familiar", category: "Snacks & Dulces", price: 7.80, image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600", badge: "Popular" },
        { id: 4, name: "Gaseosa Inca Kola 1.5L Sin Azúcar", category: "Bebidas Frías", price: 6.50, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600", badge: "Helada" },
        { id: 5, name: "Bebida Energizante Monster Energy 473ml", category: "Bebidas Frías", price: 8.50, image: "https://images.unsplash.com/photo-1622543953495-a270c57459fc?w=600", badge: "3x2" },
        { id: 6, name: "Arroz Costeño Extra saco 1Kg", category: "Abarrotes", price: 4.90, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600", badge: "" }
    ];

    // Variables 
    let products = JSON.parse(localStorage.getItem('flics_products')) || defaultProducts;
    let cart = JSON.parse(localStorage.getItem('flics_cart')) || [];
    
    
    let instanceChartProductos = null;
    let instanceChartDinero = null;
    let instanceChartUsuarios = null;

    function saveProducts() { localStorage.setItem('flics_products', JSON.stringify(products)); }
    function saveCart() { localStorage.setItem('flics_cart', JSON.stringify(cart)); }

    
    // CATÁLOGO PÚBLICO 
    
    const productsContainer = document.getElementById('products-container');

    function renderPublicProducts() {
        if (!productsContainer) return;
        productsContainer.innerHTML = '';

        if (products.length === 0) {
            productsContainer.innerHTML = '<p class="text-muted" style="grid-column: 1/-1; text-align: center; padding: 40px;">No hay productos disponibles por el momento.</p>';
            return;
        }

        products.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('product-card');
            card.innerHTML = `
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <div class="product-img-container">
                    <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
                </div>
                <div class="product-info">
                    <span class="product-cat">${product.category}</span>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-meta">
                        <span class="product-price">S/ ${Number(product.price).toFixed(2)}</span>
                        <button class="btn-add-cart" data-id="${product.id}"><i class="fas fa-plus"></i></button>
                    </div>
                </div>
            `;
            productsContainer.appendChild(card);
        });

        document.querySelectorAll('.btn-add-cart').forEach(btn => {
            btn.parentNode.replaceChild(btn.cloneNode(true), btn);
        });
        document.querySelectorAll('.btn-add-cart').forEach(btn => {
            btn.addEventListener('click', () => addToCart(parseInt(btn.dataset.id)));
        });
    }

   
    // LÓGICA INTERNA DEL CARRITO 
    
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartIcon = document.getElementById('cart-icon');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountEl = document.getElementById('cart-count');
    const cartTotalPriceEl = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (cartIcon) cartIcon.addEventListener('click', (e) => { e.preventDefault(); toggleCart(true); });
    if (closeCartBtn) closeCartBtn.addEventListener('click', () => toggleCart(false));
    if (cartOverlay) cartOverlay.addEventListener('click', () => toggleCart(false));

    function toggleCart(open) {
        if (open) { cartSidebar.classList.add('show'); cartOverlay.classList.add('show'); }
        else { cartSidebar.classList.remove('show'); cartOverlay.classList.remove('show'); }
    }

    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) { cartItem.quantity += 1; } 
        else { cart.push({ ...product, quantity: 1 }); }

        saveCart();
        updateCartUi();
        showToast(`"${product.name}" añadido al carrito.`);
    }

    function updateCartUi() {
        if (!cartItemsContainer) return;
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let count = 0;

        cart.forEach(item => {
            total += item.price * item.quantity;
            count += item.quantity;

            const div = document.createElement('div');
            div.classList.add('cart-item');
            div.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${item.quantity} x S/ ${Number(item.price).toFixed(2)}</div>
                </div>
                <button class="btn-remove" style="background:none; border:none; color:var(--accent-color); cursor:pointer;" data-id="${item.id}"><i class="fas fa-trash"></i></button>
            `;
            cartItemsContainer.appendChild(div);
        });

        if (cartCountEl) cartCountEl.textContent = count;
        if (cartTotalPriceEl) cartTotalPriceEl.textContent = `S/ ${total.toFixed(2)}`;

        document.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                cart = cart.filter(item => item.id !== id);
                saveCart();
                updateCartUi();
            });
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) { alert('Su carrito se encuentra vacío.'); return; }
            toggleCart(false);
            document.getElementById('payment-modal').classList.add('show');
        });
    }

    document.getElementById('close-payment')?.addEventListener('click', () => document.getElementById('payment-modal').classList.remove('show'));
    document.getElementById('close-yape')?.addEventListener('click', () => document.getElementById('yape-modal').classList.remove('show'));

    document.getElementById('pay-cash')?.addEventListener('click', () => finalizarPedido('Efectivo'));
    document.getElementById('pay-yape')?.addEventListener('click', () => {
        document.getElementById('payment-modal').classList.remove('show');
        document.getElementById('yape-modal').classList.add('show');
    });
    document.getElementById('confirm-yape')?.addEventListener('click', () => {
        document.getElementById('yape-modal').classList.remove('show');
        finalizarPedido('Yape');
    });

    function finalizarPedido(metodo) {
        const orderId = 'FL-' + Math.floor(100000 + Math.random() * 900000);
        const total = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
        
        const newOrder = {
            id: orderId,
            date: new Date().toLocaleDateString('es-PE'),
            payment: metodo,
            items: cart,
            total: total
        };

        const existingOrders = JSON.parse(localStorage.getItem('flics_orders')) || [];
        existingOrders.push(newOrder);
        localStorage.setItem('flics_orders', JSON.stringify(existingOrders));

        cart = [];
        saveCart();
        updateCartUi();
        alert(`¡Pedido procesado con éxito! Código de Orden: ${orderId}. Pago seleccionado: ${metodo}`);
    }

  
    //  SECCIÓN ADMIN
    
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const navLoginBtn = document.getElementById('nav-login-btn');
    const adminLoginModal = document.getElementById('admin-login-modal');
    const closeLoginBtn = document.getElementById('close-login');
    const loginSubmitBtn = document.getElementById('login-submit');
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    const loginError = document.getElementById('login-error');

    const adminDashboardModal = document.getElementById('admin-dashboard-modal');
    const closeDashboardBtn = document.getElementById('close-dashboard');
    const adminProductsContainer = document.getElementById('admin-products-container');
    const addProductBtn = document.getElementById('add-product-btn');
    const newCategorySelect = document.getElementById('new-category-select');

    const newNameInput = document.getElementById('new-name');
    const newPriceInput = document.getElementById('new-price');
    const newImageInput = document.getElementById('new-image');
    const newBadgeInput = document.getElementById('new-badge');

    if (adminLoginBtn) adminLoginBtn.addEventListener('click', (e) => { e.preventDefault(); openLogin(); });
    if (navLoginBtn) navLoginBtn.addEventListener('click', (e) => { e.preventDefault(); openLogin(); });
    if (closeLoginBtn) closeLoginBtn.addEventListener('click', () => adminLoginModal.classList.remove('show'));
    if (closeDashboardBtn) closeDashboardBtn.addEventListener('click', () => adminDashboardModal.classList.remove('show'));

    function openLogin() {
        if (loginError) loginError.textContent = '';
        if (loginEmail) loginEmail.value = '';
        if (loginPassword) loginPassword.value = '';
        adminLoginModal.classList.add('show');
    }

    if (loginSubmitBtn) {
        loginSubmitBtn.addEventListener('click', () => {
            if (loginEmail.value === 'admin' && loginPassword.value === 'admin') {
                adminLoginModal.classList.remove('show');
                adminDashboardModal.classList.add('show');
                initAdminDashboard();
            } else {
                loginError.textContent = 'Credenciales incorrectas';
            }
        });
    }

    // Control  del panel admin
    const tabButtons = document.querySelectorAll('.admin-tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            const currentTabId = btn.dataset.tab;
            document.getElementById(currentTabId)?.classList.add('active');

            
            if (currentTabId === 'tab-graficos') {
                generarGraficosEstadisticos();
            }
        });
    });

    function initAdminDashboard() {
        renderAdminProducts();
        populateCategoriesSelect();
        renderAdminOrders();
    }

    function populateCategoriesSelect() {
        if (!newCategorySelect) return;
        const defaultCategories = ["Frutas & Verduras", "Snacks & Dulces", "Bebidas Frías", "Abarrotes"];
        newCategorySelect.innerHTML = defaultCategories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
    }

    function renderAdminProducts() {
        if (!adminProductsContainer) return;
        adminProductsContainer.innerHTML = '';

        if (products.length === 0) {
            adminProductsContainer.innerHTML = '<p class="text-muted">No hay productos en el catálogo.</p>';
            return;
        }

        products.forEach(product => {
            const itemHtml = `
                <div class="admin-item" data-id="${product.id}">
                    <div class="admin-item-info">
                        <div class="admin-item-title">${product.name}</div>
                        <div class="admin-item-cat">${product.category}</div>
                    </div>
                    <div class="admin-item-price-edit">
                        <input type="number" value="${Number(product.price).toFixed(2)}" step="0.10" id="price-input-${product.id}">
                        <button class="btn-save-price" onclick="saveAdminPrice(${product.id})" title="Guardar Precio">
                            <i class="fas fa-save"></i>
                        </button>
                        <button class="btn-save-price" onclick="deleteProduct(${product.id})" style="background-color: var(--accent-color);" title="Eliminar Producto">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            adminProductsContainer.insertAdjacentHTML('beforeend', itemHtml);
        });
    }

    window.saveAdminPrice = function(productId) {
        const input = document.getElementById(`price-input-${productId}`);
        if (!input) return;

        const newPrice = parseFloat(input.value);
        if (isNaN(newPrice) || newPrice < 0) { alert("Ingrese un precio válido."); return; }

        const product = products.find(p => p.id === productId);
        if (product) {
            product.price = newPrice;
            saveProducts();
            renderPublicProducts();
            showToast(`Precio de "${product.name}" actualizado.`);
        }
    };

    window.deleteProduct = function(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const confirmar = confirm(`¿Está seguro de que desea eliminar permanentemente el producto "${product.name}"?`);
        if (confirmar) {
            products = products.filter(p => p.id !== productId);
            saveProducts();
            renderAdminProducts();
            renderPublicProducts();
            showToast(`El producto "${product.name}" ha sido eliminado.`);
        }
    };

    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => {
            const name = newNameInput.value.trim();
            const category = newCategorySelect.value;
            const price = parseFloat(newPriceInput.value);
            const image = newImageInput.value.trim() || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600';
            const badge = newBadgeInput.value.trim();

            if (!name || isNaN(price) || price <= 0) {
                alert("Complete correctamente el nombre y el precio.");
                return;
            }

            const newProduct = { id: Date.now(), name, category, price, image, badge };
            products.push(newProduct);
            saveProducts();

            newNameInput.value = ''; newPriceInput.value = ''; newImageInput.value = ''; newBadgeInput.value = '';
            renderAdminProducts();
            renderPublicProducts();
            showToast(`"${name}" añadido con éxito.`);
        });
    }

    function renderAdminOrders() {
        const container = document.getElementById('admin-orders-container');
        if (!container) return;
        const orders = JSON.parse(localStorage.getItem('flics_orders')) || [];
        container.innerHTML = orders.map(order => `
            <div class="admin-item" style="flex-direction: column; align-items: flex-start; gap: 5px;">
                <div style="display: flex; justify-content: space-between; width: 100%; font-weight: bold;">
                    <span>${order.id} - ${order.date}</span>
                    <span style="color: var(--primary-color);">${order.payment}</span>
                </div>
                <div style="font-size: 0.9rem;">${order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}</div>
                <div style="font-weight: 700;">Total: S/ ${Number(order.total).toFixed(2)}</div>
            </div>
        `).join('') || '<p class="text-muted">No se registran pedidos.</p>';
    }

    
    // --- GENERACIÓN DE GRÁFICOS 
    
    function generarGraficosEstadisticos() {
        // Obtener pedidos  de la app para alimentar las métricas en tiempo real
        const ordenesReales = JSON.parse(localStorage.getItem('flics_orders')) || [];
        
        let totalDineroReal = 0;
        let conteoCategorias = { "Frutas & Verduras": 12, "Snacks & Dulces": 24, "Bebidas Frías": 38, "Abarrotes": 15 };

        // Sumar datos  si existen compras en el historial
        ordenesReales.forEach(ord => {
            totalDineroReal += ord.total;
            ord.items.forEach(item => {
                if(conteoCategorias[item.category] !== undefined){
                    conteoCategorias[item.category] += item.quantity;
                }
            });
        });

        //  GRAFICO 1 Productos Destacados por Categoría 
        const ctxProductos = document.getElementById('chartProductos')?.getContext('2d');
        if (ctxProductos) {
            if (instanceChartProductos) instanceChartProductos.destroy(); // Limpieza de instancia previa
            instanceChartProductos = new Chart(ctxProductos, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(conteoCategorias),
                    datasets: [{
                        label: 'Unidades Vendidas',
                        data: Object.values(conteoCategorias),
                        backgroundColor: ['#22c55e', '#ffb703', '#00b4d8', '#9d4edd'],
                        borderWidth: 1
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }

        //  GRAFICO 2 Dinero Ingresado por Mes 
        const ctxDinero = document.getElementById('chartDinero')?.getContext('2d');
        if (ctxDinero) {
            if (instanceChartDinero) instanceChartDinero.destroy();
            instanceChartDinero = new Chart(ctxDinero, {
                type: 'line',
                data: {
                    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Ingresos Mensuales (S/)',
                        data: [1200, 1450, 1900, 2400, 2100, 2800 + totalDineroReal], 
                        borderColor: '#0077b6',
                        backgroundColor: 'rgba(0, 180, 216, 0.1)',
                        fill: true,
                        tension: 0.3,
                        borderWidth: 3
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }

        //  GRAFICO 3 Embudo de Conversión de Usuarios 
        const ctxUsuarios = document.getElementById('chartUsuarios')?.getContext('2d');
        if (ctxUsuarios) {
            if (instanceChartUsuarios) instanceChartUsuarios.destroy();
            
            // total de compras reales hechas en la sesión
            const totalComprasExitosas = 42 + ordenesReales.length; 

            instanceChartUsuarios = new Chart(ctxUsuarios, {
                type: 'bar',
                data: {
                    labels: ['Usuarios que Visualizaron la Página (Visitas)', 'Usuarios con Compra Exitosa (Conversión)'],
                    datasets: [{
                        label: 'Cantidad de Usuarios',
                        data: [380, totalComprasExitosas],
                        backgroundColor: ['#3a0ca3', '#22c55e'],
                        borderRadius: 6,
                        barThickness: 50
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true } }
                }
            });
        }
    }

    
    // SISTEMA TOASTS 
    
    function showToast(message) {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.classList.add('toast');
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    renderPublicProducts();
    updateCartUi();
});