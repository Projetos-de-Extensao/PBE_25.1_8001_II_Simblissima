// home.js
async function loadHome() {
    const user = await getCurrentUser();
    
    // Adiciona imagem de fundo apenas na home
    document.body.classList.add('home-bg');

    const content = document.getElementById('content');
    let pedidosButton = '';
    if (user && user.is_staff) {
        pedidosButton = `<button class="btn btn-primary" onclick="loadManagerDashboard()">Dashboard</button>`;
    } else {
        pedidosButton = `<button class="btn btn-primary" onclick="loadPedidos()">Ver Pedidos</button>`;
    }
    content.innerHTML = `
        <div class="d-flex justify-content-center align-items-start" style="min-height: 350px">
            <div class="cnmt" style="max-width: 800px; width: 100%; margin: 40px 0 0 0;">
                <div class="jumbotron bg-white p-4 rounded shadow-sm mb-4 text-center">
                    <h1 class="display-4">Bem-vindo à Simblissima!</h1>
                    <p class="lead">Sistema de gerenciamento de pedidos e produtos.</p>                                    
                </div>
                <div class="row justify-content-center mt-4">
                    <div class="col-md-6 col-lg-5 mb-3 d-flex justify-content-center">
                        <div class="card h-100 w-100 border-0 shadow-sm">
                            <div class="card-body">
                                <h5 class="card-title">Pedidos</h5>
                                <p class="card-text">Acompanhe e gerencie os pedidos.</p>
                                ${pedidosButton}
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-5 mb-3 d-flex justify-content-center">
                        <div class="card h-100 w-100 border-0 shadow-sm">
                            <div class="card-body">
                                <h5 class="card-title">Minha Conta</h5>
                                <p class="card-text">Gerencie suas informações.</p>
                                <button class="btn btn-primary" onclick="loadPerfil()">Ver Perfil</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function loadPerfil() {
    const user = await checkAuthAndRedirect();
    if (!user) return;

    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="d-flex justify-content-center align-items-start" style="min-height: 350px">
            <div style="max-width: 800px; width: 100%; margin: 40px 0 0 0;">
                <div class="row justify-content-center">
                    <div class="col-md-8">
                        <div class="card">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <h3 class="mb-0">Meu Perfil</h3>
                                <div>
                                    <button type="submit" form="perfilForm" class="btn btn-primary me-2">Salvar Alterações</button>
                                    <button type="button" class="btn btn-secondary" onclick="loadHome()">Voltar</button>
                                </div>
                            </div>
                            <div class="card-body">
                                <div id="perfilData" class="text-center">
                                    <div class="spinner-border" role="status">
                                        <span class="visually-hidden">Carregando...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    try {
        const response = await fetchAPI('/perfil/', {
            method: 'GET'
        });

        const cliente = response;
        const perfilDiv = document.getElementById('perfilData');
        perfilDiv.innerHTML = `
            <form id="perfilForm" onsubmit="handleUpdatePerfil(event)" class="needs-validation" novalidate>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Nome</label>
                        <input type="text" class="form-control" id="first_name" value="${cliente.user.first_name}" required>
                        <div class="invalid-feedback">Por favor, insira um nome válido</div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Sobrenome</label>
                        <input type="text" class="form-control" id="last_name" value="${cliente.user.last_name}" required>
                        <div class="invalid-feedback">Por favor, insira um sobrenome válido</div>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">CPF</label>
                    <input type="text" class="form-control" value="${cliente.cpf}" disabled>
                    <small class="text-muted">O CPF não pode ser alterado</small>
                </div>
                <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" id="email" value="${cliente.user.email}" required>
                    <div class="invalid-feedback">Por favor, insira um email válido</div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Endereço</label>
                    <input type="text" class="form-control" id="endereco" value="${cliente.endereco}" required>
                    <div class="invalid-feedback">Por favor, insira um endereço válido</div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Telefone</label>
                    <input type="text" class="form-control" id="telefone" value="${cliente.telefone}" 
                           pattern="\\d{10,11}" required oninput="this.value = this.value.replace(/\\D/g, '')">
                    <div class="invalid-feedback">Por favor, insira um telefone válido (10 ou 11 dígitos)</div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Nova Senha (opcional)</label>
                    <input type="password" class="form-control" id="password" minlength="6">
                    <small class="text-muted">Deixe em branco para manter a senha atual</small>
                    <div class="invalid-feedback">A senha deve ter pelo menos 6 caracteres</div>
                </div>
            </form>
        `;
    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        showMessage('Erro ao carregar dados do perfil', 'danger');
    }
}

async function handleUpdatePerfil(event) {
    event.preventDefault();
    
    const form = event.target;
    if (!form.checkValidity()) {
        event.stopPropagation();
        form.classList.add('was-validated');
        return;
    }

    try {
        const formData = {
            first_name: document.getElementById('first_name').value.trim(),
            last_name: document.getElementById('last_name').value.trim(),
            email: document.getElementById('email').value.trim(),
            endereco: document.getElementById('endereco').value.trim(),
            telefone: document.getElementById('telefone').value.trim(),
        };

        // Só inclui a senha se foi preenchida
        const password = document.getElementById('password').value;
        if (password) {
            formData.password = password;
        }

        const response = await fetchAPI('/perfil/', {
            method: 'PUT',
            body: JSON.stringify(formData),
        });

        showMessage('Perfil atualizado com sucesso!', 'success');
        await updateNavigation(); // Atualiza o nome do usuário na navbar
        loadPerfil(); // Recarrega o perfil para mostrar os dados atualizados
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        showMessage('Erro ao atualizar perfil. Por favor, tente novamente.', 'danger');
    }
}
