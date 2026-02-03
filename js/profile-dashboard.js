// مدیریت پنل کاربری - کامل
document.addEventListener('DOMContentLoaded', function() {
    // بررسی ورود کاربر
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    if (!currentUser || !currentUser.isLoggedIn) {
        window.location.href = 'profile.html';
        return;
    }
    
    // نمایش اطلاعات کاربر
    updateUserInfo(currentUser);
    
    // بارگذاری داده‌ها
    loadDashboardData(currentUser);
    
    // مدیریت تب‌ها
    setupTabs();
    
    // مدیریت فرم‌ها
    setupForms(currentUser);
    
    // مدیریت دکمه‌ها
    setupButtons(currentUser);
});

// نمایش اطلاعات کاربر
function updateUserInfo(user) {
    const nameElement = document.getElementById('user-name');
    const phoneElement = document.getElementById('user-phone');
    const joinDateElement = document.getElementById('join-date');
    
    if (nameElement) nameElement.textContent = user.name || 'کاربر مهمان';
    if (phoneElement) phoneElement.textContent = user.phone || '---';
    if (joinDateElement) joinDateElement.textContent = user.joinDate || '---';
}

// بارگذاری داده‌های داشبورد
function loadDashboardData(user) {
    // بارگذاری آمار
    loadUserStats(user);
    
    // بارگذاری سفارشات
    loadUserOrders(user);
    
    // بارگذاری علاقه‌مندی‌ها
    loadUserWishlist(user);
    
    // بارگذاری آدرس‌ها
    loadUserAddresses(user);
    
    // تنظیم فرم ویرایش
    setupEditForm(user);
}

// بارگذاری آمار کاربر
function loadUserStats(user) {
    const orders = JSON.parse(localStorage.getItem(`orders_${user.id}`) || '[]');
    const wishlist = user.wishlist || [];
    
    // آمار سفارشات
    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    
    // جمع خریدها
    const totalSpent = orders
        .filter(o => o.status === 'completed')
        .reduce((sum, order) => sum + (order.total || 0), 0);
    
    // به‌روزرسانی UI
    const totalOrdersEl = document.getElementById('total-orders');
    const completedOrdersEl = document.getElementById('completed-orders');
    const wishlistCountEl = document.getElementById('wishlist-count');
    const totalSpentEl = document.getElementById('total-spent');
    
    if (totalOrdersEl) totalOrdersEl.textContent = totalOrders;
    if (completedOrdersEl) completedOrdersEl.textContent = completedOrders;
    if (wishlistCountEl) wishlistCountEl.textContent = wishlist.length;
    if (totalSpentEl) totalSpentEl.textContent = totalSpent.toLocaleString();
}

// بارگذاری سفارشات کاربر
function loadUserOrders(user) {
    const orders = JSON.parse(localStorage.getItem(`orders_${user.id}`) || '[]');
    const ordersList = document.getElementById('orders-list');
    const allOrdersList = document.getElementById('all-orders-list');
    
    // اگر سفارشی وجود ندارد
    if (orders.length === 0) {
        if (ordersList) {
            ordersList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-bag"></i>
                    <h3>هنوز سفارشی ثبت نکرده‌اید</h3>
                    <p>برای ثبت اولین سفارش، به صفحه محصولات مراجعه کنید</p>
                    <a href="index.html" class="btn btn-primary" style="margin-top: 20px;">
                        <i class="fas fa-shopping-cart"></i> مشاهده محصولات
                    </a>
                </div>
            `;
        }
        
        if (allOrdersList) {
            allOrdersList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-receipt"></i>
                    <h3>هنوز سفارشی ثبت نکرده‌اید</h3>
                    <p>سفارشات شما اینجا نمایش داده می‌شود</p>
                </div>
            `;
        }
        return;
    }
    
    // ایجاد کارت سفارشات
    const createOrderCard = (order) => {
        const statusMap = {
            'pending': { text: 'در انتظار پرداخت', class: 'pending' },
            'processing': { text: 'در حال پردازش', class: 'pending' },
            'shipped': { text: 'ارسال شده', class: 'pending' },
            'completed': { text: 'تحویل شده', class: 'completed' },
            'cancelled': { text: 'لغو شده', class: 'pending' }
        };
        
        const status = statusMap[order.status] || { text: order.status, class: 'pending' };
        
        return `
            <div class="order-card">
                <div class="order-header">
                    <span class="order-id">سفارش #${order.id || '---'}</span>
                    <span class="order-date">${order.date || '---'}</span>
                    <span class="order-status ${status.class}">${status.text}</span>
                </div>
                <div class="order-items">
                    ${(order.items || []).map(item => `
                        <div class="order-item">
                            <span>${item.name || 'محصول'} × ${item.quantity || 1}</span>
                            <span>${((item.price || 0) * (item.quantity || 1)).toLocaleString()} تومان</span>
                        </div>
                    `).join('')}
                </div>
                <div class="order-footer">
                    <span class="order-total">مبلغ کل: ${(order.total || 0).toLocaleString()} تومان</span>
                    <button class="btn btn-secondary" onclick="viewOrderDetails('${order.id}')">
                        <i class="fas fa-eye"></i> مشاهده جزئیات
                    </button>
                </div>
            </div>
        `;
    };
    
    // نمایش ۳ سفارش آخر در داشبورد
    const recentOrders = orders.slice(-3).reverse();
    if (ordersList) {
        ordersList.innerHTML = recentOrders.map(createOrderCard).join('');
    }
    
    // نمایش همه سفارشات
    if (allOrdersList) {
        allOrdersList.innerHTML = orders.reverse().map(createOrderCard).join('');
    }
}

