// مدیریت سبد خرید
document.addEventListener('DOMContentLoaded', function() {
    // بارگذاری سبد خرید از localStorage
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // اگر سبد خرید خالی است
    if (cart.length === 0) {
        const cartItems = document.querySelector('.cart-items');
        if (cartItems) {
            cartItems.innerHTML = `
                <h2 class="section-title">سبد خرید شما خالی است</h2>
                <div style="text-align: center; margin: 40px 0;">
                    <i class="fas fa-shopping-cart" style="font-size: 60px; color: #ddd; margin-bottom: 20px;"></i>
                    <p style="color: #666; margin-bottom: 30px;">هنوز محصولی به سبد خرید خود اضافه نکرده‌اید.</p>
                    <a href="index.html" class="btn btn-primary" style="padding: 15px 30px;">
                        <i class="fas fa-shopping-bag"></i> مشاهده محصولات
                    </a>
                </div>
            `;
        }
        
        const cartSummary = document.querySelector('.cart-summary');
        if (cartSummary) {
            cartSummary.style.display = 'none';
        }
        return;
    }
    
    // نمایش سبد خرید
    renderCart();
    
    // محاسبه خلاصه سفارش
    function updateSummary() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const discount = subtotal > 500000 ? 50000 : 0;
        const shipping = 30000;
        const total = subtotal - discount + shipping;
        
        const subtotalEl = document.querySelector('.summary-row:nth-child(1) span:last-child');
        const discountEl = document.querySelector('.discount');
        const shippingEl = document.querySelector('.summary-row:nth-child(3) span:last-child');
        const totalEl = document.querySelector('.final-price');
        
        if (subtotalEl) subtotalEl.textContent = subtotal.toLocaleString() + ' تومان';
        if (discountEl) discountEl.textContent = discount > 0 ? `-${discount.toLocaleString()} تومان` : '۰ تومان';
        if (shippingEl) shippingEl.textContent = shipping.toLocaleString() + ' تومان';
        if (totalEl) totalEl.textContent = total.toLocaleString() + ' تومان';
    }
    
    // نمایش سبد خرید
    function renderCart() {
        const cartItemsContainer = document.querySelector('.cart-items');
        if (!cartItemsContainer) return;
        
        let html = '<h2 class="section-title">محصولات انتخابی شما</h2>';
        
        cart.forEach((item, index) => {
            const total = item.price * item.quantity;
            html += `
                <div class="cart-item" data-index="${index}">
                    <div class="item-image">${item.image || 'تصویر'}</div>
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p class="item-color">قیمت واحد: ${item.price.toLocaleString()} تومان</p>
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
                const itemName = cart[index].name;
                
                if (confirm(`آیا می‌خواهید "${itemName}" را از سبد خرید حذف کنید؟`)) {
                    cart.splice(index, 1);
                    localStorage.setItem('cart', JSON.stringify(cart));
                    renderCart();
                    updateCartBadge();
                    
                    showNotification('محصول از سبد خرید حذف شد.', 'success');
                    
                    // اگر سبد خرید خالی شد
                    if (cart.length === 0) {
                        location.reload();
                    }
                }
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
            badge.style.display = totalItems > 0 ? 'flex' : 'none';
        }
        
        localStorage.setItem('cartCount', totalItems);
    }
    
    // اجرای اولیه
    renderCart();
});
