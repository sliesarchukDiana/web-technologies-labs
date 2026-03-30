'use strict';

let products = [
    { id: '1', name: 'Іграшка Беззубик 40см Як приборкати дракона Toothless', price: 799, category: 'Іграшки', image: 'img\\toothless-plush.jpg', createdAt: '2026-03-25T10:00:00.000Z', updatedAt: '2026-03-25T10:00:00.000Z' },
    { id: '2', name: 'Іграшка Милий динозавр 30см М`яка іграшка Cute Plush', price: 499, category: 'Іграшки', image: 'img\\dino-plush.jpg', createdAt: '2026-02-22T10:00:00.000Z', updatedAt: '2026-02-27T10:00:00.000Z' },
    { id: '3', name: 'Механічна клавіатура з жабками дротова USB', price: 1899, category: 'Клавіатури', image: 'img\\frogmechkeyboard.webp', createdAt: '2026-03-28T14:30:00.000Z', updatedAt: '2026-03-29T09:15:00.000Z' },
    { id: '4', name: 'Естетична механічна клавіатура USB підключення', price: 1699, category: 'Клавіатури', image: 'img\\brownkeyboard.jpg', createdAt: '2026-03-28T14:30:00.000Z', updatedAt: '2026-03-29T09:15:00.000Z' },
    { id: '5', name: 'Рожева мишка з LED підсвіткою USB Wireless mouse', price: 1399, category: 'Миші і аксесуари', image: 'img\\pinkmouse.webp', createdAt: '2026-03-30T08:00:00.000Z', updatedAt: '2026-03-30T08:00:00.000Z' },
    { id: '6', name: 'Естетичний великий коврик для миші Cute Mousepad', price: 1399, category: 'Миші і аксесуари', image: 'img\\mousepad.jpg', createdAt: '2026-03-30T08:00:00.000Z', updatedAt: '2026-03-30T08:00:00.000Z' }
];

let currentFilter = 'Всі';
let currentSort = 'default';
let editingProductId = null;

const addProduct = (list, item) => [...list, item];
const updateProduct = (list, id, data) => list.map(p => p.id === id ? { ...p, ...data } : p);
const deleteProduct = (list, id) => list.filter(p => p.id !== id);
const filterProducts = (list, cat) => cat === 'Всі' ? list : list.filter(p => p.category === cat);
const calculateTotal = (list) => list.reduce((sum, p) => sum + Number(p.price), 0);
const getCategories = (list) => ['Всі', ...new Set(list.map(p => p.category))];
const formatPrice = (price) => new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' }).format(price);

const sortProducts = (list, sortBy) => {
    const sortFns = {
        price: (a, b) => a.price - b.price,
        dateCreated: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        dateUpdated: (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    };
    return sortFns[sortBy] ? [...list].sort(sortFns[sortBy]) : list;
};

const els = {
    list: document.getElementById('product-list'),
    total: document.getElementById('total-price'),
    filters: document.getElementById('filter-container'),
    sorts: document.getElementById('sort-container'),
    modal: document.getElementById('product-modal'),
    form: document.getElementById('product-form'),
    title: document.getElementById('modal-title'),
    snackbar: document.getElementById('snackbar')
};

const createCardHTML = (p) => `
    <div class="product-card fade-in">
        <img src="${p.image}" alt="${p.name}">
        <div class="card-content">
            <small>ID: ${p.id}</small>
            <h3>${p.name}</h3>
            <p class="category">${p.category}</p>
            <p class="price">${formatPrice(p.price)}</p>
            <div class="actions">
                <button class="edit-btn" data-id="${p.id}">Редагувати</button>
                <button class="delete-btn" data-id="${p.id}">Видалити</button>
            </div>
        </div>
    </div>`;

const renderProducts = () => {
    const displayList = sortProducts(filterProducts(products, currentFilter), currentSort);

    els.list.innerHTML = displayList.length
        ? displayList.map(createCardHTML).join('')
        : '<p class="empty-message">Наразі список товарів пустий. Додайте новий товар.</p>';

    els.total.textContent = `Загальна вартість: ${formatPrice(calculateTotal(displayList))}`;
};

const renderFilters = () => {
    els.filters.innerHTML = getCategories(products).map(cat =>
        `<button class="${cat === currentFilter ? 'active' : ''}" data-category="${cat}">${cat}</button>`
    ).join('');
};

const updateUI = () => { renderFilters(); renderProducts(); };

const toggleModal = (product = null) => {
    els.form.reset();
    editingProductId = product ? product.id : null;
    els.title.textContent = product ? 'Редагувати товар' : 'Додати новий товар';

    els.form.image.required = !product;
    els.form.image.placeholder = product ? '(залиште пустим для старого фото)' : 'https://...';

    if (product) {
        ['name', 'price', 'category'].forEach(key => els.form[key].value = product[key]);
    }
    els.modal.classList.toggle('show');
};

const showSnackbar = (msg) => {
    els.snackbar.textContent = msg;
    els.snackbar.classList.add('show');
    setTimeout(() => els.snackbar.classList.remove('show'), 3000);
};

els.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const { name, price, category, image } = els.form;

    const formData = {
        name: name.value,
        price: Number(price.value),
        category: category.value,
        image: image.value.trim() || (editingProductId ? products.find(p => p.id === editingProductId).image : '')
    };

    if (editingProductId) {
        products = updateProduct(products, editingProductId, { ...formData, updatedAt: now });
        showSnackbar(`Успішно оновлено: ${formData.name}`);
    } else {
        products = addProduct(products, { id: Date.now().toString(), ...formData, createdAt: now, updatedAt: now });
        showSnackbar('Товар успішно додано!');
    }

    updateUI();
    toggleModal();
});

els.list.addEventListener('click', (e) => {
    const id = e.target.dataset.id;
    if (e.target.classList.contains('delete-btn')) {
        products = deleteProduct(products, id);
        updateUI();
        showSnackbar('Товар успішно видалено зі списку');
    }
    if (e.target.classList.contains('edit-btn')) {
        toggleModal(products.find(p => p.id === id));
    }
});

els.filters.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        currentFilter = e.target.dataset.category;
        updateUI();
    }
});

els.sorts.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        currentSort = e.target.dataset.sort;
        renderProducts();
    }
});

document.getElementById('reset-filter-btn').addEventListener('click', () => { currentFilter = 'Всі'; updateUI(); });
document.getElementById('reset-sort-btn').addEventListener('click', () => { currentSort = 'default'; renderProducts(); });
document.getElementById('open-modal-btn').addEventListener('click', () => toggleModal());
document.getElementById('close-modal-btn').addEventListener('click', () => toggleModal());
window.addEventListener('click', (e) => e.target === els.modal && toggleModal());

// Ініціалізація
document.addEventListener('DOMContentLoaded', updateUI);