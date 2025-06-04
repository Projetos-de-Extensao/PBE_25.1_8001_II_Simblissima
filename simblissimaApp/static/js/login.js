// login.js
function loadLogin() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="auth-container">
            <div class="auth-content">
                <div class="card">
                    <div class="card-header text-center"><h4 class="mb-0">Login</h4></div>
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
                            <div class="d-grid gap-2">
                                <button type="submit" class="btn btn-primary">Entrar</button>
                                <button type="button" class="btn btn-secondary" onclick="loadRegister()">Registrar</button>
                            </div>
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
            credentials: 'include'
        });

        if (response.ok) {
            // Esperamos a navegação ser atualizada antes de continuar
            const success = await updateNavigation();
            if (success) {
                showMessage('Login realizado com sucesso!');
                loadHome();
            } else {
                throw new Error('Erro ao verificar usuário após login');
            }
        } else {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Credenciais inválidas');
        }
    } catch (error) {
        console.error('Erro no login:', error);
        showMessage(error.message, 'danger');
    }
}

function loadRegister() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="auth-container">
            <div class="auth-content">
                <div class="card">
                    <div class="card-header text-center"><h4 class="mb-0">Cadastro de Novo Cliente</h4></div>
                    <div class="card-body">
                        <form id="registerForm" onsubmit="handleRegister(event)" novalidate>
                            <div class="mb-3">
                                <label for="first_name" class="form-label">Nome *</label>
                                <input type="text" class="form-control" id="first_name" required minlength="2">
                                <div class="invalid-feedback">Por favor, insira um nome válido (mínimo 2 caracteres)</div>
                            </div>
                            <div class="mb-3">
                                <label for="last_name" class="form-label">Sobrenome *</label>
                                <input type="text" class="form-control" id="last_name" required minlength="2">
                                <div class="invalid-feedback">Por favor, insira um sobrenome válido (mínimo 2 caracteres)</div>
                            </div>
                            <div class="mb-3">
                                <label for="cpf" class="form-label">CPF *</label>
                                <input type="text" class="form-control" id="cpf" required maxlength="11" pattern="\\d{11}" oninput="this.value = this.value.replace(/\\D/g, '')">
                                <div class="invalid-feedback">Por favor, insira um CPF válido (11 dígitos numéricos)</div>
                            </div>
                            <div class="mb-3">
                                <label for="email" class="form-label">E-mail *</label>
                                <input type="email" class="form-control" id="email" required pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$">
                                <div class="invalid-feedback">Por favor, insira um e-mail válido</div>
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Senha *</label>
                                <input type="password" class="form-control" id="password" required minlength="6">
                                <div class="invalid-feedback">A senha deve ter no mínimo 6 caracteres</div>
                            </div>
                            <div class="mb-3">
                                <label for="endereco" class="form-label">Endereço *</label>
                                <input type="text" class="form-control" id="endereco" required minlength="5">
                                <div class="invalid-feedback">Por favor, insira um endereço válido (mínimo 5 caracteres)</div>
                            </div>
                            <div class="mb-3">
                                <label for="telefone" class="form-label">Telefone *</label>
                                <input type="text" class="form-control" id="telefone" required pattern="\\d{10,11}" oninput="this.value = this.value.replace(/\\D/g, '')">
                                <div class="invalid-feedback">Por favor, insira um telefone válido (10 ou 11 dígitos)</div>
                            </div>
                            <div class="alert alert-info">Campos marcados com * são obrigatórios</div>
                            <div class="d-grid gap-2">
                                <button type="submit" class="btn btn-primary">Cadastrar</button>
                                <button type="button" class="btn btn-secondary" onclick="loadLogin()">Voltar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function handleRegister(event) {
    event.preventDefault();
    
    // Validação básica do formulário
    const form = event.target;
    if (!form.checkValidity()) {
        event.stopPropagation();
        form.classList.add('was-validated');
        return;
    }

    // Limpa o formulário de qualquer validação anterior
    form.classList.remove('was-validated');

    // Prepara os dados do formulário
    const formData = {
        first_name: document.getElementById('first_name').value.trim(),
        last_name: document.getElementById('last_name').value.trim(),
        cpf: document.getElementById('cpf').value.trim(),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value,
        endereco: document.getElementById('endereco').value.trim(),
        telefone: document.getElementById('telefone').value.trim()
    };    try {
        console.log('Enviando dados:', formData);
        const response = await fetch('/api/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify(formData),
            credentials: 'include'
        });

        const data = await response.json();
        console.log('Resposta do servidor:', data);
        
        if (!response.ok) {
            // Se o erro for de validação, mostra as mensagens de erro
            throw new Error(data.message || 'Erro ao cadastrar usuário');
        }

        showMessage('Cadastro realizado com sucesso! Por favor, faça login.');
        loadLogin();
    } catch (error) {
        console.error('Erro no registro:', error);
        let errorMessage = error.message;
        if (typeof errorMessage === 'string' && errorMessage.includes('\n')) {
            // Se a mensagem de erro contiver múltiplas linhas, cria uma lista
            const errors = errorMessage.split('\n').filter(msg => msg.trim());
            const errorHtml = `<ul class="mb-0 list-unstyled">
                ${errors.map(err => `<li>${err}</li>`).join('')}
            </ul>`;
            showMessage(errorHtml, 'danger', true);
        } else {
            showMessage(errorMessage || 'Erro ao cadastrar usuário. Por favor, tente novamente.', 'danger');
        }
        
        // Se houver erros de validação, mostra o formulário como inválido
        form.classList.add('was-validated');
    }
}

// Logout function moved to auth.js
