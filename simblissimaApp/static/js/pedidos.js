// pedidos.js
let refreshInterval;

// Função para formatar o status do pedido
function formatStatus(status) {
    const statusMap = {
        'PENDENTE': 'Pendente',
        'AGUARDANDO_PAGAMENTO': 'Aguardando Pagamento',
        'CONFIRMADO': 'Confirmado',
        'EM_TRANSITO': 'Em Trânsito',
        'ENTREGUE': 'Entregue',
        'CANCELADO': 'Cancelado'
    };
    return statusMap[status] || status;
}

async function loadPedidos() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            loadLogin();
            return;
        }

        // Se for staff, redireciona para o dashboard
        if (user.is_staff) {
            loadManagerDashboard();
            return;
        }
        
        const content = document.getElementById('content');
        // Só monta o layout se ainda não estiver presente
        if (!document.getElementById('listaPedidos')) {
            content.innerHTML = `
                <div class="pedidos-container">
                    <div class="pedidos-content">
                        <div class="row justify-content-center">
                            <div class="col-md-8">
                                <div class="card">
                                    <div class="card-header d-flex justify-content-between align-items-center">
                                        <h3 class="mb-0">Meus Pedidos</h3>
                                        <div class="pedidos-button-container">
                                            <button class="btn btn-primary me-2" onclick="novoPedido()">Novo Pedido</button>
                                            <button class="btn btn-secondary" onclick="loadHome()">Voltar</button>
                                        </div>
                                    </div>
                                    <div class="card-body">
                                        <div id="listaPedidos" class="text-center">
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
        }
        atualizarListaPedidos();
        // Start auto-refresh when loading the pedidos view
        startAutoRefresh();
    } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        showMessage('Erro ao carregar a página de pedidos', 'danger');
    }
}

function startAutoRefresh() {    // Clear any existing interval
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
    // Refresh every 30 seconds
    refreshInterval = setInterval(atualizarListaPedidos, 30000);
}

function stopAutoRefresh() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
}

// Nova função: só atualiza a lista, sem checar usuário nem mexer no layout
async function atualizarListaPedidos() {
    try {
        // Salva os pedidos expandidos
        const expanded = Array.from(document.querySelectorAll('[id^="pedido-content-usuario-"]'))
            .filter(div => div.classList.contains('pedido-content-visible'))
            .map(div => div.id.replace('pedido-content-usuario-', ''));
        // Busca o usuário só para pegar o id, mas não faz redirecionamento
        const user = await getCurrentUser();
        if (!user || user.is_staff) return;
        const data = await fetchAPI(`/pedidos/?cliente=${user.id}`);
        const listaPedidos = document.getElementById('listaPedidos');
        if (!listaPedidos) return;
        if (data.results && data.results.length > 0) {
            listaPedidos.innerHTML = data.results.map(pedido => `
                <div class="card shadow-sm mb-4 w-100" style="max-width:100%;">
                    <div class="card-body p-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 pedido-header-clickable" onclick="togglePedidoMinimizadoUsuario(${pedido.id})" style="cursor:pointer;">
                        <div class="d-flex flex-column flex-md-row align-items-md-center gap-3 w-100">
                            <div class="d-flex align-items-center gap-2">
                                <span class="badge ${getBadgeClassUsuario(pedido.status)} px-3 py-2">
                                    ${getStatusIconUsuario(pedido.status)}
                                </span>
                                <span class="fw-bold text-center text-md-start">Pedido #${pedido.id}</span>
                            </div>
                            <span class="text-muted small text-center text-md-start">${new Date(pedido.data_criacao).toLocaleDateString()}</span>
                        </div>
                        <div class="d-flex flex-column flex-md-row align-items-md-center gap-2 w-100 justify-content-md-end flex-grow-1" style="min-width:320px;">
                            <span class="fw-bold text-primary text-center text-md-start me-md-auto" style="white-space:nowrap;">R$&nbsp;${parseFloat(pedido.valor_final || pedido.valor_total).toFixed(2)}</span>
                            <span class="text-muted small w-100 text-center d-block" style="vertical-align:middle;">${formatStatus(pedido.status)}</span>
                            <span class="mx-auto mx-md-0 pedido-toggle-arrow" style="font-size:1.2rem;">
                                <i id="pedido-toggle-icon-usuario-${pedido.id}" class="bi bi-chevron-down"></i>
                            </span>
                        </div>
                    </div>
                    <div id="pedido-content-usuario-${pedido.id}" class="pedido-content-hidden">
                        <div class="p-3">
                            <div class="mb-2">
                                <strong class="text-center text-md-start d-block">Itens:</strong>
                                <ul class="list-unstyled mb-2">
                                    ${pedido.itens && pedido.itens.length > 0 ? pedido.itens.map(item => `
                                        <li class="d-flex justify-content-between border-bottom py-1">
                                            <span class="text-center text-md-start">${item.descricao}</span>
                                            <span class="text-end w-25">R$ ${parseFloat(item.preco).toFixed(2)}</span>
                                        </li>
                                    `).join('') : '<li class="text-muted text-center">Nenhum item</li>'}
                                </ul>
                            </div>
                            <div class="mb-2 text-center text-md-start">
                                <strong>Status:</strong> ${formatStatus(pedido.status)}
                            </div>
                            <div class="mb-2 text-center text-md-start">
                                <strong>Última atualização:</strong> ${new Date(pedido.historico_status && pedido.historico_status.length > 0 ? pedido.historico_status[pedido.historico_status.length - 1].data : pedido.data_criacao).toLocaleString()}
                            </div>
                            <div class="mb-2 text-center text-md-start">
                                <strong>Observação:</strong> ${pedido.observacoes ? pedido.observacoes : '<span class=\'text-muted\'>Nenhuma</span>'}
                            </div>
                            <div class="mb-2 text-center text-md-start">
                                <strong>Pagamento:</strong> ${pedido.metodo_pagamento || 'Não definido'}
                            </div>
                            <div class="mb-2 text-center text-md-start">
                                <strong>Histórico:</strong>
                                <ul class="list-unstyled mb-0">
                                    ${pedido.historico_status && pedido.historico_status.length > 0 ? pedido.historico_status.filter(status => !(status.comentario && (status.comentario.trim() === 'Valor final confirmado pelo cliente' || status.comentario.trim() === 'Pedido criado'))).map(status => `
                                        <li class="small text-muted historico-status-item">
                                            ${getStatusIconUsuario(status.status)} ${formatStatus(status.status)} - ${new Date(status.data).toLocaleString()}
                                        </li>
                                    `).join('') : '<li class="text-muted text-center">Sem histórico</li>'}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');            // Restaura os pedidos expandidos
            expanded.forEach(id => {
                const content = document.getElementById('pedido-content-usuario-' + id);
                const icon = document.getElementById('pedido-toggle-icon-usuario-' + id);
                if (content && icon) {
                    content.classList.remove('pedido-content-hidden');
                    content.classList.add('pedido-content-visible');
                    icon.classList.remove('bi-chevron-down');
                    icon.classList.add('bi-chevron-up');
                }
            });
        } else {
            listaPedidos.innerHTML = '<p class="text-center">Nenhum pedido encontrado.</p>';
        }
    } catch (error) {
        // Não mostra erro para o usuário no auto-refresh
        console.error('Erro ao atualizar lista de pedidos:', error);
    }
}

