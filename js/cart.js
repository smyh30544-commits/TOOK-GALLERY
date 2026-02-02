// مدیریت سبد خرید
document.addEventListener('DOMContentLoaded', function() {
    // بارگذاری سبد خرید از localStorage
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // اگر سبد خرید خالی است
    if (cart.length === 0) {
        document.querySelector('.cart-items').innerHTML = `
            <h2 class="section-title">سبد خرید شما خالی است</h2>
            <p style="text-align: center; margin: 30px 0;">هنوز محصولی به سبد خرید خود اضافه نکرده‌اید.</p>
            <div style="text-align: center;">
                <a href="index.html" class="btn btn-primary">مشاهده محصولات</a>
            </div>
        `;
        document.querySelector('.cart-summary').style.display = 'none';
        return;
    }
    
    // نمایش سبد خرید
    function renderCart() {
        const cartItemsContainer = document.querySelector('.cart-items');
        let html = '<h2 class="section-title">محصولات انتخابی شما</h2>';
        
        cart.forEach((item, index) => {
            const total = item.price * item.quantity;
            html += `
                <div class="cart-item" data-index="${index}">
                    <div class="item-image">${item.image}</div>
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p class="item-color">رنگ: <span style="display: inline-block; width: 15px; height: 15px; background-color: ${item.color}; border-radius: 50%;"></span></p>
                        <p class="item-price">${item.price.toLocaleString()} تومان</p>
                    </div>
                    <div class="item-quantity">
                        <button class="qty-btn minus"><i class="fas fa-minus"></i></button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn plus"><i class="fas fa-plus"></i></button>
                    </div>
                    <div class="item-total">${total.toLocaleString()} تومان</div>
                    <button class="item-remove"><i class="fas fa-trash"></i></button>
                </div>
            `;
        });
        
        cartItemsContainer.innerHTML = html;
        updateSummary();
        attachEventListeners();
    }
    
    // محاسبه خلاصه سفارش
    function updateSummary() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const discount = subtotal > 500000 ? 50000 : 0;
        const shipping = 30000;
        const total = subtotal - discount + shipping;
        
        document.querySelector('.summary-row:nth-child(1) span:last-child').textContent = 
            subtotal.toLocaleString() + ' تومان';
        document.querySelector('.discount').textContent = 
            discount > 0 ? `-${discount.toLocaleString()} تومان` : '۰ تومان';
        document.querySelector('.summary-row:nth-child(3) span:last-child').textContent = 
            shipping.toLocaleString() + ' تومان';
        document.querySelector('.final-price').textContent = 
            total.toLocaleString() + ' تومان';
    }
    
    // اتصال رویدادها
    function attachEventListeners() {
        // کاهش تعداد
        document.querySelectorAll('.qty-btn.minus').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.closest('.cart-item').getAttribute('data-index');
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    renderCart();
                    updateCartBadge();
                }
            });
        });
        
        // افزایش تعداد
        document.querySelectorAll('.qty-btn.plus').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.closest('.cart-item').getAttribute('data-index');
                cart[index].quantity++;
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
                updateCartBadge();
            });
        });
        
        // حذف آیتم
        document.querySelectorAll('.item-remove').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.closest('.cart-item').getAttribute('data-index');
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
                updateCartBadge();
                
                // نمایش پیام
                showNotification('محصول از سبد خرید حذف شد.', 'success');
            });
        });
    }
    
    // نمایش نوتیفیکیشن
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `<span>${message}</span>`;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 3000);
    }
    
    // به‌روزرسانی شمارنده
    function updateCartBadge() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const badge = document.querySelector('.badge');
        if (badge) {
            badge.textContent = totalItems;
        }
        
        // به‌روزرسانی در همه صفحات
        localStorage.setItem('cartCount', totalItems);
    }
    
    // اجرای اولیه
    renderCart();
    
    // استایل نوتیفیکیشن
    const style = document.createElement('style');
    style.textContent = `
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
        .notification.error {
            background-color: #e74c3c;
        }
        @keyframes slideDown {
            from { top: -100px; }
            to { top: 20px; }
        }
    `;
    document.head.appendChild(style);
});
