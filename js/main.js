// مدیریت منوی همبرگر
document.addEventListener('DOMContentLoaded', function() {
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (hamburgerIcon) {
        hamburgerIcon.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // بستن منو با کلیک بیرون
    document.addEventListener('click', function(event) {
        if (mobileNav.classList.contains('active') && 
            !hamburgerIcon.contains(event.target) && 
            !mobileNav.contains(event.target)) {
            mobileNav.classList.remove('active');
            hamburgerIcon.classList.remove('active');
        }
    });
    
    // اسلایدر فروش ویژه - نسخه پیشرفته
    const sliderTrack = document.getElementById('slider-track');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const sliderContainer = document.getElementById('slider-container');
    const sliderDots = document.getElementById('slider-dots');
    
    if (sliderTrack && prevBtn && nextBtn) {
        let currentSlide = 0;
        let slideWidth = 280 + 25;
        let slidesPerView = 4;
        let totalSlides = sliderTrack.children.length;
        let maxSlide = totalSlides - slidesPerView;
        
        // تنظیم عرض اسلایدر بر اساس صفحه
        function updateSliderSettings() {
            const containerWidth = sliderContainer.offsetWidth;
            
            if (containerWidth < 768) {
                slidesPerView = 1;
                slideWidth = containerWidth * 0.85;
            } else if (containerWidth < 992) {
                slidesPerView = 2;
                slideWidth = (containerWidth - 50) / 2;
            } else if (containerWidth < 1200) {
                slidesPerView = 3;
                slideWidth = (containerWidth - 75) / 3;
            } else {
                slidesPerView = 4;
                slideWidth = (containerWidth - 100) / 4;
            }
            
            const productCards = document.querySelectorAll('.product-card');
            productCards.forEach(card => {
                card.style.minWidth = `${slideWidth - 25}px`;
            });
            
            maxSlide = Math.max(0, totalSlides - slidesPerView);
            updateSlider();
            createDots();
            updateButtons();
        }
        
        // حرکت به اسلاید مشخص
        function goToSlide(slideIndex) {
            if (slideIndex < 0) slideIndex = 0;
            if (slideIndex > maxSlide) slideIndex = maxSlide;
            
            currentSlide = slideIndex;
            updateSlider();
            updateDots();
            updateButtons();
        }
        
        // آپدیت موقعیت اسلایدر
        function updateSlider() {
            const translateX = -currentSlide * slideWidth;
            sliderTrack.style.transform = `translateX(${translateX}px)`;
        }
        
        // ایجاد نقاط ناوبری
        function createDots() {
            if (!sliderDots) return;
            
            sliderDots.innerHTML = '';
            const dotsCount = maxSlide + 1;
            
            for (let i = 0; i < dotsCount; i++) {
                const dot = document.createElement('button');
                dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
                dot.setAttribute('data-slide', i);
                dot.setAttribute('aria-label', `برو به محصول ${i + 1}`);
                
                dot.addEventListener('click', () => goToSlide(i));
                sliderDots.appendChild(dot);
            }
        }
        
        // آپدیت نقاط فعال
        function updateDots() {
            if (!sliderDots) return;
            
            const dots = sliderDots.querySelectorAll('.slider-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }
        
        // آپدیت وضعیت دکمه‌ها
        function updateButtons() {
            if (prevBtn) prevBtn.disabled = currentSlide === 0;
            if (nextBtn) nextBtn.disabled = currentSlide >= maxSlide;
        }
        
        // رویدادهای دکمه‌ها
        if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
        
        // رویداد تغییر اندازه پنجره
        window.addEventListener('resize', () => {
            updateSliderSettings();
        });
        
        // کشیدن با ماوس/لمس
        let isDragging = false;
        let startPos = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        
        sliderTrack.addEventListener('mousedown', dragStart);
        sliderTrack.addEventListener('touchstart', dragStart);
        sliderTrack.addEventListener('mouseup', dragEnd);
        sliderTrack.addEventListener('touchend', dragEnd);
        sliderTrack.addEventListener('mousemove', drag);
        sliderTrack.addEventListener('touchmove', drag);
        
        function dragStart(e) {
            if (e.type === 'touchstart') {
                startPos = e.touches[0].clientX;
            } else {
                startPos = e.clientX;
            }
            isDragging = true;
            sliderTrack.style.cursor = 'grabbing';
            sliderTrack.style.transition = 'none';
        }
        
        function drag(e) {
            if (!isDragging) return;
            
            e.preventDefault();
            let currentPos = 0;
            
            if (e.type === 'touchmove') {
                currentPos = e.touches[0].clientX;
            } else {
                currentPos = e.clientX;
            }
            
            const diff = currentPos - startPos;
            currentTranslate = prevTranslate + diff;
            
            sliderTrack.style.transform = `translateX(${currentTranslate}px)`;
        }
        
        function dragEnd() {
            isDragging = false;
            sliderTrack.style.cursor = 'grab';
            sliderTrack.style.transition = 'transform 0.5s ease';
            
            const movedBy = currentTranslate - prevTranslate;
            
            if (Math.abs(movedBy) > slideWidth * 0.2) {
                if (movedBy < 0 && currentSlide < maxSlide) {
                    currentSlide++;
                } else if (movedBy > 0 && currentSlide > 0) {
                    currentSlide--;
                }
            }
            
            goToSlide(currentSlide);
            prevTranslate = -currentSlide * slideWidth;
        }
        
        // مقداردهی اولیه
        updateSliderSettings();
    }
    
    // مدیریت دکمه پشتیبان - نسخه اصلاح شده
    const supportIcon = document.querySelector('.support-icon');
    const supportModal = document.querySelector('.support-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalOverlay = document.querySelector('.modal-overlay');
    
    if (supportIcon && supportModal) {
        // باز کردن مودال
        supportIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            supportModal.classList.add('active');
            if (modalOverlay) modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        // بستن مودال
        const closeModalFunc = function() {
            supportModal.classList.remove('active');
            if (modalOverlay) modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        };
        
        if (closeModal) {
            closeModal.addEventListener('click', closeModalFunc);
        }
        
        // بستن با کلیک روی overlay
        if (modalOverlay) {
            modalOverlay.addEventListener('click', closeModalFunc);
        }
        
        // بستن با کلید ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && supportModal.classList.contains('active')) {
                closeModalFunc();
            }
        });
        
        // بستن با کلیک بیرون از مودال
        supportModal.addEventListener('click', function(e) {
            if (e.target === supportModal) {
                closeModalFunc();
            }
        });
    }
    
    // ارسال پیام در پشتیبانی
    const sendBtn = document.querySelector('.send-btn');
    const chatInput = document.querySelector('.chat-input input');
    const chatMessages = document.querySelector('.chat-messages');
    
    if (sendBtn && chatInput) {
        sendBtn.addEventListener('click', function() {
            const message = chatInput.value.trim();
            if (message) {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message sent';
                messageDiv.innerHTML = `<p>${message}</p>`;
                chatMessages.appendChild(messageDiv);
                chatInput.value = '';
                chatMessages.scrollTop = chatMessages.scrollHeight;
                
                // پاسخ خودکار
                setTimeout(() => {
                    const autoReply = document.createElement('div');
                    autoReply.className = 'message received';
                    autoReply.innerHTML = '<p>پیام شما دریافت شد. پشتیبان به زودی پاسخ خواهد داد.</p>';
                    chatMessages.appendChild(autoReply);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 1000);
            }
        });
        
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendBtn.click();
            }
        });
    }
    
    // مدیریت تب‌ها
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            if (document.getElementById(tabId)) {
                document.getElementById(tabId).classList.add('active');
            }
        });
    });
    
    // جستجوی محصولات
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function() {
            const query = searchInput.value.trim();
            if (query) {
                alert(`جستجو برای: ${query}`);
                // در حالت واقعی، اینجا محصولات فیلتر می‌شوند
            }
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }
    
    // انتخاب رنگ محصول
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            colorOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    // انتخاب تعداد
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    const quantityInput = document.querySelector('.quantity-input');
    
    if (minusBtn && plusBtn && quantityInput) {
        minusBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            if (value > 1) {
                quantityInput.value = value - 1;
            }
        });
        
        plusBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            quantityInput.value = value + 1;
        });
        
        quantityInput.addEventListener('change', function() {
            if (this.value < 1) this.value = 1;
        });
    }
    
    // افزودن به سبد خرید از صفحه اصلی
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const priceText = productCard.querySelector('.price span').textContent;
            const price = parseInt(priceText.replace(/[^0-9]/g, ''));
            
            // افزودن به سبد خرید
            let cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: productId,
                    name: productName,
                    price: price,
                    quantity: 1,
                    image: 'تصویر محصول',
                    addedAt: new Date().toISOString()
                });
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // نمایش پیام
            showNotification(`${productName} به سبد خرید اضافه شد`, 'success');
            
            // به‌روزرسانی شمارنده
            updateCartBadge();
        });
    });
    
    // افزودن به علاقه‌مندی‌ها
    const wishlistBtns = document.querySelectorAll('.btn-secondary');
    wishlistBtns.forEach(btn => {
        if (btn.textContent.includes('علاقه‌مندی')) {
            btn.addEventListener('click', function() {
                const isActive = this.classList.contains('active');
                const icon = this.querySelector('i');
                
                if (isActive) {
                    this.classList.remove('active');
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    this.innerHTML = '<i class="far fa-heart"></i> افزودن به علاقه‌مندی‌ها';
                    showNotification('از علاقه‌مندی‌ها حذف شد.', 'success');
                } else {
                    this.classList.add('active');
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    this.innerHTML = '<i class="fas fa-heart"></i> حذف از علاقه‌مندی‌ها';
                    showNotification('به علاقه‌مندی‌ها اضافه شد.', 'success');
                }
            });
        }
    });
    
    // رزرو کردن رنگ‌ها برای محصول
    const colors = ['#ff6b9d', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#e74c3c'];
    colorOptions.forEach((option, index) => {
        if (index < colors.length) {
            option.style.backgroundColor = colors[index];
        }
    });
    
    // بارگذاری اولیه شمارنده سبد خرید
    updateCartBadge();
});

// نمایش نوتیفیکیشن
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="close-notif" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// به‌روزرسانی شمارنده سبد خرید
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    // به‌روزرسانی در همه صفحات
    const badges = document.querySelectorAll('#cart-count, .badge');
    badges.forEach(badge => {
        if (badge.id === 'cart-count' || badge.closest('.icon-link[href*="cart"]')) {
            badge.textContent = totalItems;
            badge.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    });
    
    localStorage.setItem('cartCount', totalItems);
}

// استایل نوتیفیکیشن
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    .notification {
        position: fixed;
        top: 30px;
        left: 50%;
        transform: translateX(-50%);
        padding: 15px 30px;
        border-radius: 12px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideDown 0.4s ease;
        display: flex;
        align-items: center;
        gap: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        min-width: 300px;
        max-width: 90vw;
        text-align: center;
    }
    
    .notification.success {
        background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
    }
    
    .notification.error {
        background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
    }
    
    .notification.warning {
        background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
    }
    
    .close-notif {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        line-height: 1;
        padding: 0;
        margin-right: -10px;
    }
    
    @keyframes slideDown {
        from { top: -100px; opacity: 0; }
        to { top: 30px; opacity: 1; }
    }
`;
document.head.appendChild(notificationStyle);
