// مدیریت صفحه تکمیل خرید
document.addEventListener('DOMContentLoaded', function() {
    // اعتبارسنجی کاربر
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    if (!currentUser || !currentUser.isLoggedIn) {
        showNotification('برای تکمیل خرید باید وارد حساب کاربری خود شوید', 'error');
        
        setTimeout(() => {
            window.location.href = 'profile.html?redirect=checkout.html';
        }, 2000);
        return;
    }
    
    // بررسی سبد خرید
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
        showNotification('سبد خرید شما خالی است', 'error');
        
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 2000);
        return;
    }
    
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
                    processOrder(currentUser, cart);
                    
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
        
        // اعتبارسنجی کد پستی
        const postalCodeField = document.getElementById('postalCode');
        if (postalCodeField.value && !isValidPostalCode(postalCodeField.value)) {
            isValid = false;
            postalCodeField.style.borderColor = '#e74c3c';
            showFieldError(postalCodeField, 'کد پستی ۱۰ رقمی وارد کنید.');
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
        const re = /^09[0-9]{9}$/;
        return re.test(phone.replace(/[\s\-]/g, ''));
    }
    
    // اعتبارسنجی کد پستی
    function isValidPostalCode(postalCode) {
        const re = /^\d{10}$/;
        return re.test(postalCode.replace(/\D/g, ''));
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
    function processOrder(user, cartItems) {
        // محاسبه مبلغ کل
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const discount = subtotal > 500000 ? 50000 : 0;
        const shipping = 30000;
        const total = subtotal - discount + shipping;
        
        // ایجاد کد رهگیری تصادفی
        const trackingCode = 'TRK-' + 
            Math.floor(1000 + Math.random() * 9000) + '-' + 
            Math.floor(1000 + Math.random() * 9000);
        
        // ایجاد شماره سفارش
        const orderNumber = 'ORD-' + new Date().getFullYear() + '-' + 
            Math.floor(1000 + Math.random() * 9000);
        
        // ایجاد تاریخ سفارش
        const orderDate = new Date().toLocaleDateString('fa-IR');
        
        // اطلاعات سفارش
        const orderData = {
            id: orderNumber,
            trackingCode: trackingCode,
            date: orderDate,
            items: cartItems,
            subtotal: subtotal,
            discount: discount,
            shipping: shipping,
            total: total,
            status: 'pending',
            paymentMethod: document.querySelector('input[name="payment"]:checked').value === 'online' ? 'پرداخت آنلاین' : 'پرداخت در محل',
            deliveryMethod: document.querySelector('input[name="delivery"]:checked').value === 'peyk' ? 'پیک موتوری' : 'پست پیشتاز',
            customerInfo: {
                name: document.getElementById('firstName').value + ' ' + document.getElementById('lastName').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                province: document.getElementById('province').value,
                postalCode: document.getElementById('postalCode').value,
                receiverPhone: document.getElementById('receiverPhone').value
            }
        };
        
        // نمایش کد
        document.getElementById('tracking-code').textContent = trackingCode;
        
        // نمایش جزئیات سفارش
        const orderDetails = document.querySelector('.order-details ul');
        if (orderDetails) {
            orderDetails.innerHTML = `
                <li><strong>شماره سفارش:</strong> ${orderNumber}</li>
                <li><strong>تاریخ ثبت:</strong> ${orderDate}</li>
                <li><strong>مبلغ کل:</strong> ${total.toLocaleString()} تومان</li>
                <li><strong>روش پرداخت:</strong> ${orderData.paymentMethod}</li>
                <li><strong>روش دریافت:</strong> ${orderData.deliveryMethod}</li>
            `;
        }
        
        // ذخیره اطلاعات سفارش
        saveOrderToHistory(user.id, orderData);
        
        // نمایش پیام موفقیت
        showNotification('سفارش شما با موفقیت ثبت شد!', 'success');
    }
    
    // ذخیره سفارش در تاریخچه
    function saveOrderToHistory(userId, orderData) {
        // بارگذاری سفارشات قبلی کاربر
        const userOrders = JSON.parse(localStorage.getItem(`orders_${userId}`) || '[]');
        
        // اضافه کردن سفارش جدید
        userOrders.push(orderData);
        localStorage.setItem(`orders_${userId}`, JSON.stringify(userOrders));
        
        // ذخیره اطلاعات آخرین سفارش
        localStorage.setItem('lastOrder', JSON.stringify(orderData));
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
            badge.style.display = 'none';
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
        .field-error {
            color: #e74c3c;
            font-size: 14px;
            margin-top: 5px;
            text-align: right;
        }
        
        @media print {
            .hamburger-menu,
            .support-circle,
            header,
            .btn,
            .no-print {
                display: none !important;
            }
            .tracking-code {
                border: 2px solid #000;
                padding: 20px;
                page-break-inside: avoid;
            }
            .code {
                border: 2px dashed #000;
            }
            body {
                border: none;
            }
        }
    `;
    document.head.appendChild(style);
});