// بارگذاری علاقه‌مندی‌ها
function loadUserWishlist(user) {
    const wishlistItems = document.getElementById('wishlist-items');
    const wishlist = user.wishlist || [];
    
    if (wishlist.length === 0) return;
    
    const createWishlistItem = (item) => `
        <div class="favorite-item">
            <div class="fav-image">${item.image || 'تصویر'}</div>
            <div class="fav-info">
                <h4>${item.name || 'محصول'}</h4>
                <p class="price">${(item.price || 0).toLocaleString()} تومان</p>
                <div class="fav-actions">
                    <button class="btn btn-primary" onclick="addToCartFromWishlist('${item.id}')">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                    <button class="btn btn-secondary" onclick="removeFromWishlist('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    if (wishlistItems) {
        wishlistItems.innerHTML = `
            <div class="favorites-grid">
                ${wishlist.map(createWishlistItem).join('')}
            </div>
        `;
    }
}

// بارگذاری آدرس‌ها
function loadUserAddresses(user) {
    const addressList = document.getElementById('address-list');
    const addresses = user.addresses || [];
    
    if (addresses.length === 0) return;
    
    const createAddressCard = (address, index) => `
        <div class="address-card">
            <div class="address-header">
                <h4>${address.title || 'آدرس'}</h4>
                ${address.isDefault ? '<span class="address-default">پیش‌فرض</span>' : ''}
            </div>
            <p>${address.fullAddress || '---'}</p>
            <p>کد پستی: ${address.postalCode || '---'}</p>
            <p>تلفن: ${address.phone || '---'}</p>
            <div class="address-actions">
                <button class="btn btn-primary" onclick="editAddress(${index})">ویرایش</button>
                <button class="btn btn-secondary" onclick="deleteAddress(${index})">حذف</button>
                ${!address.isDefault ? `<button class="btn btn-secondary" onclick="setDefaultAddress(${index})">پیش‌فرض</button>` : ''}
            </div>
        </div>
    `;
    
    if (addressList) {
        addressList.innerHTML = `
            ${addresses.map(createAddressCard).join('')}
            <button class="btn btn-primary add-address" id="add-address-btn">
                <i class="fas fa-plus"></i> افزودن آدرس جدید
            </button>
        `;
        
        // اضافه کردن رویداد به دکمه جدید
        document.getElementById('add-address-btn')?.addEventListener('click', () => showAddAddressForm(user));
    }
}

// تنظیم فرم ویرایش
function setupEditForm(user) {
    const editForm = document.getElementById('edit-profile-form');
    if (!editForm || !user.name) return;
    
    // تقسیم نام به نام و نام خانوادگی
    const nameParts = user.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // پر کردن فرم
    document.getElementById('edit-firstname').value = firstName;
    document.getElementById('edit-lastname').value = lastName;
    document.getElementById('edit-phone').value = user.phone || '';
    document.getElementById('edit-email').value = user.email || '';
    document.getElementById('edit-birthdate').value = user.birthdate || '';
    
    // رویداد ثبت فرم
    editForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const updatedUser = { ...user };
        updatedUser.name = `${document.getElementById('edit-firstname').value} ${document.getElementById('edit-lastname').value}`.trim();
        updatedUser.phone = document.getElementById('edit-phone').value;
        updatedUser.email = document.getElementById('edit-email').value;
        updatedUser.birthdate = document.getElementById('edit-birthdate').value;
        
        // ذخیره در localStorage
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        // به‌روزرسانی در لیست کاربران
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updatedUser };
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        // به‌روزرسانی نمایش
        updateUserInfo(updatedUser);
        showNotification('اطلاعات با موفقیت ذخیره شد', 'success');
    });
}

// تنظیم تب‌ها
function setupTabs() {
    const profileTabs = document.querySelectorAll('.profile-tab');
    const profileContents = document.querySelectorAll('.profile-content');
    
    profileTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // غیرفعال کردن همه تب‌ها
            profileTabs.forEach(t => t.classList.remove('active'));
            profileContents.forEach(c => c.classList.remove('active'));
            
            // فعال کردن تب انتخاب شده
            this.classList.add('active');
            const targetContent = document.getElementById(tabId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// تنظیم دکمه‌ها
function setupButtons(user) {
    // دکمه خروج
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('آیا می‌خواهید از حساب خود خارج شوید؟')) {
                user.isLoggedIn = false;
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                showNotification('با موفقیت خارج شدید', 'success');
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            }
        });
    }
    
    // دکمه تغییر رمز عبور
    const changePasswordBtn = document.getElementById('change-password-btn');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', showChangePasswordForm);
    }
}

// نمایش فرم افزودن آدرس
function showAddAddressForm(user) {
    const modalHtml = `
        <div class="modal-overlay active" id="address-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>افزودن آدرس جدید</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="new-address-form">
                        <div class="form-group">
                            <label>عنوان آدرس:</label>
                            <input type="text" class="form-control" id="address-title" placeholder="مثال: خانه، محل کار" required>
                        </div>
                        <div class="form-group">
                            <label>آدرس کامل:</label>
                            <textarea class="form-control" id="address-full" rows="3" placeholder="آدرس کامل با ذکر خیابان، پلاک، واحد" required></textarea>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>کد پستی:</label>
                                <input type="text" class="form-control" id="address-postal" placeholder="۱۰ رقمی" pattern="[0-9]{10}" required>
                            </div>
                            <div class="form-group">
                                <label>شماره تلفن:</label>
                                <input type="tel" class="form-control" id="address-phone" placeholder="09xxxxxxxxx" pattern="09[0-9]{9}" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="address-default"> تنظیم به عنوان آدرس پیش‌فرض
                            </label>
                        </div>
                        <div class="form-group">
                            <button type="submit" class="btn btn-primary">ذخیره آدرس</button>
                            <button type="button" class="btn btn-secondary cancel-btn">انصراف</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    // اضافه کردن مودال به صفحه
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer);
    
    // مدیریت رویدادها
    const modal = document.getElementById('address-modal');
    const closeBtn = modal.querySelector('.close-modal');
    const cancelBtn = modal.querySelector('.cancel-btn');
    const form = document.getElementById('new-address-form');
    
    // بستن مودال
    const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => modalContainer.remove(), 300);
    };
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // ثبت فرم
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newAddress = {
            title: document.getElementById('address-title').value,
            fullAddress: document.getElementById('address-full').value,
            postalCode: document.getElementById('address-postal').value,
            phone: document.getElementById('address-phone').value,
            isDefault: document.getElementById('address-default').checked
        };
        
        // اگر آدرس پیش‌فرض است، بقیه را غیرپیش‌فرض کنیم
        if (newAddress.isDefault) {
            user.addresses = (user.addresses || []).map(addr => ({ ...addr, isDefault: false }));
        }
        
        // اضافه کردن آدرس جدید
        user.addresses = [...(user.addresses || []), newAddress];
        
        // ذخیره تغییرات
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // به‌روزرسانی لیست کاربران
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            users[userIndex] = user;
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        showNotification('آدرس جدید با موفقیت اضافه شد', 'success');
        closeModal();
        
        // رفرش لیست آدرس‌ها
        setTimeout(() => loadUserAddresses(user), 500);
    });
}