// Função para criar um novo pedido
function novoPedido() {
    const content = document.getElementById('content');    content.innerHTML = `        <div class="order-detail-container">
            <div class="order-list">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h3 class="mb-0">Novo Pedido</h3>
                        <div>
                            <button type="submit" form="novoPedidoForm" class="btn btn-primary me-2">Salvar Pedido</button>
                            <button type="button" class="btn btn-secondary" onclick="loadPedidos()">Cancelar</button>
                        </div>
                    </div>
                    <div class="card-body">
                        <form id="novoPedidoForm" onsubmit="handleNovoPedido(event)" class="needs-validation" novalidate>
                            <div id="itensPedido">
                                <h5>Itens do Pedido</h5>
                                <div class="itens-list"></div>
                                <button type="button" class="btn btn-secondary btn-sm mt-2" onclick="adicionarItem()">Adicionar Item</button>
                            </div>
                            <div class="mb-3 mt-3">
                                <label class="form-label">Observações</label>
                                <textarea class="form-control" id="observacoes" rows="2"></textarea>
                            </div>
                            <div class="mb-3">
                                <label for="formaPagamento" class="form-label">Forma de Pagamento</label>
                                <select class="form-select" id="formaPagamento" name="formaPagamento" required>
                                    <option value="">Selecione...</option>
                                    <option value="Dinheiro">Dinheiro</option>
                                    <option value="Cartão de Crédito">Cartão de Crédito</option>
                                    <option value="Cartão de Débito">Cartão de Débito</option>
                                    <option value="Pix">Pix</option>
                                </select>
                                <div class="invalid-feedback">Escolha a forma de pagamento</div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Função para adicionar item ao pedido
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

// Função para salvar novo pedido
async function handleNovoPedido(event) {
    event.preventDefault();
    const form = event.target;
    if (!form.checkValidity()) {
        event.stopPropagation();
        form.classList.add('was-validated');
        return;
    }
    const itens = Array.from(document.querySelectorAll('.item-pedido')).map(item => ({
        descricao: item.querySelector('.item-descricao').value.trim(),
        preco: parseFloat(item.querySelector('.item-preco').value)
    })).filter(item => item.descricao && !isNaN(item.preco));
    const observacoes = document.getElementById('observacoes').value.trim();
    const formaPagamento = document.getElementById('formaPagamento').value;
    try {
        await fetchAPI('/pedidos/', {
            method: 'POST',
            body: JSON.stringify({ itens, observacoes, formaPagamento })
        });
        showMessage('Pedido criado com sucesso!', 'success');
        loadPedidos();
    } catch (error) {
        showMessage('Erro ao criar pedido. Tente novamente.', 'danger');
    }
}

// Remove função carregarPedidos() pois está duplicada com atualizarListaPedidos()

// Atualiza só a lista de pedidos
async function atualizarListaPedidos() {
    try {
        // Salva os pedidos expandidos
        const expanded = Array.from(document.querySelectorAll('[id^="pedido-content-usuario-"]'))
            .filter(div => div.classList.contains('pedido-content-visible'))
            .map(div => div.id.replace('pedido-content-usuario-', ''));
        // Busca o usuário só para pegar o id, mas não faz redirecionamento
        const user = await getCurrentUser();
        if (!user || user.is_staff) return;
        const data = await fetchAPI(`/pedidos/?cliente=${user.id}`);
        const listaPedidos = document.getElementById('listaPedidos');

        if (data.results && data.results.length > 0) {
            listaPedidos.innerHTML = data.results.map(pedido => `
                <div class="card shadow-sm mb-4 w-100" style="max-width:100%;">
                    <div class="card-body p-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 pedido-header-clickable" onclick="togglePedidoMinimizadoUsuario(${pedido.id})" style="cursor:pointer;">
                        <div class="d-flex flex-column flex-md-row align-items-md-center gap-3 w-100">
                            <div class="d-flex align-items-center gap-2">
                                <span class="badge ${getBadgeClassUsuario(pedido.status)} px-3 py-2">
                                    ${getStatusIconUsuario(pedido.status)}
                                </span>
                                <span class="fw-bold text-center text-md-start">Pedido #${pedido.id}</span>
                            </div>
                            <span class="text-muted small text-center text-md-start">${new Date(pedido.data_criacao).toLocaleDateString()}</span>
                        </div>
                        <div class="d-flex flex-column flex-md-row align-items-md-center gap-2 w-100 justify-content-md-end flex-grow-1" style="min-width:320px;">
                            <span class="fw-bold text-primary text-center text-md-start me-md-auto" style="white-space:nowrap;">R$&nbsp;${parseFloat(pedido.valor_final || pedido.valor_total).toFixed(2)}</span>
                            <span class="text-muted small w-100 text-center d-block" style="vertical-align:middle;">${formatStatus(pedido.status)}</span>
                            <span class="mx-auto mx-md-0 pedido-toggle-arrow" style="font-size:1.2rem;">
                                <i id="pedido-toggle-icon-usuario-${pedido.id}" class="bi bi-chevron-down"></i>
                            </span>
                        </div>
                    </div>
                    <div id="pedido-content-usuario-${pedido.id}" class="pedido-content-hidden">
                        <div class="p-3">
                            <div class="mb-2">
                                <strong class="text-center text-md-start d-block">Itens:</strong>
                                <ul class="list-unstyled mb-2">
                                    ${pedido.itens && pedido.itens.length > 0 ? pedido.itens.map(item => `
                                        <li class="d-flex justify-content-between border-bottom py-1">
                                            <span class="text-center text-md-start">${item.descricao}</span>
                                            <span class="text-end w-25">R$ ${parseFloat(item.preco).toFixed(2)}</span>
                                        </li>
                                    `).join('') : '<li class="text-muted text-center">Nenhum item</li>'}
                                </ul>
                            </div>
                            <div class="mb-2 text-center text-md-start">
                                <strong>Status:</strong> ${formatStatus(pedido.status)}
                            </div>
                            <div class="mb-2 text-center text-md-start">
                                <strong>Última atualização:</strong> ${new Date(pedido.historico_status && pedido.historico_status.length > 0 ? pedido.historico_status[pedido.historico_status.length - 1].data : pedido.data_criacao).toLocaleString()}
                            </div>
                            <div class="mb-2 text-center text-md-start">
                                <strong>Observação:</strong> ${pedido.observacoes ? pedido.observacoes : '<span class=\'text-muted\'>Nenhuma</span>'}
                            </div>
                            <div class="mb-2 text-center text-md-start">
                                <strong>Pagamento:</strong> ${pedido.metodo_pagamento || 'Não definido'}
                            </div>
                            <div class="mb-2 text-center text-md-start">
                                <strong>Histórico:</strong>
                                <ul class="list-unstyled mb-0">
                                    ${pedido.historico_status && pedido.historico_status.length > 0 ? pedido.historico_status.filter(status => !(status.comentario && (status.comentario.trim() === 'Valor final confirmado pelo cliente' || status.comentario.trim() === 'Pedido criado'))).map(status => `
                                        <li class="small text-muted historico-status-item">
                                            ${getStatusIconUsuario(status.status)} ${formatStatus(status.status)} - ${new Date(status.data).toLocaleString()}
                                        </li>
                                    `).join('') : '<li class="text-muted text-center">Sem histórico</li>'}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            listaPedidos.innerHTML = '<p class="text-center">Nenhum pedido encontrado.</p>';
        }
    } catch (error) {
        // Apenas loga no console, não mostra mensagem para o usuário
        console.error('Erro ao carregar pedidos:', error);
    }
}

