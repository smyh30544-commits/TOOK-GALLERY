// مدیریت صفحه محصول
document.addEventListener('DOMContentLoaded', function() {
    // مدیریت امتیازدهی
    const stars = document.querySelectorAll('.rating-input i');
    let selectedRating = 0;
    
    stars.forEach(star => {
        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            highlightStars(rating);
        });
        
        star.addEventListener('mouseout', function() {
            highlightStars(selectedRating);
        });
        
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.getAttribute('data-rating'));
            highlightStars(selectedRating);
        });
    });
    
    function highlightStars(rating) {
        stars.forEach(star => {
            const starRating = parseInt(star.getAttribute('data-rating'));
            if (starRating <= rating) {
                star.classList.remove('far');
                star.classList.add('fas');
            } else {
                star.classList.remove('fas');
                star.classList.add('far');
            }
        });
    }
    
    // مدیریت فرم نظرات
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const reviewText = this.querySelector('textarea').value;
            
            if (reviewText.trim() && selectedRating > 0) {
                // ایجاد نظر جدید
                const newReview = document.createElement('div');
                newReview.className = 'review';
                newReview.innerHTML = `
                    <div class="review-header">
                        <span class="reviewer-name">شما</span>
                        <div class="review-rating">
                            ${'<i class="fas fa-star"></i>'.repeat(selectedRating)}
                            ${'<i class="far fa-star"></i>'.repeat(5 - selectedRating)}
                        </div>
                    </div>
                    <p class="review-text">${reviewText}</p>
                    <span class="review-date">امروز</span>
                `;
                
                document.querySelector('.reviews').prepend(newReview);
                
                // ریست فرم
                this.reset();
                selectedRating = 0;
                highlightStars(0);
                
                // نمایش پیام موفقیت
                showNotification('نظر شما با موفقیت ثبت شد!', 'success');
            } else {
                showNotification('لطفاً نظر و امتیاز خود را وارد کنید.', 'error');
            }
        });
    }
    
    // مدیریت دکمه افزودن به سبد خرید
    const addToCartBtn = document.querySelector('.btn-primary');
    if (addToCartBtn && addToCartBtn.textContent.includes('سبد خرید')) {
        addToCartBtn.addEventListener('click', function() {
            const quantity = parseInt(document.querySelector('.quantity-input').value);
            const selectedColor = document.querySelector('.color-option.selected').style.backgroundColor;
            
            // نمایش پیام
            showNotification(`محصول با ${quantity} عدد و رنگ انتخابی به سبد خرید اضافه شد.`, 'success');
            
            // در حالت واقعی، اینجا محصول به localStorage یا سرور اضافه می‌شود
            let cart = JSON.parse(localStorage.getItem('cart') || '[]');
            cart.push({
                id: Date.now(),
                name: 'محصول ویژه 1',
                price: 150000,
                quantity: quantity,
                color: selectedColor,
                image: 'تصویر 1'
            });
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // به‌روزرسانی شمارنده سبد خرید
            updateCartBadge();
        });
    }
    
    // تابع نمایش نوتیفیکیشن
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="close-notif">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
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
                font-weight: 500;
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 15px;
                animation: slideDown 0.3s ease;
            }
            .notification.success {
                background-color: #2ecc71;
            }
            .notification.error {
                background-color: #e74c3c;
            }
            .close-notif {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                line-height: 1;
            }
            @keyframes slideDown {
                from { top: -100px; }
                to { top: 20px; }
            }
        `;
        document.head.appendChild(style);
        
        // بستن نوتیفیکیشن
        const closeBtn = notification.querySelector('.close-notif');
        closeBtn.addEventListener('click', () => notification.remove());
        
        setTimeout(() => notification.remove(), 5000);
    }
    
    // به‌روزرسانی شمارنده سبد خرید
    function updateCartBadge() {
        const badge = document.querySelector('.header-icons .badge');
        if (badge) {
            let cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            badge.textContent = totalItems;
        }
    }
    
    // بارگذاری اولیه شمارنده
    updateCartBadge();
});
