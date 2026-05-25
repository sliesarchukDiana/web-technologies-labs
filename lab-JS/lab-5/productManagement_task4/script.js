class StoreInventory {
    constructor() {
        this.catalog = new Map();
        this.orders = new Set();
        this.productHistory = new WeakMap();
        this.activeCustomers = new WeakSet();
        this.nextProductId = 1;
    }

    addProduct(name, price, stock) {
        const id = this.nextProductId++;
        const product = { id, name, price, stock };

        this.catalog.set(id, product);
        this.productHistory.set(product, [{ action: 'created', timestamp: new Date() }]);

        return product;
    }

    removeProduct(id) {
        return this.catalog.delete(id);
    }

    updateProduct(id, newPrice, newStock) {
        const product = this.catalog.get(id);

        if (!product) {
            return false;
        }

        if (newPrice !== undefined) product.price = newPrice;
        if (newStock !== undefined) product.stock = newStock;

        const history = this.productHistory.get(product);
        history.push({ action: 'updated', price: product.price, stock: product.stock, timestamp: new Date() });

        return product;
    }

    searchProductByName(name) {
        const results = [];
        const searchName = name.toLowerCase();

        for (const product of this.catalog.values()) {
            if (product.name.toLowerCase().includes(searchName)) {
                results.push(product);
            }
        }

        return results;
    }

    placeOrder(customer, orderItems) {
        this.activeCustomers.add(customer);

        for (const item of orderItems) {
            const product = this.catalog.get(item.productId);
            if (!product || product.stock < item.quantity) {
                return null;
            }
        }

        const newOrder = {
            customerId: customer.id,
            items: [],
            timestamp: new Date()
        };

        for (const item of orderItems) {
            const product = this.catalog.get(item.productId);
            product.stock -= item.quantity;

            newOrder.items.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: item.quantity
            });

            const history = this.productHistory.get(product);
            history.push({ action: 'ordered', quantity: item.quantity, stockLeft: product.stock, timestamp: new Date() });
        }

        this.orders.add(newOrder);
        return newOrder;
    }

    getProductHistory(id) {
        const product = this.catalog.get(id);
        if (!product) {
            return null;
        }
        return this.productHistory.get(product);
    }

    getAllOrders() {
        return Array.from(this.orders);
    }
}

const store = new StoreInventory();

const elements = {
    addBtn: document.getElementById('btn-add-product'),
    orderBtn: document.getElementById('btn-place-order'),
    catalogGrid: document.getElementById('catalog-grid'),
    productSelect: document.getElementById('order-product-select'),
    logContainer: document.getElementById('system-log')
};

function logMessage(msg, type = 'info') {
    const time = new Date().toLocaleTimeString();
    const logEl = document.createElement('div');
    logEl.className = `log-entry ${type}`;
    logEl.textContent = `[${time}] ${msg}`;
    elements.logContainer.prepend(logEl);
}

function updateUI() {
    elements.catalogGrid.innerHTML = '';
    elements.productSelect.innerHTML = '<option value="">Select Product...</option>';

    store.catalog.forEach((product, id) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'product-item';
        itemEl.innerHTML = `
            <div class="product-info">
                <span class="product-name">${product.name}</span>
                <span class="product-meta">ID: ${id} | Stock: ${product.stock}</span>
            </div>
            <span class="product-price">$${product.price}</span>
        `;
        elements.catalogGrid.appendChild(itemEl);

        if (product.stock > 0) {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = `${product.name} ($${product.price})`;
            elements.productSelect.appendChild(option);
        }
    });
}

elements.addBtn.addEventListener('click', () => {
    const name = document.getElementById('prod-name').value;
    const price = parseFloat(document.getElementById('prod-price').value);
    const stock = parseInt(document.getElementById('prod-stock').value);

    if (!name || isNaN(price) || isNaN(stock)) {
        logMessage('Failed: Invalid product data.', 'error');
        return;
    }

    const newProduct = store.addProduct(name, price, stock);
    logMessage(`Added: ${newProduct.name} to Map. History init in WeakMap.`, 'success');

    document.getElementById('prod-name').value = '';
    document.getElementById('prod-price').value = '';
    document.getElementById('prod-stock').value = '';

    updateUI();
});

elements.orderBtn.addEventListener('click', () => {
    const customerName = document.getElementById('customer-name').value;
    const productId = parseInt(elements.productSelect.value);
    const qty = parseInt(document.getElementById('order-qty').value);

    if (!customerName || isNaN(productId) || isNaN(qty) || qty <= 0) {
        logMessage('Failed: Check order inputs.', 'error');
        return;
    }

    const customer = { id: Date.now(), name: customerName };
    const orderItems = [{ productId, quantity: qty }];

    const result = store.placeOrder(customer, orderItems);

    if (result) {
        logMessage(`Order Success: ${qty}x ID ${productId}. Added to Orders Set & ActiveCustomers WeakSet.`, 'success');
        document.getElementById('customer-name').value = '';
        document.getElementById('order-qty').value = '';
        updateUI();
    } else {
        logMessage('Order Failed: Out of stock or invalid item.', 'error');
    }
});

store.addProduct('Neon Keyboard', 120, 15);
store.addProduct('Dark Mouse', 60, 30);
store.addProduct('Ultra Monitor', 450, 5);
logMessage('System Initialized. Dummy data loaded.', 'info');
updateUI();