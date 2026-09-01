const menuItems = {
    lanches: [
        {
            id: 1,
            name: "Pastel Tradicional",
            description: "Frango/Misto/Carne/Queijo/Presunto/Sabor Pizza",
            price: 5.00,
            image: "./img/Pasteis/pasteltradiicona.jpg"
        },
        {
            id: 2,
            name: "Pastel no Capricho",
            description: "Frango com queijo/Frango com Carne/Frango com Requeijão/Carne com Queijo/Carne com Requeijão/Queijo duplo",
            price: 7.00,
            image: "./img/Pasteis/pastelnocaprichop.jpg"
        },
        {
            id: 3,
            name: "Mistão",
            description: "Frango, Carne, Queijo, Presunto, Requeijão",
            price: 10.00,
            image: "./img/Pasteis/pastelmistao.jpg",
            popular: true
        },
        {
            id: 4,
            name: "Batata Frita",
            description: "Porção de batata frita crocante",
            price: 17.00,
            image: "./img/Pasteis/batatatfrita.jpg"
        },
        {
            id: 5,
            name: "Batata com Calabresa",
            description: "Batata frita com calabresa fatiada",
            price: 23.00,
            image: "./img/Pasteis/calabresacombatata.jpg"
        },
        {
            id: 6,
            name: "Batata com Bacon e Cheddar",
            description: "Batata frita com bacon crocante e cheddar derretido",
            price: 28.00,
            image: "./img/Pasteis/batatacombacon echedar.jpg",
            popular: true
        }
    ],
    bar: [
        {
            id: 7,
            name: "Bisteca Suína",
            description: "Acompanha arroz e farofa",
            price: 25.00,
            image: "./img/Almoco/bistecasuina.jpg"
        },
        {
            id: 8,
            name: "Cará Frito",
            description: "Acompanha arroz ou baião, batata frita e farofa",
            price: 22.00,
            image: "./img/Almoco/carafrito.jpg"
        },
        {
            id: 9,
            name: "Galinha Caipira",
            description: "Acompanha arroz ou baião, batata frita e pirão",
            price: 28.00,
            image: "./img/Almoco/galinhacaipira.jpg"
        },
        {
            id: 10,
            name: "Feijoada Rainha",
            description: "Acompanha calabresa, feijão preto, arroz, couve, farofa",
            price: 38.00,
            image: "./img/Almoco/feijioada.jpg",
            popular: true
        }
    ],
    bebidas: [
        {
            id: 11,
            name: "Itaipava Lata",
            description: "Cerveja Itaipava 350ml",
            price: 4.50,
            image: "./img/Bebidas/itaiopava.jpg"
        },
        {
            id: 12,
            name: "Skol Lata",
            description: "Cerveja Skol 350ml",
            price: 4.50,
            image: "./img/Bebidas/scol.jpg"
        },
        {
            id: 13,
            name: "Heineken 330ml",
            description: "Cerveja Heineken garrafa 330ml",
            price: 8.00,
            image: "./img/Bebidas/heinike.jpg"
        },
        {
            id: 14,
            name: "Itaipava 600ml",
            description: "Cerveja Itaipava garrafa 600ml",
            price: 7.00,
            image: "./img/Bebidas/itaipava600.jpg"
        },
        {
            id: 15,
            name: "Coca-Cola 2L",
            description: "Refrigerante Coca-Cola 2 litros",
            price: 10.00,
            image: "./img/Bebidas/coca.png"
        },
        {
            id: 16,
            name: "Fanta 2L",
            description: "Refrigerante Fanta 2 litros",
            price: 9.00,
            image: "./img/Bebidas/fanta.png"
        }
    ]
};

let cart = [];
let currentCategory = 'lanches';

const menuItemsContainer = document.getElementById('menu-items');
const cartItemsContainer = document.getElementById('cart-items');
const cartCountElement = document.getElementById('cart-count');
const totalPriceElement = document.getElementById('total-price');
const checkoutBtn = document.getElementById('checkout-btn');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabIndicator = document.getElementById('tab-indicator');
const navLinks = document.querySelectorAll('[data-nav]');
const sections = document.querySelectorAll('.section');
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');

function formatPrice(value) {
    return value.toFixed(2).replace('.', ',');
}

function moveTabIndicator(button) {
    if (!tabIndicator || !button) return;
    tabIndicator.style.left = button.offsetLeft + 'px';
    tabIndicator.style.width = button.offsetWidth + 'px';
}