// Função global para minimizar/maximizar pedidos do usuário
window.togglePedidoMinimizadoUsuario = function(pedidoId) {
    const content = document.getElementById('pedido-content-usuario-' + pedidoId);
    const icon = document.getElementById('pedido-toggle-icon-usuario-' + pedidoId);
    if (content && icon) {
        if (content.classList.contains('pedido-content-visible')) {
            content.classList.remove('pedido-content-visible');
            content.classList.add('pedido-content-hidden');
            icon.classList.remove('bi-chevron-up');
            icon.classList.add('bi-chevron-down');
        } else {
            content.classList.remove('pedido-content-hidden');
            content.classList.add('pedido-content-visible');
            icon.classList.remove('bi-chevron-down');
            icon.classList.add('bi-chevron-up');
        }
    }
};

// Funções auxiliares para estilização do usuário
function getBadgeClassUsuario(status) {
    const statusClasses = {
        'PENDENTE': 'bg-warning',
        'AGUARDANDO_PAGAMENTO': 'bg-info',
        'CONFIRMADO': 'bg-primary',
        'EM_TRANSITO': 'bg-info',
        'ENTREGUE': 'bg-success',
        'CANCELADO': 'bg-danger'
    };
    return statusClasses[status] || 'bg-secondary';
}

function getStatusIconUsuario(status) {
    const statusIcons = {
        'PENDENTE': '🕒',
        'AGUARDANDO_PAGAMENTO': '💰',
        'CONFIRMADO': '✅',
        'EM_TRANSITO': '🚚',
        'ENTREGUE': '📦',
        'CANCELADO': '❌'
    };
    return statusIcons[status] || '⚪';
}

