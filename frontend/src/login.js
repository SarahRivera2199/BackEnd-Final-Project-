const API = "http://localhost:3000";

async function handleLogin() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const btn = document.getElementById('login-btn');

    clearMessages();

    if(!email || !password) {
        setError('Email and password are required.');
        return;
    }

    btn.disabled = true;
    btn.textContent = "Logging in..."

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const res = await fetch(`${API}/api/auth/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, password }),
            signal: controller.signal
        });

        const data = await res.json();

        if(res.status === 200) {
            localStorage.setItem('token', data.token);

            setSuccess('Login successful! Redirecting...');
            setTimeout(() => window.location.href = 'tasks.html', 1500);
        } else if (res.status === 401) {
            setError(data.message || 'Invalid credentials.');
        } else {
            setError(data.message || 'Server error. Please try again.');
        }
    } catch(err) {
        setError('Could not reach the server');
    } finally {
        btn.disabled = false;
        btn.textContent = "Log In";
    }

}

function clearMessages() {
    document.getElementById('auth-error').textContent = '';
    document.getElementById('auth-success').textContent = '';
}

function setError(msg) {
    document.getElementById('auth-error').textContent = msg;
}

function setSuccess(msg) {
    document.getElementById('auth-success').textContent = msg;
}

document.addEventListener('keydown', e => {
    if(e.key === 'Enter') handleLogin();
})