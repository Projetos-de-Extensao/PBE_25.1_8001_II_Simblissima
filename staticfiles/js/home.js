// home.js
function loadHome() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="jumbotron">
            <h1 class="display-4">Bem-vindo à Simblissima!</h1>
            <p class="lead">Sistema de gerenciamento de pedidos e produtos.</p>
            <hr class="my-4">
            <p>Utilize o menu acima para navegar pelo sistema.</p>
        </div>
        
        <div class="row mt-4">
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Produtos</h5>
                        <p class="card-text">Gerencie o catálogo de produtos.</p>
                        <button class="btn btn-primary" onclick="loadProdutos()">Ver Produtos</button>
                    </div>
                </div>
            </div>
            
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Pedidos</h5>
                        <p class="card-text">Acompanhe e gerencie os pedidos.</p>
                        <button class="btn btn-primary" onclick="loadPedidos()">Ver Pedidos</button>
                    </div>
                </div>
            </div>
            
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Minha Conta</h5>
                        <p class="card-text">Gerencie suas informações.</p>
                        <button class="btn btn-primary" onclick="loadPerfil()">Ver Perfil</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function loadPerfil() {
    if (!authToken) {
        loadLogin();
        return;
    }

    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h3>Meu Perfil</h3>
                    </div>
                    <div class="card-body">
                        <div id="perfilData">
                            Carregando...
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    fetchAPI('/clientes/').then(data => {
        if (data.results && data.results.length > 0) {
            const cliente = data.results[0];
            const perfilDiv = document.getElementById('perfilData');
            perfilDiv.innerHTML = `
                <div class="mb-3">
                    <strong>Nome:</strong> ${cliente.user.first_name} ${cliente.user.last_name}
                </div>
                <div class="mb-3">
                    <strong>Email:</strong> ${cliente.user.email}
                </div>
                <div class="mb-3">
                    <strong>CPF:</strong> ${cliente.cpf}
                </div>
                <div class="mb-3">
                    <strong>Endereço:</strong> ${cliente.endereco}
                </div>
                <div class="mb-3">
                    <strong>Telefone:</strong> ${cliente.telefone}
                </div>
            `;
        }
    }).catch(error => {
        showMessage('Erro ao carregar perfil', 'danger');
    });
}
