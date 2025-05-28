// pedidos.js
let refreshInterval;

async function loadPedidos() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            loadLogin();
            return;
        }

        const content = document.getElementById('content');
        content.innerHTML = `
            <div class="container">
                <div class="row mb-4">
                    <div class="col">
                        <h2>Meus Pedidos</h2>
                        <button class="btn btn-primary" onclick="showNovoPedidoForm()">Novo Pedido</button>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <div id="listaPedidos">
                            Carregando pedidos...
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Start auto-refresh when loading the pedidos view
        startAutoRefresh();
        await carregarPedidos();
    } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        showMessage('Erro ao carregar a página de pedidos', 'danger');
    }
}

function startAutoRefresh() {
    // Clear any existing interval
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
    // Refresh every 30 seconds
    refreshInterval = setInterval(carregarPedidos, 30000);
}

function stopAutoRefresh() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
    }
}

// Update showNovoPedidoForm to stop refresh when creating new order
function showNovoPedidoForm() {
    stopAutoRefresh();
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="container">
            <h2>Novo Pedido</h2>
            <form id="novoPedidoForm">
                <div class="mb-3">
                    <label for="observacoes" class="form-label">Observações</label>
                    <textarea class="form-control" id="observacoes" rows="3"></textarea>
                </div>

                <div id="itensPedido">
                    <h3>Itens do Pedido</h3>
                    <div class="itens-list"></div>
                    <button type="button" class="btn btn-secondary mb-3" onclick="adicionarItem()">
                        Adicionar Item
                    </button>
                </div>

                <div class="mb-3">
                    <label for="metodoPagamento" class="form-label">Método de Pagamento</label>
                    <select class="form-control" id="metodoPagamento">
                        <option value="PIX">Pix</option>
                        <option value="CARTAO">Cartão</option>
                        <option value="BOLETO">Boleto</option>
                    </select>
                </div>

                <button type="submit" class="btn btn-primary">Criar Pedido</button>
                <button type="button" class="btn btn-secondary" onclick="loadPedidos()">Cancelar</button>
            </form>
        </div>
    `;

    document.getElementById('novoPedidoForm').addEventListener('submit', criarPedido);
    adicionarItem(); // Adiciona o primeiro item automaticamente
}

function adicionarItem() {
    const itemsList = document.querySelector('#itensPedido .itens-list');
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item-pedido mb-3 p-3 border rounded';
    itemDiv.innerHTML = `
        <div class="mb-2">
            <label class="form-label">Descrição</label>
            <textarea class="form-control item-descricao" rows="2"></textarea>
        </div>
        <div class="mb-2">
            <label class="form-label">Preço</label>
            <input type="number" class="form-control item-preco" step="0.01" min="0">
        </div>
        <button type="button" class="btn btn-danger btn-sm" onclick="this.parentElement.remove()">
            Remover Item
        </button>
    `;
    itemsList.appendChild(itemDiv);
}

