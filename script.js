/* ==========================================================================
   EFC GAMING SHOP - PREMIUM ARCHITECTURE JAVASCRIPT
   ========================================================================== */

// 1. STATİK ÜRÜN VERİLERİ VERİTABANI (ORİJİNAL ÜRÜNLER + YÜKSEK KALİTELİ KATEGORİSAYAL VERİLER)
const DEFAULT_PRODUCTS = [
    {
        id: "efc-black-jersey-2026",
        title: "EFC Gaming Black Jersey 2026",
        category: "Formalar",
        oldPrice: 1999.00,
        currentPrice: 1699.15,
        primaryImage: "./resimler/forma1.png",
        hoverImage: "./resimler/forma1.png",
        description: "Büyük sahnelerin resmi espor forması siyah fırtına edisyonu. Aerodinamik mikro-gözenekli hava alan espor kumaş teknolojisi ile donatılmıştır.",
        specs: ["%100 Premium Polyester Mikrofiber", "Terletmeyen Anti-Bakteriyel Dokuma", "EFC Gaming Orijinal Hologram Etiketli", "Sürtünmeye Dayanıklı Dijital Baskı"]
    },
    {
        id: "efc-mint-jersey-2026",
        title: "EFC Gaming Mint Jersey 2026",
        category: "Formalar",
        oldPrice: 1999.00,
        currentPrice: 1699.15,
        primaryImage: "./resimler/forma2.png",
        hoverImage: "./resimler/forma2.png",
        description: "Özel Sezon Mint Yeşili Oyuncu Forması. Sınırlı üretim espor serisi. Sahne ışıklarında parlamak isteyen espor tutkunları için optimize edilmiştir.",
        specs: ["Regular Fit Rahat Kesim", "Esnek Likra Alaşımlı Kol Manşetleri", "Yüksek Çözünürlüklü Kulüp Arması", "Yıkanabilir Solmaz Özel Boya Teknolojisi"]
    },
    {
        id: "efc-sleeve-pro-2026",
        title: "EFC Gaming Sleeve Pro 2026",
        category: "Aksesuarlar",
        oldPrice: 799.00,
        currentPrice: 649.00,
        primaryImage: "./resimler/kolluk.png",
        hoverImage: "./resimler/kolluk.png",
        description: "Karşınızda yeni espor profesyonel oyun kolluğumuz. Mouse pad üzerinde kusursuz kayma katsayısı sunarak nişan alma kabiliyetinizi maksimuma ulaştırır.",
        specs: ["Kompresyon Destekli Esnek Kumaş", "Mouse Pad Yüzeylerinde Sıfır Takılma", "Bilek ve Ön Kol Kas Yorgunluğunu Azaltıcı Yapı", "Üniseks Ergonomik Kesim"]
    }
];

// Veritabanını yerel hafızadan yükle veya varsayılanları getir
let PRODUCTS_DATABASE = JSON.parse(localStorage.getItem('efc_products_store')) || DEFAULT_PRODUCTS;
if(!localStorage.getItem('efc_products_store')) {
    localStorage.setItem('efc_products_store', JSON.stringify(PRODUCTS_DATABASE));
}

// Küresel Sepet Durumu Yönetimi (LocalStorage Destekli)
let globalCart = JSON.parse(localStorage.getItem('efc_cart_store')) || [];
let currentActiveSliderIndex = 0;
let currentSelectedCategory = "Tümü";
let activeSearchQuery = "";

// 2. DOM YÜKLENDİĞİNDE TETİKLENECEK BAŞLANGIÇ FONKSİYONLARI
document.addEventListener("DOMContentLoaded", () => {
    // Çerez Politikası Kontrolü
    if (!localStorage.getItem('efc_cookies_accepted')) {
        document.getElementById('cookieBanner').style.display = 'block';
    }

    // Ürünleri Ekrana Bas
    renderProductsList();
    
    // Sepet Arayüzünü Güncelle
    updateCartUI();

    // Otomatik Slider Döngüsü Başlat
    setInterval(() => {
        moveSlide(1);
    }, 6000);

    // Mobil Menü Olayları Bağlama
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileCloseBtn = document.getElementById('mobileCloseBtn');
    const navLinks = document.getElementById('navLinks');

    mobileMenuBtn.addEventListener('click', () => navLinks.classList.add('mobile-active'));
    mobileCloseBtn.addEventListener('click', () => navLinks.classList.remove('mobile-active'));
});

