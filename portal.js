(function() {
    const defaultBooks = [
        { id: 1, title: "O Livro dos Espíritos", author: "Allan Kardec", category: "Codificação", status: "Disponível" },
        { id: 2, title: "O Evangelho segundo o Espiritismo", author: "Allan Kardec", category: "Codificação", status: "Disponível" },
        { id: 3, title: "O Livro dos Médiuns", author: "Allan Kardec", category: "Codificação", status: "Disponível" },
        { id: 4, title: "Nosso Lar", author: "Chico Xavier / André Luiz", category: "Literatura Geral", status: "Disponível" },
        { id: 5, title: "E a Vida Continua...", author: "Chico Xavier / André Luiz", category: "Literatura Geral", status: "Disponível" },
        { id: 6, title: "Missionários da Luz", author: "Chico Xavier / André Luiz", category: "Mediunidade", status: "Disponível" },
        { id: 7, title: "Memórias de um Suicida", author: "Yvonne A. Pereira / Camilo C. Branco", category: "Literatura Geral", status: "Disponível" },
        { id: 8, title: "Voltei", author: "Chico Xavier / Irmão Jacob", category: "Literatura Geral", status: "Disponível" }
    ];

    const defaultProducts = [
        { id: 1, title: "Camiseta de Algodão Masculina", category: "Roupas", price: 15.00, stock: 5, emoji: "👕" },
        { id: 2, title: "Calça Jeans Feminina", category: "Roupas", price: 25.00, stock: 3, emoji: "👖" },
        { id: 3, title: "Vestido Floral de Verão", category: "Roupas", price: 30.00, stock: 2, emoji: "👗" },
        { id: 4, title: "Tênis Esportivo Unisex", category: "Calçados", price: 35.00, stock: 4, emoji: "👟" },
        { id: 5, title: "Sapato Social Masculino", category: "Calçados", price: 40.00, stock: 2, emoji: "👞" },
        { id: 6, title: "Casaco de Lã Feminino", category: "Roupas", price: 45.00, stock: 2, emoji: "🧥" },
        { id: 7, title: "Bolsa de Couro Marrom", category: "Acessórios", price: 20.00, stock: 3, emoji: "👜" },
        { id: 8, title: "Óculos de Sol Clássico", category: "Acessórios", price: 15.00, stock: 6, emoji: "🕶️" }
    ];

    let books = JSON.parse(localStorage.getItem("neee_books")) || defaultBooks;
    let products = JSON.parse(localStorage.getItem("neee_products")) || defaultProducts;
    let conversas = JSON.parse(localStorage.getItem("neee_conversas")) || [];
    let voluntarios = JSON.parse(localStorage.getItem("neee_voluntarios")) || [];
    let reservas = JSON.parse(localStorage.getItem("neee_reservas")) || [];
    let cart = [];

    function saveState() {
        localStorage.setItem("neee_books", JSON.stringify(books));
        localStorage.setItem("neee_products", JSON.stringify(products));
        localStorage.setItem("neee_conversas", JSON.stringify(conversas));
        localStorage.setItem("neee_voluntarios", JSON.stringify(voluntarios));
        localStorage.setItem("neee_reservas", JSON.stringify(reservas));
        updateStats();
    }

    const tabButtons = document.querySelectorAll(".nav-tab-btn");
    const tabContents = document.querySelectorAll(".portal-tab-content");
    const sidebar = document.querySelector(".portal-sidebar");
    const sidebarToggle = document.getElementById("sidebar-toggle-btn");

    function switchTab(tabId) {
        tabButtons.forEach(btn => {
            if (btn.getAttribute("data-tab") === tabId) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });

        tabContents.forEach(content => {
            if (content.id === `tab-${tabId}`) {
                content.classList.add("active");
            } else {
                content.classList.remove("active");
            }
        });

        if (sidebar.classList.contains("active")) {
            sidebar.classList.remove("active");
        }

        if (tabId === "breshopping") {
            renderCatalog();
            renderCart();
        } else if (tabId === "biblioteca") {
            renderBooks();
        } else if (tabId === "agendamento") {
            renderConversas();
            renderVoluntarios();
        } else if (tabId === "dashboard") {
            renderDashboardReservations();
        }
    }

    window.switchTab = switchTab;

    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            switchTab(btn.getAttribute("data-tab"));
        });
    });

    if (sidebarToggle) {
        sidebarToggle.addEventListener("click", () => {
            sidebar.classList.toggle("active");
        });
    }

    function updateStats() {
        const countBooksEl = document.getElementById("count-books");
        const countItemsEl = document.getElementById("count-items");
        const countVolunteersEl = document.getElementById("count-volunteers");

        if (countBooksEl) countBooksEl.textContent = books.length;
        if (countItemsEl) countItemsEl.textContent = products.reduce((acc, p) => acc + p.stock, 0);
        if (countVolunteersEl) countVolunteersEl.textContent = voluntarios.length;
    }

    function renderDashboardReservations() {
        const summaryContainer = document.getElementById("my-reservations-summary");
        if (!summaryContainer) return;

        if (reservas.length === 0) {
            summaryContainer.innerHTML = `
                <p>Você não possui reservas pendentes.</p>
                <button class="btn btn-primary btn-sm mt-2" onclick="switchTab('biblioteca')">Reservar Livro</button>
            `;
            return;
        }

        let html = '<ul class="activity-timeline" style="margin-top: 10px; gap: 12px;">';
        reservas.forEach(res => {
            const book = books.find(b => b.id === res.bookId);
            const bookTitle = book ? book.title : "Livro Desconhecido";
            html += `
                <li style="justify-content: space-between; border-bottom: 1px solid #E5E7EB; padding-bottom: 10px;">
                    <div>
                        <h5 style="margin: 0; font-size: 0.9rem;">${bookTitle}</h5>
                        <p style="margin: 2px 0 0 0; font-size: 0.75rem; color: #666;">Leitor: ${res.readerName} | Tel: ${res.readerPhone}</p>
                    </div>
                    <button class="btn-reserve-book" style="background-color: #F44336; padding: 4px 8px; font-size: 0.75rem;" onclick="cancelReservation(${res.id})">Cancelar</button>
                </li>
            `;
        });
        html += '</ul>';
        summaryContainer.innerHTML = html;
    }

    window.cancelReservation = function(resId) {
        const resIndex = reservas.findIndex(r => r.id === resId);
        if (resIndex !== -1) {
            const res = reservas[resIndex];
            const bookIndex = books.findIndex(b => b.id === res.bookId);
            if (bookIndex !== -1) {
                books[bookIndex].status = "Disponível";
            }
            reservas.splice(resIndex, 1);
            saveState();
            renderDashboardReservations();
            renderBooks();
        }
    };

    const searchProductInput = document.getElementById("search-product");
    const filterCategorySelect = document.getElementById("filter-category");

    if (searchProductInput) {
        searchProductInput.addEventListener("input", renderCatalog);
    }
    if (filterCategorySelect) {
        filterCategorySelect.addEventListener("change", renderCatalog);
    }

    function renderCatalog() {
        const container = document.getElementById("products-grid-container");
        if (!container) return;

        const query = searchProductInput ? searchProductInput.value.toLowerCase() : "";
        const category = filterCategorySelect ? filterCategorySelect.value : "all";

        container.innerHTML = "";

        const filtered = products.filter(p => {
            const matchesQuery = p.title.toLowerCase().includes(query);
            const matchesCategory = category === "all" || p.category === category;
            return matchesQuery && matchesCategory;
        });

        if (filtered.length === 0) {
            container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #888; padding: 40px;">Nenhum produto encontrado.</div>`;
            return;
        }

        filtered.forEach(product => {
            const card = document.createElement("div");
            card.className = "product-card";
            card.innerHTML = `
                <div class="prod-img-box">
                    ${product.emoji}
                    <span class="prod-stock-badge">${product.stock > 0 ? `Estoque: ${product.stock}` : 'Esgotado'}</span>
                </div>
                <div class="prod-info">
                    <span class="prod-category">${product.category}</span>
                    <h4 class="prod-title">${product.title}</h4>
                    <span class="prod-price">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
                    <button class="btn-add-cart" ${product.stock > 0 ? "" : "disabled"} onclick="addToCart(${product.id})">
                        ${product.stock > 0 ? "Adicionar" : "Esgotado"}
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    }

    window.addToCart = function(productId) {
        const prod = products.find(p => p.id === productId);
        if (!prod || prod.stock <= 0) return;

        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            if (cartItem.qty < prod.stock) {
                cartItem.qty++;
            } else {
                alert("Quantidade máxima disponível em estoque atingida.");
            }
        } else {
            cart.push({
                id: prod.id,
                title: prod.title,
                price: prod.price,
                qty: 1
            });
        }
        renderCart();
    };

    window.updateCartQty = function(productId, change) {
        const itemIndex = cart.findIndex(item => item.id === productId);
        if (itemIndex === -1) return;

        const prod = products.find(p => p.id === productId);
        if (!prod) return;

        cart[itemIndex].qty += change;

        if (cart[itemIndex].qty <= 0) {
            cart.splice(itemIndex, 1);
        } else if (cart[itemIndex].qty > prod.stock) {
            cart[itemIndex].qty = prod.stock;
            alert("Quantidade máxima disponível em estoque atingida.");
        }

        renderCart();
    };

    const applyDiscountCb = document.getElementById("apply-discount");
    if (applyDiscountCb) {
        applyDiscountCb.addEventListener("change", renderCart);
    }

    function renderCart() {
        const container = document.getElementById("cart-items-container");
        if (!container) return;

        container.innerHTML = "";

        if (cart.length === 0) {
            container.innerHTML = `
                <div class="empty-cart-state">
                    <p>Sua sacola está vazia.</p>
                    <span>Selecione produtos no catálogo à esquerda.</span>
                </div>
            `;
            updateCartTotals(0, 0);
            return;
        }

        cart.forEach(item => {
            const div = document.createElement("div");
            div.className = "cart-item";
            div.innerHTML = `
                <div class="cart-item-detail">
                    <span class="cart-item-title">${item.title}</span>
                    <span class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
                </div>
                <div class="cart-item-qty-control">
                    <button class="qty-btn" onclick="updateCartQty(${item.id}, -1)">-</button>
                    <span class="qty-val">${item.qty}</span>
                    <button class="qty-btn" onclick="updateCartQty(${item.id}, 1)">+</button>
                </div>
            `;
            container.appendChild(div);
        });

        const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
        const hasDiscount = applyDiscountCb && applyDiscountCb.checked;
        const discount = hasDiscount ? (subtotal * 0.1) : 0;

        updateCartTotals(subtotal, discount);
    }

    function updateCartTotals(subtotal, discount) {
        const subtotalEl = document.getElementById("cart-subtotal");
        const totalEl = document.getElementById("cart-total");

        if (subtotalEl) subtotalEl.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        if (totalEl) totalEl.textContent = `R$ ${(subtotal - discount).toFixed(2).replace('.', ',')}`;
    }

    const btnCheckout = document.getElementById("btn-checkout");
    if (btnCheckout) {
        btnCheckout.addEventListener("click", checkout);
    }

    function checkout() {
        if (cart.length === 0) {
            alert("Adicione itens na sua sacola antes de finalizar.");
            return;
        }

        cart.forEach(item => {
            const pIndex = products.findIndex(p => p.id === item.id);
            if (pIndex !== -1) {
                products[pIndex].stock = Math.max(0, products[pIndex].stock - item.qty);
            }
        });

        const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
        const hasDiscount = applyDiscountCb && applyDiscountCb.checked;
        const discount = hasDiscount ? (subtotal * 0.1) : 0;
        const total = subtotal - discount;

        showReceipt(subtotal, discount, total);

        cart = [];
        if (applyDiscountCb) applyDiscountCb.checked = false;

        saveState();
        renderCatalog();
        renderCart();
    }

    const receiptModal = document.getElementById("receipt-modal");
    const receiptCloseBtn = document.getElementById("receipt-modal-close-btn");

    if (receiptCloseBtn) {
        receiptCloseBtn.addEventListener("click", () => {
            receiptModal.classList.remove("active");
        });
    }

    function showReceipt(subtotal, discount, total) {
        const dateEl = document.getElementById("receipt-date");
        const idEl = document.getElementById("receipt-id");
        const listEl = document.getElementById("receipt-items-list");
        const subtotalEl = document.getElementById("receipt-subtotal");
        const discountEl = document.getElementById("receipt-discount");
        const totalEl = document.getElementById("receipt-total");

        if (dateEl) {
            const today = new Date();
            dateEl.textContent = today.toLocaleDateString("pt-BR") + " " + today.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });
        }

        if (idEl) {
            idEl.textContent = "#" + Math.floor(1000 + Math.random() * 9000);
        }

        if (listEl) {
            listEl.innerHTML = "";
            cart.forEach(item => {
                const row = document.createElement("div");
                row.className = "receipt-item-row";
                row.innerHTML = `
                    <span>${item.qty}x ${item.title.substring(0, 18)}...</span>
                    <span>R$ ${(item.price * item.qty).toFixed(2).replace('.', ',')}</span>
                `;
                listEl.appendChild(row);
            });
        }

        if (subtotalEl) subtotalEl.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        if (discountEl) discountEl.textContent = `R$ ${discount.toFixed(2).replace('.', ',')}`;
        if (totalEl) totalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;

        if (receiptModal) {
            receiptModal.classList.add("active");
        }
    }

    window.printReceipt = function() {
        const printContent = document.getElementById("receipt-print-area").innerHTML;
        const originalContent = document.body.innerHTML;
        
        const style = document.createElement("style");
        style.innerHTML = `
            @media print {
                body * { visibility: hidden; }
                #print-section, #print-section * { visibility: visible; }
                #print-section {
                    position: absolute;
                    left: 0; top: 0; width: 100%;
                    font-family: monospace;
                    background: white;
                    padding: 20px;
                }
            }
        `;
        document.head.appendChild(style);

        const printDiv = document.createElement("div");
        printDiv.id = "print-section";
        printDiv.innerHTML = printContent;
        document.body.appendChild(printDiv);

        window.print();

        document.body.removeChild(printDiv);
        document.head.removeChild(style);
    };

    const searchBookInput = document.getElementById("search-book");
    if (searchBookInput) {
        searchBookInput.addEventListener("input", renderBooks);
    }

    function renderBooks() {
        const tbody = document.getElementById("books-table-body");
        if (!tbody) return;

        const query = searchBookInput ? searchBookInput.value.toLowerCase() : "";
        tbody.innerHTML = "";

        const filtered = books.filter(b => {
            return b.title.toLowerCase().includes(query) || b.author.toLowerCase().includes(query);
        });

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #888; padding: 20px;">Nenhum livro encontrado.</td></tr>`;
            return;
        }

        filtered.forEach(book => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${book.title}</strong></td>
                <td>${book.author}</td>
                <td>${book.category}</td>
                <td>
                    <span class="badge ${book.status === 'Disponível' ? 'badge-green' : 'badge-red'}">
                        ${book.status}
                    </span>
                </td>
                <td>
                    <button class="btn-reserve-book" ${book.status === 'Disponível' ? "" : "disabled"} onclick="openReserveModal(${book.id})">
                        ${book.status === 'Disponível' ? 'Reservar' : 'Reservado'}
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    const bookModal = document.getElementById("book-modal");
    const bookModalCloseBtn = document.getElementById("modal-close-btn");
    const formBookReserve = document.getElementById("form-book-reserve");

    if (bookModalCloseBtn) {
        bookModalCloseBtn.addEventListener("click", closeReserveModal);
    }

    function openReserveModal(bookId) {
        const book = books.find(b => b.id === bookId);
        if (!book || book.status !== "Disponível") return;

        const titleEl = document.getElementById("modal-book-title");
        const idEl = document.getElementById("modal-book-id");

        if (titleEl) titleEl.textContent = book.title;
        if (idEl) idEl.value = book.id;

        if (bookModal) {
            bookModal.classList.add("active");
        }
    }

    window.openReserveModal = openReserveModal;

    function closeReserveModal() {
        if (bookModal) {
            bookModal.classList.remove("active");
        }
        if (formBookReserve) {
            formBookReserve.reset();
        }
    }

    if (formBookReserve) {
        formBookReserve.addEventListener("submit", function(e) {
            e.preventDefault();
            const bookId = parseInt(document.getElementById("modal-book-id").value);
            const readerName = document.getElementById("reserve-name").value;
            const readerPhone = document.getElementById("reserve-phone").value;

            const bookIndex = books.findIndex(b => b.id === bookId);
            if (bookIndex !== -1 && books[bookIndex].status === "Disponível") {
                books[bookIndex].status = "Reservado";

                reservas.push({
                    id: Date.now(),
                    bookId: bookId,
                    readerName: readerName,
                    readerPhone: readerPhone,
                    date: new Date().toLocaleDateString("pt-BR")
                });

                saveState();
                renderBooks();
                closeReserveModal();
                alert("Reserva realizada com sucesso!");
            }
        });
    }

    const formConversa = document.getElementById("form-conversa-fraterna");
    if (formConversa) {
        formConversa.addEventListener("submit", function(e) {
            e.preventDefault();
            const name = document.getElementById("cf-name").value;
            const phone = document.getElementById("cf-phone").value;
            const dateVal = document.getElementById("cf-date").value;

            if (!dateVal) return;

            const dateParts = dateVal.split("-");
            const selectedDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
            
            const today = new Date();
            today.setHours(0,0,0,0);

            if (selectedDate < today) {
                alert("Selecione uma data no presente ou futuro.");
                return;
            }

            if (selectedDate.getDay() !== 2) {
                alert("O Acolhimento Fraterno é realizado apenas às terças-feiras. Por favor, escolha uma data que caia em uma terça-feira.");
                return;
            }

            conversas.push({
                id: Date.now(),
                name: name,
                phone: phone,
                date: selectedDate.toLocaleDateString("pt-BR")
            });

            saveState();
            formConversa.reset();
            renderConversas();
            alert("Agendamento de Conversa Fraterna solicitado com sucesso!");
        });
    }

    function renderConversas() {
        const container = document.getElementById("list-conversas");
        if (!container) return;

        if (conversas.length === 0) {
            container.innerHTML = '<p class="empty-list-txt">Nenhuma conversa agendada para hoje.</p>';
            return;
        }

        container.innerHTML = "";
        conversas.forEach(c => {
            const div = document.createElement("div");
            div.className = "registered-item";
            div.innerHTML = `
                <div class="reg-info">
                    <h5>${c.name}</h5>
                    <p>Telefone: ${c.phone} | Terça: ${c.date}</p>
                </div>
                <button class="btn btn-outline-dark btn-sm" onclick="cancelConversa(${c.id})" style="border: 1px solid #D1D5DB; background: transparent; padding: 6px 12px; cursor: pointer; border-radius: 4px; font-size: 0.8rem;">Cancelar</button>
            `;
            container.appendChild(div);
        });
    }

    window.cancelConversa = function(id) {
        conversas = conversas.filter(c => c.id !== id);
        saveState();
        renderConversas();
    };

    const formVoluntariado = document.getElementById("form-voluntariado");
    if (formVoluntariado) {
        formVoluntariado.addEventListener("submit", function(e) {
            e.preventDefault();
            const name = document.getElementById("v-name").value;
            const role = document.getElementById("v-role").value;
            const availability = document.getElementById("v-availability").value;

            voluntarios.push({
                id: Date.now(),
                name: name,
                role: role,
                availability: availability
            });

            saveState();
            formVoluntariado.reset();
            renderVoluntarios();
            alert("Candidatura cadastrada com sucesso!");
        });
    }

    function renderVoluntarios() {
        const container = document.getElementById("list-voluntarios");
        if (!container) return;

        if (voluntarios.length === 0) {
            container.innerHTML = '<p class="empty-list-txt">Nenhum voluntário registrado ainda.</p>';
            return;
        }

        container.innerHTML = "";
        voluntarios.forEach(v => {
            const div = document.createElement("div");
            div.className = "registered-item";
            div.innerHTML = `
                <div class="reg-info">
                    <h5>${v.name}</h5>
                    <p>Disponibilidade: ${v.availability}</p>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span class="reg-badge">${v.role}</span>
                    <button onclick="removeVolunteer(${v.id})" style="border: 1px solid #D1D5DB; background: transparent; color: #666; font-size: 1.1rem; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 50%;">&times;</button>
                </div>
            `;
            container.appendChild(div);
        });
    }

    window.removeVolunteer = function(id) {
        voluntarios = voluntarios.filter(v => v.id !== id);
        saveState();
        renderVoluntarios();
    };

    updateStats();
    renderDashboardReservations();
    renderCatalog();
    renderCart();
    renderBooks();
    renderConversas();
    renderVoluntarios();
})();
