function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.querySelector('#togglePasswordBtn i');
    if (!passwordInput || !toggleIcon) return;

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

const togglePasswordBtn = document.getElementById('togglePasswordBtn');
if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener('click', togglePassword);
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if (!email || !password) {
            alert('Lutfen tum alanlari doldurun.');
            return;
        }

        let storedUser = null;
        try {
            const userData = localStorage.getItem('user');
            storedUser = userData ? JSON.parse(userData) : null;
        } catch (error) {
            storedUser = null;
        }

        if (!storedUser) {
            alert('Kayitli kullanici bulunamadi. Once uye olun.');
            window.location.href = 'signpage.html';
            return;
        }

        const isValid = storedUser.email === email && storedUser.password === password;

        if (!isValid) {
            alert('E-posta veya sifre hatali.');
            return;
        }

        const authSession = {
            email: storedUser.email,
            name: storedUser.name,
            loggedInAt: new Date().toISOString()
        };
        localStorage.setItem('authSession', JSON.stringify(authSession));

        alert('Giris basarili. Ana sayfaya yonlendiriliyorsunuz.');
        window.location.href = 'index.html';
    });
}

function detectSocialProvider(button) {
    if (!button) return 'Sosyal';
    if (button.classList.contains('google-btn')) return 'Google';
    if (button.classList.contains('apple-btn')) return 'Apple';
    return 'Facebook';
}

function socialLogin(provider) {
    let storedUser = null;
    try {
        storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    } catch (error) {
        storedUser = null;
    }

    const userData = storedUser && storedUser.email
        ? storedUser
        : {
            name: provider + ' Kullanicisi',
            email: provider.toLowerCase() + '@social.tatilrez.local',
            password: 'social-login',
            registeredAt: new Date().toISOString(),
            authProvider: provider
        };

    if (!storedUser || !storedUser.email) {
        localStorage.setItem('user', JSON.stringify(userData));
    }

    localStorage.setItem('authSession', JSON.stringify({
        email: userData.email,
        name: userData.name,
        provider,
        loggedInAt: new Date().toISOString()
    }));

    alert(provider + ' ile giris basarili. Ana sayfaya yonlendiriliyorsunuz.');
    window.location.href = 'index.html';
}

document.querySelectorAll('.social-btn').forEach((btn) => {
    btn.addEventListener('click', (event) => {
        event.preventDefault();
        socialLogin(detectSocialProvider(btn));
    });
});