// Çerez kapatma
function acceptCookies() {
    localStorage.setItem('efc_cookies_accepted', 'true');
    document.getElementById('cookieBanner').style.display = 'none';
}

// 3. KAHRAMAN SLIDER (ANASAYFA BANNER) KONTROLLERİ
function moveSlide(direction) {
    const slides = document.querySelectorAll('#mainSlider .slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    if(slides.length === 0) return;

    slides[currentActiveSliderIndex].classList.remove('active');
    if(dots.length > 0) dots[currentActiveSliderIndex].classList.remove('active');

    currentActiveSliderIndex += direction;
    if (currentActiveSliderIndex >= slides.length) currentActiveSliderIndex = 0;
    if (currentActiveSliderIndex < 0) currentActiveSliderIndex = slides.length - 1;

    slides[currentActiveSliderIndex].classList.add('active');
    if(dots.length > 0) dots[currentActiveSliderIndex].classList.add('active');
}

function currentSlide(index) {
    const slides = document.querySelectorAll('#mainSlider .slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    
    slides[currentActiveSliderIndex].classList.remove('active');
    dots[currentActiveSliderIndex].classList.remove('active');

    currentActiveSliderIndex = index;

    slides[currentActiveSliderIndex].classList.add('active');
    dots[currentActiveSliderIndex].classList.add('active');
}

// 4. SAYFA VE KATEGORİ YÖNLENDİRME SİSTEMİ (FRONTEND ROUTER)
function navigateTo(pageId) {
    // Tüm sayfaları gizle
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(sec => sec.classList.remove('active-section'));

    // Aktif sayfa linki güncellemesi
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    if (pageId === 'home') {
        document.getElementById('page-home').classList.add('active-section');
        const homeNav = document.querySelector('.nav-item[data-page="home"]');
        if (homeNav) homeNav.classList.add('active');
    } else if (pageId === 'about') {
        document.getElementById('page-about').classList.add('active-section');
        const aboutNav = document.querySelector('.nav-item[data-page="hakkinda"]');
        if (aboutNav) aboutNav.classList.add('active');
    } else if (pageId === 'contact') {
        document.getElementById('page-contact').classList.add('active-section');
        const contactNav = document.querySelector('.nav-item[data-page="contact"]');
        if (contactNav) contactNav.classList.add('active');
    } else if (pageId === 'detail') {
        document.getElementById('page-product-detail').classList.add('active-section');
    } else if (pageId === 'checkout') {
        document.getElementById('page-checkout').classList.add('active-section');
        const checkoutNav = document.querySelector('.nav-item[data-page="checkout"]');
        if (checkoutNav) checkoutNav.classList.add('active');
    } else if (pageId === 'admin') {
        document.getElementById('page-admin').classList.add('active-section');
        const adminNav = document.querySelector('.nav-item[data-page="admin"]');
        if (adminNav) adminNav.classList.add('active');
        renderAdminProductsTable(); // Admin tablosunu güncelle
    }

    // Sayfayı en üste kaydır
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Mobil menüyü kapat
    document.getElementById('navLinks').classList.remove('mobile-active');
}

// Kategori Sekmesi Tetikleme Filtrelemesi
function filterCategory(categoryName) {
    currentSelectedCategory = categoryName;
    navigateTo('home');
    
    // Tab buton tasarımlarını güncelle
    const tabs = document.querySelectorAll('#categoryTabs .tab-btn');
    tabs.forEach(tab => {
        if(tab.textContent.trim() === categoryName || (categoryName === 'Tümü' && tab.textContent.trim() === 'Tümü')) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    // Navbar aktiflik durumunu eşitle
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    if(categoryName === 'Formalar') document.querySelector('.nav-item[data-page="formalar"]').classList.add('active');
    else if(categoryName === 'Aksesuarlar') document.querySelector('.nav-item[data-page="aksesuarlar"]').classList.add('active');
    else if(categoryName === 'Tümü') document.querySelector('.nav-item[data-page="home"]').classList.add('active');

    renderProductsList();
}

// Canlı Arama Çubuğu Olay Yönetimi
function handleSearch(query) {
    activeSearchQuery = query.toLowerCase().trim();
    renderProductsList();
}

// 5. ÜRÜN KARTLARINI VE GRID LİSTESİNİ OLUŞTURMA
function renderProductsList() {
    const gridContainer = document.getElementById('productsGridContainer');
    if (!gridContainer) return;

    // Filtreleme mantığı
    const filteredProducts = PRODUCTS_DATABASE.filter(prod => {
        const matchesCategory = (currentSelectedCategory === "Tümü" || prod.category === currentSelectedCategory);
        const matchesSearch = prod.title.toLowerCase().includes(activeSearchQuery) || prod.description.toLowerCase().includes(activeSearchQuery);
        return matchesCategory && matchesSearch;
    });

    if (filteredProducts.length === 0) {
        gridContainer.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 40px; color: var(--color-text-muted);">Aradığınız kriterlere uygun espor ürünü bulunamadı.</div>`;
        return;
    }

    let htmlBuffer = "";
    filteredProducts.forEach(product => {
        // Hesaplanan indirim yüzdesi
        const discountPercentage = Math.round(((product.oldPrice - product.currentPrice) / product.oldPrice) * 100);
        
        htmlBuffer += `
            <div class="product-card-container">
                <div class="product-image-box" onclick="showProductDetail('${product.id}')">
                    <span class="badge-discount">-%${discountPercentage} İNDİRİM</span>
                    <img src="${product.primaryImage}" alt="${product.title}" class="product-img img-primary">
                    <img src="${product.hoverImage}" alt="${product.title}" class="product-img img-hover">
                </div>
                <div class="product-details-box">
                    <a href="#" class="product-title-link" onclick="showProductDetail('${product.id}')">${product.title}</a>
                    <div class="price-row">
                        <span class="old-price">₺ ${product.oldPrice.toFixed(2)}</span>
                        <span class="current-price">₺ ${product.currentPrice.toFixed(2)}</span>
                    </div>
                    <button class="btn-add-to-cart" onclick="addToCart('${product.id}', 'M')"><i class="fa-solid fa-cart-plus"></i> Sepete Ekle</button>
                </div>
            </div>
        `;
    });

    gridContainer.innerHTML = htmlBuffer;
}

// 6. ÜRÜN DETAY SAYFASI YÖNETİMİ VE SEÇENEK DEĞİŞTİRME
function showProductDetail(productId) {
    const product = PRODUCTS_DATABASE.find(p => p.id === productId);
    if (!product) return;

    // Ekmek kırıntısı breadcrumb linklerini besle
    document.getElementById('detailBreadcrumbCategory').textContent = product.category;
    document.getElementById('detailBreadcrumbTitle').textContent = product.title;

    const detailContainer = document.getElementById('productDetailContainer');
    
    detailContainer.innerHTML = `
        <div class="detail-images-gallery">
            <div class="main-preview-box">
                <img src="${product.primaryImage}" id="productMainPreviewImg" alt="${product.title}">
            </div>
            <div class="thumb-images-row">
                <div class="thumb-box active" onclick="changeDetailImage('${product.primaryImage}', this)">
                    <img src="${product.primaryImage}" alt="Ön Görünüm">
                </div>
                <div class="thumb-box" onclick="changeDetailImage('${product.hoverImage}', this)">
                    <img src="${product.hoverImage}" alt="Arka Görünüm">
                </div>
            </div>
        </div>
        <div class="detail-info-sidebar">
            <span class="detail-category-tag">// ${product.category}</span>
            <h1 class="detail-title">${product.title}</h1>
            
            <div class="detail-price-box">
                <span class="old-price">₺ ${product.oldPrice.toFixed(2)}</span>
                <span class="current-price">₺ ${product.currentPrice.toFixed(2)}</span>
            </div>

            <div class="option-selector-block">
                <span class="selector-label">BEDEN SEÇİNİZ:</span>
                <div class="size-btn-group">
                    <span class="size-radio-btn active" onclick="selectSizeOption(this)">S</span>
                    <span class="size-radio-btn" onclick="selectSizeOption(this)">M</span>
                    <span class="size-radio-btn" onclick="selectSizeOption(this)">L</span>
                    <span class="size-radio-btn" onclick="selectSizeOption(this)">XL</span>
                    <span class="size-radio-btn" onclick="selectSizeOption(this)">XXL</span>
                </div>
            </div>

            <div class="detail-actions-row">
                <div class="detail-qty-select">
                    <i class="fa-solid fa-minus detail-qty-btn" onclick="adjustDetailQty(-1)"></i>
                    <input type="text" id="detailProductQtyInput" value="1" readonly>
                    <i class="fa-solid fa-plus detail-qty-btn" onclick="adjustDetailQty(1)"></i>
                </div>
                <button class="btn btn-primary btn-large" style="vertical-align: middle;" onclick="addFromDetailPage('${product.id}')">
                    SEPETE EKLE <i class="fa-solid fa-bag-shopping"></i>
                </button>
            </div>

            <div class="detail-description-tabs">
                <h4 class="desc-tab-header">Ürün Açıklaması ve Özellikleri</h4>
                <div class="desc-text-body">
                    <p>${product.description}</p>
                    <ul>
                        ${product.specs.map(spec => `<li><i class="fa-solid fa-circle-check" style="color:var(--color-primary); margin-right:8px; font-size:13px;"></i> ${spec}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;

    navigateTo('detail');
}

function changeDetailImage(imgUrl, element) {
    document.getElementById('productMainPreviewImg').src = imgUrl;
    const thumbs = document.querySelectorAll('.thumb-box');
    thumbs.forEach(t => t.classList.remove('active'));
    element.classList.add('active');
}

function selectSizeOption(element) {
    const sizeBtns = document.querySelectorAll('.size-radio-btn');
    sizeBtns.forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
}

function adjustDetailQty(amount) {
    const input = document.getElementById('detailProductQtyInput');
    let currentVal = parseInt(input.value) + amount;
    if (currentVal < 1) currentVal = 1;
    input.value = currentVal;
}

function addFromDetailPage(productId) {
    const qty = parseInt(document.getElementById('detailProductQtyInput').value);
    const activeSizeElement = document.querySelector('.size-radio-btn.active');
    const size = activeSizeElement ? activeSizeElement.textContent : "M";
    
    for(let i=0; i < qty; i++) {
        addToCart(productId, size, false);
    }
    updateCartUI();
    toggleCart(true);
}

// 7. SEPET SEPETE EKLEME, ÇIKARMA, ADET DEĞİŞTİRME MOTORU
function toggleCart(isOpen) {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (isOpen) {
        drawer.classList.add('active');
        overlay.classList.add('active');
    } else {
        drawer.classList.remove('active');
        overlay.classList.remove('active');
    }
}

function addToCart(productId, size = "M", triggerUIUpdate = true) {
    const product = PRODUCTS_DATABASE.find(p => p.id === productId);
    if (!product) return;

    // Aynı id ve aynı beden sepet kontrolü
    const existingIndex = globalCart.findIndex(item => item.id === productId && item.size === size);

    if (existingIndex > -1) {
        globalCart[existingIndex].quantity += 1;
    } else {
        globalCart.push({
            id: product.id,
            title: product.title,
            price: product.currentPrice,
            image: product.primaryImage,
            size: size,
            quantity: 1
        });
    }

    localStorage.setItem('efc_cart_store', JSON.stringify(globalCart));
    
    if (triggerUIUpdate) {
        updateCartUI();
        toggleCart(true);
    }
}

function changeCartItemQty(index, amount) {
    globalCart[index].quantity += amount;
    if (globalCart[index].quantity <= 0) {
        globalCart.splice(index, 1);
    }
    localStorage.setItem('efc_cart_store', JSON.stringify(globalCart));
    updateCartUI();
    // Eğer sepet checkout sayfasındaysak orayı da yenile
    if(document.getElementById('page-checkout').classList.contains('active-section')) {
        renderCheckoutSummary();
    }
}

function removeCartItemComplete(index) {
    globalCart.splice(index, 1);
    localStorage.setItem('efc_cart_store', JSON.stringify(globalCart));
    updateCartUI();
    if(document.getElementById('page-checkout').classList.contains('active-section')) {
        renderCheckoutSummary();
    }
}

function updateCartUI() {
    // Toplam Adet Hesapla
    const totalCount = globalCart.reduce((acc, curr) => acc + curr.quantity, 0);
    document.getElementById('cartBadgeCount').textContent = totalCount;
    document.getElementById('cartHeaderCount').textContent = totalCount;

    const emptyState = document.getElementById('cartEmptyState');
    const itemsWrapper = document.getElementById('cartItemsWrapper');
    const footerArea = document.getElementById('cartDrawerFooter');

    if (globalCart.length === 0) {
        emptyState.style.display = 'block';
        itemsWrapper.innerHTML = '';
        footerArea.style.display = 'none';
        return;
    }

    emptyState.style.display = 'none';
    footerArea.style.display = 'block';

    let htmlBuffer = "";
    let subtotal = 0;

    globalCart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        htmlBuffer += `
            <div class="cart-item-row">
                <div class="cart-item-img-cell">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="cart-item-details-cell">
                    <i class="fa-solid fa-trash-can cart-item-remove-btn" onclick="removeCartItemComplete(${index})"></i>
                    <h4 class="cart-item-title">${item.title}</h4>
                    <div class="cart-item-meta">Beden: <strong>${item.size}</strong></div>
                    <div class="cart-item-price">₺ ${item.price.toFixed(2)}</div>
                    
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="changeCartItemQty(${index}, -1)">-</button>
                        <span class="qty-val">${item.quantity}</span>
                        <button class="qty-btn" onclick="changeCartItemQty(${index}, 1)">+</button>
                    </div>
                </div>
            </div>
        `;
    });

    itemsWrapper.innerHTML = htmlBuffer;
    document.getElementById('cartSubtotalPrice').textContent = `₺ ${subtotal.toFixed(2)}`;
}

// 8. DEMO GÜVENLİ ÖDEME SAYFASI INTEGRASYONU
function goToCheckout() {
    if (globalCart.length === 0) {
        alert("Sepetiniz boş olduğu için ödeme sayfasına geçilemez.");
        return;
    }
    toggleCart(false);
    renderCheckoutSummary();
    navigateTo('checkout');
}

function renderCheckoutSummary() {
    const checkoutList = document.getElementById('checkoutItemsList');
    if (!checkoutList) return;

    let htmlBuffer = "";
    let subtotal = 0;

    globalCart.forEach(item => {
        const rowTotal = item.price * item.quantity;
        subtotal += rowTotal;
        htmlBuffer += `
            <div class="checkout-item-summary-row">
                <span>${item.title} <strong>(x${item.quantity})</strong> <br><small style="color:var(--color-primary);">Beden: ${item.size}</small></span>
                <span>₺ ${rowTotal.toFixed(2)}</span>
            </div>
        `;
    });

    checkoutList.innerHTML = htmlBuffer;
    document.getElementById('checkoutSubtotal').textContent = `₺ ${subtotal.toFixed(2)}`;
    document.getElementById('checkoutTotal').textContent = `₺ ${subtotal.toFixed(2)}`;
}

function processFakePayment() {
    alert("TEBRİKLER! Ödeme Simülasyonu Başarılı.\n\nSiparişiniz Demo Olarak Alınmıştır. Gerçek bir ücret kartınızdan tahsil edilmemiştir.\n\nEFC Gaming'i Tercih Ettiğiniz İçin Teşekkür Ederiz!");
    
    // Sepeti Temizle
    globalCart = [];
    localStorage.removeItem('efc_cart_store');
    updateCartUI();
    navigateTo('home');
}

function openAuthModal() {
    document.getElementById('authModal').style.display = 'flex';
}
function closeAuthModal() {
    document.getElementById('authModal').style.display = 'none';
}

function handleContactSubmit(event) {
    event.preventDefault();
    alert("Mesajınız EFC Gaming destek ekibine demo olarak iletilmiştir. En kısa sürede geri dönüş sağlanacaktır.");
    document.getElementById('contactForm').reset();
}
// ================= ADMIN PANELİ MOTORU =================
function renderAdminProductsTable() {
    const tableBody = document.getElementById('adminProductsTableBody');
    const countSpan = document.getElementById('adminProductCount');
    if (!tableBody) return;

    countSpan.textContent = PRODUCTS_DATABASE.length;
    let htmlBuffer = "";

    PRODUCTS_DATABASE.forEach((prod, index) => {
        htmlBuffer += `
            <tr style="border-bottom: 1px solid var(--color-dark-border);">
                <td style="padding: 10px;"><img src="${prod.primaryImage}" style="width:40px; height:45px; object-fit:cover; border-radius:2px;"></td>
                <td style="padding: 10px; font-weight:600;">${prod.title}</td>
                <td style="padding: 10px;">${prod.category}</td>
                <td style="padding: 10px; color:var(--color-primary);">₺ ${prod.currentPrice.toFixed(2)}</td>
                <td style="padding: 10px; text-align:center;">
                    <button onclick="deleteProductFromAdmin('${prod.id}')" style="color:#FF4444; cursor:pointer; font-size:16px;"><i class="fa-solid fa-trash"></i> Sil</button>
                </td>
            </tr>
        `;
    });

    tableBody.innerHTML = htmlBuffer;
}

function handleAdminAddProduct(event) {
    event.preventDefault();
    
    const title = document.getElementById('admin_p_title').value;
    const category = document.getElementById('admin_p_category').value;
    const oldPrice = parseFloat(document.getElementById('admin_p_oldprice').value);
    const currentPrice = parseFloat(document.getElementById('admin_p_currprice').value);
    const imgUrl = document.getElementById('admin_p_img').value;
    const desc = document.getElementById('admin_p_desc').value;

    // Eşsiz bir ID oluşturma (Slug formatında)
    const generatedId = "efc-" + title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const newProduct = {
        id: generatedId,
        title: title,
        category: category,
        oldPrice: oldPrice,
        currentPrice: currentPrice,
        primaryImage: imgUrl,
        hoverImage: imgUrl,
        description: desc,
        specs: ["%100 Profesyonel Oyuncu Ekipmanı", "EFC Lisanslı Ürünü"]
    };

    PRODUCTS_DATABASE.push(newProduct);
    localStorage.setItem('efc_products_store', JSON.stringify(PRODUCTS_DATABASE));
    
    // Formu temizle ve arayüzleri yenile
    document.getElementById('adminProductForm').reset();
    renderAdminProductsTable();
    renderProductsList(); // Anasayfa listesini güncelle
    alert("Ürün başarıyla mağazaya eklendi!");
}

function deleteProductFromAdmin(productId) {
    if(confirm("Bu ürünü mağazadan silmek istediğinize emin misiniz?")) {
        PRODUCTS_DATABASE = PRODUCTS_DATABASE.filter(p => p.id !== productId);
        localStorage.setItem('efc_products_store', JSON.stringify(PRODUCTS_DATABASE));
        renderAdminProductsTable();
        renderProductsList(); // Anasayfa listesini güncelle
    }
}