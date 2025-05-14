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
                                <label for="username" class="form-label">CPF</label>
                                <input type="text" class="form-control" id="username" required maxlength="11" pattern="\\d{11}">
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Senha</label>
                                <input type="password" class="form-control" id="password" required>
                            </div>
                            <button type="submit" class="btn btn-primary">Entrar</button>
                            <button type="button" class="btn btn-secondary" onclick="loadRegister()">Registrar</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

async function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        
        const response = await fetch('/api-auth/login/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: formData,
            credentials: 'include' // Importante para autenticação por sessão
        });

        if (response.ok) {
            updateNavigation(); // Atualiza a navegação
            window.location.href = '/'; // Redireciona para a página inicial
            showMessage('Login realizado com sucesso!');
        } else {
            throw new Error('Credenciais inválidas');
        }
    } catch (error) {
        showMessage(error.message, 'danger');
    }
}

function loadRegister() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">Cadastro de Novo Cliente</div>
                    <div class="card-body">
                        <form id="registerForm" onsubmit="handleRegister(event)">
                            <div class="mb-3">
                                <label for="first_name" class="form-label">Nome</label>
                                <input type="text" class="form-control" id="first_name" required>
                            </div>
                            <div class="mb-3">
                                <label for="last_name" class="form-label">Sobrenome</label>
                                <input type="text" class="form-control" id="last_name" required>
                            </div>
                            <div class="mb-3">
                                <label for="cpf" class="form-label">CPF</label>
                                <input type="text" class="form-control" id="cpf" required maxlength="11" pattern="\\d{11}">
                            </div>
                            <div class="mb-3">
                                <label for="email" class="form-label">E-mail</label>
                                <input type="email" class="form-control" id="email" required>
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Senha</label>
                                <input type="password" class="form-control" id="password" required>
                            </div>
                            <div class="mb-3">
                                <label for="endereco" class="form-label">Endereço</label>
                                <input type="text" class="form-control" id="endereco" required>
                            </div>
                            <div class="mb-3">
                                <label for="telefone" class="form-label">Telefone</label>
                                <input type="text" class="form-control" id="telefone" required>
                            </div>
                            <button type="submit" class="btn btn-primary">Cadastrar</button>
                            <button type="button" class="btn btn-secondary" onclick="loadLogin()">Voltar</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function handleRegister(event) {
    event.preventDefault();
    const formData = {
        first_name: document.getElementById('first_name').value,
        last_name: document.getElementById('last_name').value,
        cpf: document.getElementById('cpf').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        endereco: document.getElementById('endereco').value,
        telefone: document.getElementById('telefone').value
    };    try {
        const response = await fetchAPI('/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        showMessage('Cadastro realizado com sucesso! Por favor, faça login.');
        loadLogin();
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