async function verDetalhesPedido(pedidoId) {
    try {
        const pedido = await fetchAPI(`/pedidos/${pedidoId}/`);
        const content = document.getElementById('content');
        content.innerHTML = `            <div class="d-flex justify-content-center align-items-start" style="min-height: 350px">
                <div style="max-width: 800px; width: 100%; margin: 30px 0 0 0;">
                    <div class="card mb-4">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h3 class="mb-0">Detalhes do Pedido #${pedido.id}</h3>
                            <button class="btn btn-secondary" onclick="loadPedidos()">Voltar</button>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">Informações Gerais</h5>
                            <p>Status: <span id="statusPedido">${formatStatus(pedido.status)}</span></p>
                            <p>Data de Criação: ${new Date(pedido.data_criacao).toLocaleString()}</p>
                            <p>Valor dos Produtos: R$ <span id="valorPedido">${pedido.valor_total}</span></p>
                            ${pedido.valor_final ? `<p>Valor Final: R$ ${pedido.valor_final}</p>` : ''}
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
                                            <h6 class="mb-1">${formatStatus(status.status)}</h6>
                                            <small>${new Date(status.data).toLocaleString()}</small>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
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
        document.getElementById('statusPedido').textContent = formatStatus(pedido.status);
        document.getElementById('valorPedido').textContent = pedido.valor_final || pedido.valor_total;

        // Update history
        const historicoStatus = document.getElementById('historicoStatus');
        historicoStatus.innerHTML = pedido.historico_status.map(status => `
            <div class="list-group-item">
                <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1">${formatStatus(status.status)}</h6>
                    <small>${new Date(status.data).toLocaleString()}</small>
                </div>
            </div>
        `).join('');

        // Notify user of changes
        const latestStatus = pedido.historico_status[pedido.historico_status.length - 1];
        showMessage(`Pedido atualizado! Novo status: ${formatStatus(latestStatus.status)}`, 'info');
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