// نمایش فرم تغییر رمز عبور
function showChangePasswordForm() {
    const modalHtml = `
        <div class="modal-overlay active" id="password-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>تغییر رمز عبور</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="change-password-form">
                        <div class="form-group">
                            <label>رمز عبور فعلی:</label>
                            <input type="password" class="form-control" id="current-password" required>
                        </div>
                        <div class="form-group">
                            <label>رمز عبور جدید:</label>
                            <input type="password" class="form-control" id="new-password" minlength="6" required>
                        </div>
                        <div class="form-group">
                            <label>تکرار رمز عبور جدید:</label>
                            <input type="password" class="form-control" id="confirm-password" required>
                        </div>
                        <div class="form-group">
                            <button type="submit" class="btn btn-primary">تغییر رمز</button>
                            <button type="button" class="btn btn-secondary cancel-btn">انصراف</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    // اضافه کردن مودال به صفحه
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer);
    
    // مدیریت رویدادها
    const modal = document.getElementById('password-modal');
    const closeBtn = modal.querySelector('.close-modal');
    const cancelBtn = modal.querySelector('.cancel-btn');
    const form = document.getElementById('change-password-form');
    
    // بستن مودال
    const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => modalContainer.remove(), 300);
    };
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // ثبت فرم
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // اعتبارسنجی
        if (newPassword !== confirmPassword) {
            showNotification('رمز عبور جدید و تکرار آن مطابقت ندارند', 'error');
            return;
        }
        
        if (newPassword.length < 6) {
            showNotification('رمز عبور جدید باید حداقل ۶ کاراکتر باشد', 'error');
            return;
        }
        
        // در اینجا باید با سرور چک شود که رمز فعلی درست است
        // فعلاً فرض می‌کنیم درست است
        
        showNotification('رمز عبور با موفقیت تغییر کرد', 'success');
        closeModal();
    });
}

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

// توابع سراسری برای استفاده در onclick
function viewOrderDetails(orderId) {
    alert(`جزئیات سفارش ${orderId}\nدر نسخه کامل به صفحه جزئیات سفارش هدایت می‌شوید.`);
}

function addToCartFromWishlist(productId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser) return;
    
    const wishlist = currentUser.wishlist || [];
    const product = wishlist.find(item => item.id === productId);
    
    if (product) {
        // افزودن به سبد خرید
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.push({
            ...product,
            quantity: 1,
            addedAt: new Date().toISOString()
        });
        localStorage.setItem('cart', JSON.stringify(cart));
        
        showNotification('محصول به سبد خرید اضافه شد', 'success');
        
        // به‌روزرسانی شمارنده سبد خرید
        updateCartBadge();
    }
}

function removeFromWishlist(productId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser) return;
    
    if (confirm('آیا از حذف این محصول از علاقه‌مندی‌ها مطمئن هستید؟')) {
        currentUser.wishlist = (currentUser.wishlist || []).filter(item => item.id !== productId);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // به‌روزرسانی در لیست کاربران
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        showNotification('محصول از علاقه‌مندی‌ها حذف شد', 'success');
        
        // رفرش لیست علاقه‌مندی‌ها
        setTimeout(() => loadUserWishlist(currentUser), 500);
    }
}

function editAddress(index) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser) return;
    
    const addresses = currentUser.addresses || [];
    if (index >= addresses.length) return;
    
    alert(`ویرایش آدرس "${addresses[index].title}"\nدر نسخه کامل فرم ویرایش نمایش داده می‌شود.`);
}

function deleteAddress(index) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser) return;
    
    const addresses = currentUser.addresses || [];
    if (index >= addresses.length) return;
    
    if (confirm(`آیا از حذف آدرس "${addresses[index].title}" مطمئن هستید؟`)) {
        currentUser.addresses = addresses.filter((_, i) => i !== index);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // به‌روزرسانی در لیست کاربران
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        showNotification('آدرس حذف شد', 'success');
        
        // رفرش لیست آدرس‌ها
        setTimeout(() => loadUserAddresses(currentUser), 500);
    }
}

function setDefaultAddress(index) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser) return;
    
    const addresses = currentUser.addresses || [];
    if (index >= addresses.length) return;
    
    // غیرفعال کردن پیش‌فرض بودن بقیه آدرس‌ها
    currentUser.addresses = addresses.map((addr, i) => ({
        ...addr,
        isDefault: i === index
    }));
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // به‌روزرسانی در لیست کاربران
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    showNotification('آدرس به عنوان پیش‌فرض تنظیم شد', 'success');
    
    // رفرش لیست آدرس‌ها
    setTimeout(() => loadUserAddresses(currentUser), 500);
}

// به‌روزرسانی شمارنده سبد خرید
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    // به‌روزرسانی در همه صفحات
    const badges = document.querySelectorAll('#cart-count');
    badges.forEach(badge => {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    });
    
    localStorage.setItem('cartCount', totalItems);
}

// بارگذاری اولیه شمارنده
updateCartBadge();