async function criarPedido(event) {
    event.preventDefault();

    const itens = [];
    document.querySelectorAll('.item-pedido').forEach(itemDiv => {
        const descricao = itemDiv.querySelector('.item-descricao').value;
        const preco = parseFloat(itemDiv.querySelector('.item-preco').value);
        
        if (descricao && !isNaN(preco)) {
            itens.push({
                descricao: descricao,
                preco: preco
            });
        }
    });

    if (itens.length === 0) {
        showMessage('Adicione pelo menos um item ao pedido', 'danger');
        return;
    }

    const pedidoData = {
        observacoes: document.getElementById('observacoes').value,
        metodo_pagamento: document.getElementById('metodoPagamento').value,
        itens: itens
    };

    try {
        console.log('Enviando dados do pedido:', JSON.stringify(pedidoData));
        
        // Usar XMLHttpRequest para obter o texto completo do erro
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${API_BASE_URL}/pedidos/`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
        xhr.withCredentials = true;
        
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                console.log('Resposta do servidor:', xhr.responseText);
                showMessage('Pedido criado com sucesso!', 'success');
                loadPedidos();
            } else {
                console.error('Erro do servidor:', xhr.status, xhr.responseText);
                let errorMsg = 'Erro ao criar pedido';
                try {
                    const errorData = JSON.parse(xhr.responseText);
                    errorMsg = JSON.stringify(errorData);
                } catch (e) {
                    errorMsg = xhr.responseText || errorMsg;
                }
                showMessage(`Erro ao criar pedido: ${errorMsg}`, 'danger');
            }
        };
        
        xhr.onerror = function() {
            console.error('Erro na requisição');
            showMessage('Erro na comunicação com o servidor', 'danger');
        };
        
        xhr.send(JSON.stringify(pedidoData));
    } catch (error) {
        console.error('Erro ao criar pedido:', error);
        showMessage(`Erro ao criar pedido: ${error.message}`, 'danger');
    }
}

async function carregarPedidos() {
    try {
        // Obter o usuário atual
        const user = await getCurrentUser();
        if (!user) {
            showMessage('Usuário não autenticado', 'danger');
            return;
        }
        
        // Buscar apenas os pedidos do usuário atual usando um parâmetro de filtro
        const data = await fetchAPI(`/pedidos/?cliente=${user.id}`);
        const listaPedidos = document.getElementById('listaPedidos');
        
        if (data.results && data.results.length > 0) {
            listaPedidos.innerHTML = `
                <div class="list-group">
                    ${data.results.map(pedido => `
                        <div class="list-group-item">
                            <div class="d-flex w-100 justify-content-between">
                                <h5 class="mb-1">Pedido #${pedido.id}</h5>
                                <small>${new Date(pedido.data_criacao).toLocaleDateString()}</small>
                            </div>
                            <p class="mb-1">Status: ${pedido.status}</p>
                            <p class="mb-1">Valor Total: R$ ${pedido.valor_total}</p>
                            ${pedido.metodo_pagamento ? 
                                `<p class="mb-1">Método de Pagamento: ${pedido.metodo_pagamento}</p>` : ''}
                            ${pedido.observacoes ? 
                                `<p class="mb-1">Observações: ${pedido.observacoes}</p>` : ''}
                            <div class="mt-2">
                                <button class="btn btn-sm btn-info" onclick="verDetalhesPedido(${pedido.id})">
                                    Ver Detalhes
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            listaPedidos.innerHTML = '<p>Nenhum pedido encontrado.</p>';
        }
    } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        showMessage('Erro ao carregar pedidos', 'danger');
    }
}

async function verDetalhesPedido(pedidoId) {
    try {
        const pedido = await fetchAPI(`/pedidos/${pedidoId}/`);
        const content = document.getElementById('content');
        
        content.innerHTML = `
            <div class="container">
                <h2>Detalhes do Pedido #${pedido.id}</h2>
                <div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title">Informações Gerais</h5>
                        <p>Status: <span id="statusPedido">${pedido.status}</span></p>
                        <p>Data de Criação: ${new Date(pedido.data_criacao).toLocaleString()}</p>
                        <p>Valor Total: R$ <span id="valorPedido">${pedido.valor_final || pedido.valor_total}</span></p>
                        <p>Método de Pagamento: ${pedido.metodo_pagamento || 'Não definido'}</p>
                        ${pedido.observacoes ? `<p>Observações: ${pedido.observacoes}</p>` : ''}
                    </div>
                </div>

                <div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title">Itens do Pedido</h5>
                        <div class="list-group">
                            ${pedido.itens.map(item => `
                                <div class="list-group-item">
                                    <div class="d-flex w-100 justify-content-between">
                                        <h6 class="mb-1">${item.descricao}</h6>
                                        <span>R$ ${item.preco}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                ${pedido.status === 'AGUARDANDO_PAGAMENTO' && pedido.valor_final ? `
                <div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title">Confirmação de Valor Final</h5>
                        <p>O gerente definiu um valor final para seu pedido:</p>
                        <p class="h4 mb-3">R$ ${pedido.valor_final}</p>
                        <div class="d-flex gap-2">
                            <button class="btn btn-success" onclick="confirmarValorFinal(${pedido.id})">
                                Confirmar Valor
                            </button>
                            <button class="btn btn-danger" onclick="recusarValorFinal(${pedido.id})">
                                Recusar Valor
                            </button>
                        </div>
                    </div>
                </div>
                ` : ''}

                <div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title">Histórico de Status</h5>
                        <div class="list-group" id="historicoStatus">
                            ${pedido.historico_status.map(status => `
                                <div class="list-group-item">
                                    <div class="d-flex w-100 justify-content-between">
                                        <h6 class="mb-1">${status.status}</h6>
                                        <small>${new Date(status.data).toLocaleString()}</small>
                                    </div>
                                    ${status.comentario ? `<p class="mb-1">${status.comentario}</p>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <button class="btn btn-primary" onclick="loadPedidos()">Voltar</button>
            </div>
        `;

        // Set up auto-refresh for order details
        startDetailAutoRefresh(pedidoId);
    } catch (error) {
        showMessage('Erro ao carregar detalhes do pedido', 'danger');
    }
}

async function refreshOrderDetails(pedidoId) {
    try {
        const pedido = await fetchAPI(`/pedidos/${pedidoId}/`);
        
        // Update status and price
        document.getElementById('statusPedido').textContent = pedido.status;
        document.getElementById('valorPedido').textContent = pedido.valor_final || pedido.valor_total;

        // Update history
        const historicoStatus = document.getElementById('historicoStatus');
        historicoStatus.innerHTML = pedido.historico_status.map(status => `
            <div class="list-group-item">
                <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1">${status.status}</h6>
                    <small>${new Date(status.data).toLocaleString()}</small>
                </div>
                ${status.comentario ? `<p class="mb-1">${status.comentario}</p>` : ''}
            </div>
        `).join('');

        // Notify user of changes
        const latestStatus = pedido.historico_status[pedido.historico_status.length - 1];
        showMessage(`Pedido atualizado! Novo status: ${latestStatus.status}`, 'info');
    } catch (error) {
        console.error('Erro ao atualizar detalhes do pedido:', error);
    }
}

function startDetailAutoRefresh(pedidoId) {
    // Clear any existing interval
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
    // Refresh every 15 seconds for order details
    refreshInterval = setInterval(() => refreshOrderDetails(pedidoId), 15000);
}

// Stop auto-refresh when leaving the page
window.addEventListener('beforeunload', stopAutoRefresh);

async function confirmarValorFinal(pedidoId) {
    try {
        const button = event.target;
        button.disabled = true;
        button.textContent = 'Processando...';

        // Update status to CONFIRMADO
        await fetchAPI(`/pedidos/${pedidoId}/update_status/`, {
            method: 'POST',
            body: JSON.stringify({
                status: 'CONFIRMADO',
                comentario: 'Valor final confirmado pelo cliente'
            })
        });

        showMessage('Valor final confirmado! O pedido foi confirmado.', 'success');
        verDetalhesPedido(pedidoId); // Recarrega a página de detalhes
    } catch (error) {
        console.error('Erro ao confirmar valor final:', error);
        showMessage('Erro ao confirmar valor final', 'danger');
        button.disabled = false;
        button.textContent = 'Confirmar Valor';
    }
}

async function recusarValorFinal(pedidoId) {
    try {
        const motivo = prompt('Por favor, informe o motivo da recusa do valor:');
        if (!motivo) return; // Se cancelar o prompt, não faz nada

        const button = event.target;
        button.disabled = true;
        button.textContent = 'Processando...';

        // Atualiza o status do pedido para PENDENTE e adiciona o comentário
        await fetchAPI(`/pedidos/${pedidoId}/update_status/`, {
            method: 'POST',
            body: JSON.stringify({
                status: 'PENDENTE',
                comentario: `Valor final recusado. Motivo: ${motivo}`
            })
        });

        showMessage('Valor final recusado. O gerente será notificado.', 'info');
        verDetalhesPedido(pedidoId); // Recarrega a página de detalhes
    } catch (error) {
        console.error('Erro ao recusar valor final:', error);
        showMessage('Erro ao recusar valor final', 'danger');
        button.disabled = false;
        button.textContent = 'Recusar Valor';
    }
}