// login.js
function loadLogin() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">Login</div>
                    <div class="card-body">
                        <form id="loginForm" onsubmit="handleLogin(event)">
                            <div class="mb-3">
                                <label for="username" class="form-label">Usuário</label>
                                <input type="text" class="form-control" id="username" required>
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Senha</label>
                                <input type="password" class="form-control" id="password" required>
                            </div>
                            <button type="submit" class="btn btn-primary">Entrar</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api-auth/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
            updateNavigation();
            loadHome();
            showMessage('Login realizado com sucesso!');
        } else {
            throw new Error('Credenciais inválidas');
        }
    } catch (error) {
        showMessage(error.message, 'danger');
    }
}

async function logout() {
    try {
        await fetch('/api-auth/logout/', { method: 'POST' });
        authToken = null;
        localStorage.removeItem('authToken');
        updateNavigation();
        loadLogin();
        showMessage('Logout realizado com sucesso!');
    } catch (error) {
        showMessage('Erro ao fazer logout', 'danger');
    }
}
