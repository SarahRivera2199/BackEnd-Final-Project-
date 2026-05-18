const API = 'http://localhost:3000';

async function handleRegister() {
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const btn = document.getElementById('reg-btn');

    clearMessages();

    if(!email || !password) {
        setError('Email and password are required.');
        return;
    }

    btn.disabled = true;
    btn.textContent = "Creating account...";

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const res = await fetch(`${API}/api/auth/register`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password}),
            signal: controller.signal 
        });

        const data = await res.json();

        if(res.status === 201) {
            setSuccess('Account created! Redirecting to login...');
            setTimeout(() => window.location.href = 'login.html', 1800);
        } else if (res.status === 400) {
            setError(data.message || 'Registration failed.');
        } else {
            setError(data.message || 'Server error. Please try again.');
        }

    } catch(err) {
        setError('Could not reach the server.')
    } finally {
        btn.disabled = false;
        btn.textContent = 'Create account'
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
    if(e.key === 'Enter') handleRegister();
});