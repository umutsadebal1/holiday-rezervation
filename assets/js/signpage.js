// Password visibility toggle
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.password-toggle i');
    if (!passwordInput || !toggleBtn) return;
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.classList.remove('fa-eye');
        toggleBtn.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleBtn.classList.remove('fa-eye-slash');
        toggleBtn.classList.add('fa-eye');
    }
}

const toggleSignupPasswordBtn = document.getElementById('toggleSignupPasswordBtn');
if (toggleSignupPasswordBtn) {
    toggleSignupPasswordBtn.addEventListener('click', togglePassword);
}

// Form submission
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Basic validation
    if (!name || !email || !password) {
        alert('Lütfen tüm alanları doldurunuz!');
        return;
    }
    
    if (password.length < 6) {
        alert('Şifre en az 6 karakter olmalıdır!');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Lütfen geçerli bir e-posta adresi giriniz!');
        return;
    }
    
    // Kullanıcı bilgisini localStorage'a kaydet
    const userData = {
        name: name,
        email: email,
        password: password, // Gerçek uygulamada hashlenmiş olmalı!
        registeredAt: new Date().toISOString()
    };
    
    localStorage.setItem('user', JSON.stringify(userData));
    
    console.log('Signup data:', userData);
    
    // Show success message
    alert(`Hoşgeldiniz ${name}! Hesabınız başarıyla oluşturuldu.`);
    
    // Reset form
    document.getElementById('signupForm').reset();
    
    // Redirect to home page after 2 seconds
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
});

// Social login buttons
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();

        const provider = btn.classList.contains('google-btn')
            ? 'Google'
            : btn.classList.contains('apple-btn')
                ? 'Apple'
                : 'Facebook';

        const existingUserRaw = localStorage.getItem('user');
        let existingUser = null;
        try {
            existingUser = existingUserRaw ? JSON.parse(existingUserRaw) : null;
        } catch (error) {
            existingUser = null;
        }

        const userData = existingUser && existingUser.email
            ? existingUser
            : {
                name: provider + ' Kullanicisi',
                email: provider.toLowerCase() + '@social.tatilrez.local',
                password: 'social-login',
                registeredAt: new Date().toISOString(),
                authProvider: provider
            };

        if (!existingUser || !existingUser.email) {
            localStorage.setItem('user', JSON.stringify(userData));
        }

        localStorage.setItem('authSession', JSON.stringify({
            email: userData.email,
            name: userData.name,
            provider,
            loggedInAt: new Date().toISOString()
        }));

        alert(provider + ' ile giris basarili.');
        window.location.href = 'index.html';
    });
});

// Login link
document.querySelector('.auth-footer a').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'index.html?openLogin=1';
});

// Add smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';
