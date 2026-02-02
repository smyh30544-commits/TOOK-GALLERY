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
    
    // اسلایدر فروش ویژه
    const sliderTrack = document.querySelector('.slider-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (sliderTrack && prevBtn && nextBtn) {
        let currentPosition = 0;
        const slideWidth = 270;
        const totalSlides = document.querySelectorAll('.slider-track .product-card').length;
        const visibleSlides = Math.floor(sliderTrack.parentElement.offsetWidth / slideWidth);
        const maxScroll = -(totalSlides - visibleSlides) * slideWidth;
        
        prevBtn.addEventListener('click', function() {
            currentPosition += slideWidth;
            if (currentPosition > 0) currentPosition = 0;
            sliderTrack.style.transform = `translateX(${currentPosition}px)`;
        });
        
        nextBtn.addEventListener('click', function() {
            currentPosition -= slideWidth;
            if (currentPosition < maxScroll) currentPosition = maxScroll;
            sliderTrack.style.transform = `translateX(${currentPosition}px)`;
        });
    }
    
    // دکمه پشتیبان
    const supportIcon = document.querySelector('.support-icon');
    const supportModal = document.querySelector('.support-modal');
    const closeModal = document.querySelector('.close-modal');
    
    if (supportIcon && supportModal) {
        supportIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            supportModal.classList.toggle('active');
        });
        
        if (closeModal) {
            closeModal.addEventListener('click', function() {
                supportModal.classList.remove('active');
            });
        }
        
        document.addEventListener('click', function(e) {
            if (!supportIcon.contains(e.target) && !supportModal.contains(e.target)) {
                supportModal.classList.remove('active');
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
                    alert('از علاقه‌مندی‌ها حذف شد.');
                } else {
                    this.classList.add('active');
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    this.innerHTML = '<i class="fas fa-heart"></i> حذف از علاقه‌مندی‌ها';
                    alert('به علاقه‌مندی‌ها اضافه شد.');
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
});
