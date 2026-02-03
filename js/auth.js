// سیستم احراز هویت
document.addEventListener('DOMContentLoaded', function() {
    // مدیریت تب‌های ورود/ثبت‌نام
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    
    authTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            authTabs.forEach(t => t.classList.remove('active'));
            authForms.forEach(f => f.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(`${tabId}-form`).classList.add('active');
        });
    });
    
    // نمایش/مخفی کردن رمز عبور
    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
    
    // فرم ورود
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const phone = document.getElementById('login-phone').value;
            const password = document.getElementById('login-password').value;
            
            // اعتبارسنجی اولیه
            if (!phone || !password) {
                showNotification('لطفاً تمام فیلدها را پر کنید', 'error');
                return;
            }
            
            if (!/^09[0-9]{9}$/.test(phone)) {
                showNotification('شماره موبایل معتبر وارد کنید', 'error');
                return;
            }
            
            if (password.length < 6) {
                showNotification('رمز عبور باید حداقل ۶ کاراکتر باشد', 'error');
                return;
            }
            
            // شبیه‌سازی ورود
            simulateLogin(phone, password);
        });
    }
    
    // فرم ثبت‌نام
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('register-name').value;
            const phone = document.getElementById('register-phone').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirm = document.getElementById('register-confirm').value;
            const terms = document.getElementById('terms').checked;
            
            // اعتبارسنجی
            if (!name || !phone || !password || !confirm) {
                showNotification('لطفاً فیلدهای ضروری را پر کنید', 'error');
                return;
            }
            
            if (!/^09[0-9]{9}$/.test(phone)) {
                showNotification('شماره موبایل معتبر وارد کنید', 'error');
                return;
            }
            
            if (password.length < 6) {
                showNotification('رمز عبور باید حداقل ۶ کاراکتر باشد', 'error');
                return;
            }
            
            if (password !== confirm) {
                showNotification('رمز عبور و تکرار آن مطابقت ندارند', 'error');
                return;
            }
            
            if (!terms) {
                showNotification('لطفاً قوانین سایت را بپذیرید', 'error');
                return;
            }
            
            // شبیه‌سازی ثبت‌نام
            simulateRegister(name, phone, email, password);
        });
    }
    
    // تابع شبیه‌سازی ورود
    function simulateLogin(phone, password) {
        showNotification('در حال ورود...', 'warning');
        
        // شبیه‌سازی تاخیر شبکه
        setTimeout(() => {
            // بررسی کاربران ذخیره شده
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.phone === phone && u.password === password);
            
            if (user) {
                // کاربر موجود است
                const currentUser = {
                    id: user.id,
                    name: user.name,
                    phone: user.phone,
                    email: user.email,
                    joinDate: user.joinDate,
                    isLoggedIn: true,
                    lastLogin: new Date().toISOString()
                };
                
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                showNotification('ورود موفقیت‌آمیز بود!', 'success');
                
                // انتقال به پنل کاربری
                setTimeout(() => {
                    window.location.href = 'profile-dashboard.html';
                }, 1500);
            } else {
                // کاربر جدید - ساخت حساب ساده
                const newUser = {
                    id: Date.now(),
                    name: 'کاربر جدید',
                    phone: phone,
                    email: '',
                    password: password,
                    joinDate: new Date().toLocaleDateString('fa-IR'),
                    orders: [],
                    wishlist: [],
                    addresses: []
                };
                
                // ذخیره کاربر
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));
                
                // ذخیره کاربر جاری
                localStorage.setItem('currentUser', JSON.stringify({
                    ...newUser,
                    isLoggedIn: true
                }));
                
                showNotification('حساب کاربری جدید ساخته شد و وارد شدید!', 'success');
                
                setTimeout(() => {
                    window.location.href = 'profile-dashboard.html';
                }, 1500);
            }
        }, 2000);
    }
    
    // تابع شبیه‌سازی ثبت‌نام
    function simulateRegister(name, phone, email, password) {
        showNotification('در حال ایجاد حساب کاربری...', 'warning');
        
        setTimeout(() => {
            // بررسی تکراری نبودن شماره
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const existingUser = users.find(u => u.phone === phone);
            
            if (existingUser) {
                showNotification('این شماره موبایل قبلاً ثبت شده است', 'error');
                return;
            }
            
            // ذخیره کاربر جدید
            const newUser = {
                id: Date.now(),
                name: name,
                phone: phone,
                email: email || '',
                password: password, // در حالت واقعی باید هش شود
                joinDate: new Date().toLocaleDateString('fa-IR'),
                orders: [],
                wishlist: [],
                addresses: []
            };
            
            // ذخیره کاربران در localStorage
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            // ذخیره کاربر جاری
            localStorage.setItem('currentUser', JSON.stringify({
                ...newUser,
                isLoggedIn: true
            }));
            
            showNotification('حساب کاربری با موفقیت ایجاد شد!', 'success');
            
            setTimeout(() => {
                window.location.href = 'profile-dashboard.html';
            }, 1500);
        }, 2500);
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
        }, 4000);
    }
    
    // بررسی وضعیت ورود در صفحات مختلف
    checkAuthStatus();
    
    function checkAuthStatus() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        const currentPage = window.location.pathname;
        
        // اگر کاربر وارد شده و در صفحه ورود است، به داشبورد هدایت شود
        if (currentUser && currentUser.isLoggedIn && currentPage.includes('profile.html')) {
            window.location.href = 'profile-dashboard.html';
        }
        
        // اگر کاربر وارد نشده و در صفحه داشبورد است، به صفحه ورود هدایت شود
        if ((!currentUser || !currentUser.isLoggedIn) && currentPage.includes('profile-dashboard.html')) {
            window.location.href = 'profile.html';
        }
    }
    
    // اعتبارسنجی در صفحه تکمیل خرید
    if (window.location.pathname.includes('checkout.html')) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        
        if (!currentUser || !currentUser.isLoggedIn) {
            showNotification('برای تکمیل خرید باید وارد حساب کاربری خود شوید', 'error');
            
            setTimeout(() => {
                window.location.href = 'profile.html?redirect=checkout';
            }, 2000);
        }
    }
});

// اضافه کردن استایل نوتیفیکیشن به صورت پویا
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
