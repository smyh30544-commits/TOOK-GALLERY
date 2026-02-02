// مدیریت صفحه تکمیل خرید
document.addEventListener('DOMContentLoaded', function() {
    const checkoutForm = document.getElementById('checkout-form');
    const trackingSection = document.getElementById('tracking-section');
    
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // اعتبارسنجی فرم
            if (validateForm()) {
                // نمایش لودینگ
                showLoading();
                
                // شبیه‌سازی پردازش سفارش
                setTimeout(() => {
                    hideLoading();
                    
                    // پردازش موفقیت‌آمیز
                    processOrder();
                    
                    // مخفی کردن فرم و نمایش کد رهگیری
                    document.getElementById('checkout-form-section').style.display = 'none';
                    trackingSection.style.display = 'block';
                    
                    // پاک کردن سبد خرید
                    localStorage.removeItem('cart');
                    updateCartBadge();
                    
                    // اسکرول به بخش کد رهگیری
                    trackingSection.scrollIntoView({ behavior: 'smooth' });
                }, 2000);
            }
        });
    }
    
    // اعتبارسنجی فرم
    function validateForm() {
        let isValid = true;
        const requiredFields = checkoutForm.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = '#e74c3c';
                showFieldError(field, 'این فیلد الزامی است.');
            } else {
                field.style.borderColor = '#2ecc71';
                clearFieldError(field);
            }
        });
        
        // اعتبارسنجی ایمیل
        const emailField = document.getElementById('email');
        if (emailField.value && !isValidEmail(emailField.value)) {
            isValid = false;
            emailField.style.borderColor = '#e74c3c';
            showFieldError(emailField, 'ایمیل معتبر وارد کنید.');
        }
        
        // اعتبارسنجی شماره تلفن
        const phoneField = document.getElementById('phone');
        if (phoneField.value && !isValidPhone(phoneField.value)) {
            isValid = false;
            phoneField.style.borderColor = '#e74c3c';
            showFieldError(phoneField, 'شماره تلفن معتبر وارد کنید.');
        }
        
        return isValid;
    }
    
    // اعتبارسنجی ایمیل
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // اعتبارسنجی شماره تلفن
    function isValidPhone(phone) {
        const re = /^[\d\s\-\(\)\+]{10,}$/;
        return re.test(phone);
    }
    
    // نمایش خطای فیلد
    function showFieldError(field, message) {
        clearFieldError(field);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '14px';
        errorDiv.style.marginTop = '5px';
        field.parentNode.appendChild(errorDiv);
    }
    
    // پاک کردن خطای فیلد
    function clearFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    // پردازش سفارش
    function processOrder() {
        // ایجاد کد رهگیری تصادفی
        const trackingCode = 'TRK-' + 
            Math.floor(1000 + Math.random() * 9000) + '-' + 
            Math.floor(1000 + Math.random() * 9000);
        
        // ایجاد شماره سفارش
        const orderNumber = 'ORD-' + new Date().getFullYear() + '-' + 
            Math.floor(1000 + Math.random() * 9000);
        
        // نمایش کد
        document.getElementById('tracking-code').textContent = trackingCode;
        
        // ذخیره اطلاعات سفارش
        const orderData = {
            orderNumber: orderNumber,
            trackingCode: trackingCode,
            date: new Date().toLocaleDateString('fa-IR'),
            total: '180,000 تومان',
            paymentMethod: document.querySelector('input[name="payment"]:checked').value === 'online' ? 'پرداخت آنلاین' : 'پرداخت در محل',
            deliveryMethod: document.querySelector('input[name="delivery"]:checked').value === 'peyk' ? 'پیک موتوری' : 'پست پیشتاز'
        };
        
        localStorage.setItem('lastOrder', JSON.stringify(orderData));
        
        // نمایش پیام موفقیت
        showNotification('سفارش شما با موفقیت ثبت شد!', 'success');
    }
    
    // نمایش لودینگ
    function showLoading() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-overlay';
        loadingDiv.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <p>در حال پردازش سفارش...</p>
            </div>
        `;
        document.body.appendChild(loadingDiv);
    }
    
    // مخفی کردن لودینگ
    function hideLoading() {
        const loadingDiv = document.querySelector('.loading-overlay');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }
    
    // نمایش نوتیفیکیشن
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `<span>${message}</span>`;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 3000);
    }
    
    // به‌روزرسانی شمارنده سبد خرید
    function updateCartBadge() {
        const badge = document.querySelector('.badge');
        if (badge) {
            badge.textContent = '0';
        }
        localStorage.setItem('cartCount', '0');
    }
    
    // مدیریت چاپ فیش
    const printBtn = document.getElementById('print-receipt');
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            window.print();
        });
    }
    
    // استایل‌های اضافی
    const style = document.createElement('style');
    style.textContent = `
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }
        .loading-spinner {
            text-align: center;
        }
        .loading-spinner i {
            font-size: 48px;
            color: #ff6b9d;
            margin-bottom: 15px;
        }
        .notification {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            z-index: 10000;
            animation: slideDown 0.3s ease;
        }
        .notification.success {
            background-color: #2ecc71;
        }
        @keyframes slideDown {
            from { top: -100px; }
            to { top: 20px; }
        }
        
        @media print {
            .hamburger-menu,
            .support-circle,
            header,
            .btn {
                display: none !important;
            }
            .tracking-code {
                border: 2px solid #000;
                padding: 20px;
            }
            .code {
                border: 2px dashed #000;
            }
        }
    `;
    document.head.appendChild(style);
});