function renderMenuItems(category) {
    if (!menuItemsContainer) return;

    menuItemsContainer.innerHTML = '';

    menuItems[category].forEach(item => {
        const el = document.createElement('div');
        el.classList.add('menu-item');

        el.innerHTML = `
            <div class="menu-item-media">
                <img src="${item.image}" alt="${item.name}">
                ${item.popular ? '<span class="badge-popular">Mais pedido</span>' : ''}
                <span class="price-tag">R$ ${formatPrice(item.price)}</span>
            </div>
            <div class="menu-item-content">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <button class="add-to-cart" data-id="${item.id}">
                    <i class="fas fa-plus"></i> Adicionar
                </button>
            </div>
        `;

        menuItemsContainer.appendChild(el);
    });

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

function findItemById(itemId) {
    for (const category in menuItems) {
        const found = menuItems[category].find(i => i.id === itemId);
        if (found) return found;
    }
    return null;
}

function addToCart(e) {
    const button = e.currentTarget;
    const itemId = parseInt(button.getAttribute('data-id'));
    const item = findItemById(itemId);
    if (!item) return;

    const existingItem = cart.find(i => i.id === item.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    updateCart();
    showToast(`${item.name} adicionado à comanda!`);
}

function removeFromCart(itemId) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return;

    if (cart[itemIndex].quantity > 1) {
        cart[itemIndex].quantity -= 1;
    } else {
        cart.splice(itemIndex, 1);
    }

    updateCart();
}

function updateCart() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    if (cartCountElement) {
        cartCountElement.textContent = totalItems.toString();
        cartCountElement.classList.remove('bump');
        void cartCountElement.offsetWidth;
        cartCountElement.classList.add('bump');
    }

    if (!cartItemsContainer || !checkoutBtn || !totalPriceElement) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Sua comanda está vazia. Bora escolher um pastel?</p>';
        checkoutBtn.disabled = true;
    } else {
        cartItemsContainer.innerHTML = '';

        cart.forEach(item => {
            const el = document.createElement('div');
            el.classList.add('cart-item');

            el.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>R$ ${formatPrice(item.price)} x ${item.quantity}</p>
                </div>
                <div class="cart-item-actions">
                    <button class="remove-item" data-id="${item.id}" aria-label="Remover uma unidade">-</button>
                    <span>${item.quantity}</span>
                    <button class="add-item" data-id="${item.id}" aria-label="Adicionar uma unidade">+</button>
                </div>
            `;

            cartItemsContainer.appendChild(el);
        });

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                removeFromCart(parseInt(e.currentTarget.getAttribute('data-id')));
            });
        });

        document.querySelectorAll('.add-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemId = parseInt(e.currentTarget.getAttribute('data-id'));
                const item = cart.find(i => i.id === itemId);
                if (item) {
                    item.quantity += 1;
                    updateCart();
                }
            });
        });

        checkoutBtn.disabled = false;
    }

    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    totalPriceElement.textContent = formatPrice(totalPrice);
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-out');
        setTimeout(() => toast.remove(), 400);
    }, 2600);
}

function goToSection(target) {
    navLinks.forEach(l => l.classList.remove('active'));
    document.querySelectorAll(`[data-nav="${target}"]`).forEach(l => l.classList.add('active'));

    sections.forEach(section => {
        section.classList.toggle('active', section.id === target);
    });

    if (target === 'cardapio') {
        const activeTab = document.querySelector('.tab-btn.active');
        if (activeTab) moveTabIndicator(activeTab);
    }

    if (mainNav) {
        mainNav.classList.remove('open');
        navToggle?.setAttribute('aria-expanded', 'false');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        moveTabIndicator(button);

        currentCategory = button.getAttribute('data-category') || 'lanches';
        renderMenuItems(currentCategory);
    });
});

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        goToSection(link.getAttribute('data-nav'));
    });
});

if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
        const isOpen = mainNav.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', isOpen.toString());
    });
}

if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) return;

        let message = `Olá, gostaria de fazer um pedido:\n\n`;
        message += `*Itens:*\n`;

        cart.forEach(item => {
            message += `- ${item.name} (${item.quantity}x) - R$ ${formatPrice(item.price * item.quantity)}\n`;
        });

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        message += `\n*Total: R$ ${formatPrice(total)}*`;
        message += `\n\nNome: [Digite seu nome aqui]`;
        message += `\nEndereço: [Digite seu endereço aqui]`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/5585999999999?text=${encodedMessage}`, '_blank');
    });
}

window.addEventListener('resize', () => {
    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab) moveTabIndicator(activeTab);
});

document.addEventListener('DOMContentLoaded', () => {
    renderMenuItems(currentCategory);
    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab) moveTabIndicator(activeTab);
});
