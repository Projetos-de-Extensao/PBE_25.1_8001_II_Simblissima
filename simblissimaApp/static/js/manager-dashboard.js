// Manager Dashboard
// Função para formatar o status do pedido
function formatStatus(status) {
    const statusMap = {
        'PENDENTE': 'Pedido Criado - Pendente',
        'AGUARDANDO_PAGAMENTO': 'Aguardando Confirmação do Valor Final',
        'CONFIRMADO': 'Confirmado',
        'EM_TRANSITO': 'Em Trânsito',
        'ENTREGUE': 'Entregue',
        'CANCELADO': 'Cancelado'
    };
    return statusMap[status] || status;
}

async function checkStaffAccess() {
    const user = await getCurrentUser();
    if (!user) {
        showMessage('Por favor, faça login para continuar.', 'warning');
        loadLogin();
        return false;
    }
    
    if (!user.is_staff) {
        console.log('Acesso negado: usuário não é staff');
        showMessage('Acesso negado. Área restrita para gerentes.', 'danger');
        loadHome();
        return false;
    }
    console.log('Acesso staff confirmado');
    return true;
}

async function loadManagerDashboard() {
    try {
        // Remove new order page class if it exists
        document.body.classList.remove('novo-pedido-page');
        
        if (!await checkStaffAccess()) return;
        
        // Para evitar recargas desnecessárias, verifica se já estamos no dashboard
        let dashboardLayout = document.querySelector('.container h2');
        if (dashboardLayout?.textContent === 'Dashboard do Gerente') {
            // Atualiza apenas os dados
            await carregarDadosDashboard();
            await filtrarPedidos();
            return;
        }        const mainContent = document.getElementById('content');
        mainContent.innerHTML = `
        <div class="container-fluid">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="mb-0">
                    <i class="bi bi-speedometer2"></i> Dashboard do Gerente
                </h2>
                <button class="btn btn-outline-secondary" onclick="loadHome()">
                    <i class="bi bi-house-door"></i> Voltar para Home
                </button>
            </div>

            <!-- Cards com estatísticas -->
            <div class="row mb-4" id="statsCards">
                <div class="col-md-3">
                    <div class="card bg-primary text-white shadow-sm">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 class="card-subtitle mb-2 text-white-50">Total de Pedidos</h6>
                                    <h2 class="card-title mb-0" id="totalPedidos">-</h2>
                                </div>
                                <i class="bi bi-box-seam fs-1 opacity-50"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-success text-white shadow-sm">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 class="card-subtitle mb-2 text-white-50">Valor Arrecadado</h6>
                                    <h2 class="card-title mb-0" id="valorTotal">-</h2>
                                </div>
                                <i class="bi bi-cash-coin fs-1 opacity-50"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-info text-white shadow-sm">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 class="card-subtitle mb-2 text-white-50">Tempo Médio de Entrega</h6>
                                    <h2 class="card-title mb-0" id="tempoMedio">-</h2>
                                </div>
                                <i class="bi bi-clock-history fs-1 opacity-50"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-warning text-white shadow-sm">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 class="card-subtitle mb-2 text-white-50">Pedidos Pendentes</h6>
                                    <h2 class="card-title mb-0" id="pedidosPendentes">-</h2>
                                </div>
                                <i class="bi bi-hourglass-split fs-1 opacity-50"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>            <!-- Filtros -->
            <div class="card shadow-sm mb-4">
                <div class="card-body">
                    <h5 class="card-title mb-3">
                        <i class="bi bi-funnel"></i> Filtros e Ordenação
                    </h5>
                    <div class="row g-3">
                        <div class="col-md-4">
                            <label class="form-label" for="statusFilter">Status do Pedido</label>
                            <select class="form-select shadow-sm" id="statusFilter">
                                <option value="">Todos os Status</option>
                                <option value="PENDENTE">🕒 Pendente</option>
                                <option value="AGUARDANDO_PAGAMENTO">💰 Aguardando Pagamento</option>
                                <option value="CONFIRMADO">✅ Confirmado</option>
                                <option value="EM_TRANSITO">🚚 Em Trânsito</option>
                                <option value="ENTREGUE">📦 Entregue</option>
                                <option value="CANCELADO">❌ Cancelado</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label" for="sortOrder">Ordenar por</label>
                            <select class="form-select shadow-sm" id="sortOrder">
                                <option value="data_criacao">Data de Criação</option>
                                <option value="valor_total">Valor dos Produtos</option>
                                <option value="status">Status</option>
                            </select>
                        </div>
                        <div class="col-md-4 d-flex align-items-end">
                            <button class="btn btn-primary w-100 shadow-sm" onclick="aplicarFiltros()">
                                <i class="bi bi-search"></i> Buscar Pedidos
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Lista de Pedidos -->
            <div class="row">
                <div class="col">
                    <div id="listaPedidos" class="list-group">
                        Carregando pedidos...
                    </div>
                </div>
            </div>
        </div>
        `;

        // Carregar dados iniciais
        await carregarDadosDashboard();
        await filtrarPedidos();
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        showMessage('Erro ao carregar dashboard', 'danger');
    }
}

async function carregarDadosDashboard() {
    if (!await checkStaffAccess()) return;
    
    try {
        console.log('Carregando dados do dashboard...');
        const response = await fetchAPI('/pedidos/');
        console.log('Resposta da API:', response);
        
        if (!response || !response.results) {
            throw new Error('Resposta inválida da API');
        }
        
        const pedidos = response.results;
        console.log('Pedidos carregados:', pedidos.length);

        // Total de pedidos
        document.getElementById('totalPedidos').textContent = pedidos.length;

        // Valor total arrecadado (apenas de pedidos entregues)
        const valorTotal = pedidos
            .filter(p => p.status === 'ENTREGUE')
            .reduce((acc, p) => acc + (parseFloat(p.valor_final) || parseFloat(p.valor_total)), 0);
        
        document.getElementById('valorTotal').textContent = `R$ ${valorTotal.toFixed(2)}`;

        // Pedidos pendentes
        const pendentes = pedidos.filter(p => p.status === 'PENDENTE').length;
        document.getElementById('pedidosPendentes').textContent = pendentes;

        // Tempo médio de entrega (para pedidos entregues)
        const pedidosEntregues = pedidos.filter(p => p.status === 'ENTREGUE');

        if (pedidosEntregues.length > 0) {
            const tempoTotal = pedidosEntregues.reduce((acc, p) => {
                try {
                    const criacao = new Date(p.data_criacao);
                    const statusEntrega = p.historico_status
                        .find(s => s.status === 'ENTREGUE');
                        
                    if (!statusEntrega) return acc;

                    const entrega = new Date(statusEntrega.data);
                    const tempoEntrega = entrega - criacao;
                    return acc + tempoEntrega;
                } catch (error) {
                    console.error('Erro ao calcular tempo de entrega do pedido:', p.id, error);
                    return acc;
                }
            }, 0);

            const tempoMedio = tempoTotal / pedidosEntregues.length;
            const horasMedio = Math.floor(tempoMedio / (1000 * 60 * 60));
            const minutosMedio = Math.floor((tempoMedio % (1000 * 60 * 60)) / (1000 * 60));
            
            document.getElementById('tempoMedio').textContent = `${horasMedio}h ${minutosMedio}min`;
        } else {
            document.getElementById('tempoMedio').textContent = 'N/A';
        }
    } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        
        // Limpa os campos em caso de erro
        document.getElementById('totalPedidos').textContent = '0';
        document.getElementById('valorTotal').textContent = 'R$ 0,00';
        document.getElementById('pedidosPendentes').textContent = '0';
        document.getElementById('tempoMedio').textContent = 'N/A';
        
        showMessage('Erro ao carregar estatísticas. Por favor, tente novamente.', 'danger');
    }
}

async function aplicarFiltros() {
    if (!await checkStaffAccess()) return;
    await filtrarPedidos();
}

async function filtrarPedidos() {
    if (!await checkStaffAccess()) return;
    try {
        // Salva os pedidos expandidos
        const expanded = Array.from(document.querySelectorAll('[id^="pedido-content-"]'))
            .filter(div => div.style.display === 'block')
            .map(div => div.id.replace('pedido-content-', ''));

        // Obter os elementos de filtro
        const statusFilterElement = document.getElementById('statusFilter');
        const sortOrderElement = document.getElementById('sortOrder');
        
        // Se os elementos não existirem, aguarda um momento e tenta novamente
        if (!statusFilterElement || !sortOrderElement) {
            console.log('Aguardando elementos de filtro carregarem...');
            await new Promise(resolve => setTimeout(resolve, 100));
            return await filtrarPedidos();
        }
        
        // Construir URL com filtros
        const params = new URLSearchParams();
        if (statusFilterElement.value) {
            params.append('status', statusFilterElement.value);
        }
        const url = `/pedidos/${params.toString() ? '?' + params.toString() : ''}`;
        const response = await fetchAPI(url);
        if (!response || !response.results) {
            throw new Error('Resposta inválida da API');
        }
        const pedidos = response.results;
        if (!pedidos || pedidos.length === 0) {
            document.getElementById('listaPedidos').innerHTML = '<p>Nenhum pedido encontrado.</p>';
            return;
        }

        // Ordenar pedidos
        pedidos.sort((a, b) => {
            if (sortOrderElement.value === 'data_criacao') {
                return new Date(b.data_criacao) - new Date(a.data_criacao);
            } else if (sortOrderElement.value === 'valor_total') {
                return b.valor_total - a.valor_total;
            } else if (sortOrderElement.value === 'status') {
                return a.status.localeCompare(b.status);
            }
            return 0;
        });        const listaPedidos = document.getElementById('listaPedidos');
        listaPedidos.innerHTML = pedidos.map(pedido => `
            <!-- Container do Pedido -->
            <div class="mb-5">
                <!-- Cabeçalho do Pedido -->
                <div class="bg-light p-3 rounded-top border shadow-sm mb-3 pedido-header-clickable" onclick="togglePedidoMinimizado(${pedido.id})" style="cursor:pointer;">
                    <div class="row align-items-center g-3">
                        <div class="col-auto">
                            <span class="badge ${getBadgeClass(pedido.status)} px-3 py-2" style="white-space:nowrap;">${getStatusIcon(pedido.status)}</span>
                        </div>
                        <div class="col-md-2">
                            <strong class="h5 mb-0">Pedido #${pedido.id}</strong>
                        </div>                        <div class="col-md-4 text-center">
                            <span class="text-muted small w-100 text-center d-block" style="vertical-align:middle;">${formatStatus(pedido.status)}</span>
                        </div><div class="col-md-2 d-flex align-items-center justify-content-center" style="white-space:nowrap;">
                            <span class="text-primary fw-bold" style="font-size:1.1rem; white-space:nowrap;">
                                R$&nbsp;${parseFloat(pedido.valor_final || pedido.valor_total).toFixed(2)}
                            </span>
                        </div>
                        <div class="col-md-auto ms-md-auto d-flex align-items-center">
                            <span class="pedido-toggle-arrow" style="font-size:1.2rem;">
                                <i id="pedido-toggle-icon-${pedido.id}" class="bi bi-chevron-down"></i>
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Conteúdo do Pedido -->
                <div id="pedido-content-${pedido.id}" style="display: none;">
                    <div class="card shadow-lg mb-3">
                        <div class="card-body">
                            <!-- Informações e Formulário -->
                            <div class="row g-4 mb-4">
                                <!-- Coluna de Informações -->
                                <div class="col-md-6">
                                    <div class="card h-100 border shadow-sm">
                                        <div class="card-body">
                                            <h5 class="card-title mb-4">Informações do Pedido</h5>
                                            
                                            <div class="d-flex align-items-center mb-3">
                                                <i class="bi bi-person-circle me-2"></i>
                                                <div>
                                                    <small class="text-muted d-block">Cliente</small>
                                                    <strong>${pedido.cliente.user.first_name} ${pedido.cliente.user.last_name}</strong>
                                                </div>
                                            </div>
                                            <div class="d-flex align-items-center mb-3">
                                                <i class="bi bi-calendar-event me-2"></i>
                                                <div>
                                                    <small class="text-muted d-block">Data do Pedido</small>
                                                    <strong>${new Date(pedido.data_criacao).toLocaleString()}</strong>
                                                </div>
                                            </div>
                                            <div class="d-flex align-items-center mb-3">
                                                <i class="bi bi-chat-left-text me-2"></i>
                                                <div>
                                                    <small class="text-muted d-block">Observação</small>
                                                    <strong>${pedido.observacoes ? pedido.observacoes : '<span class=\'text-muted\'>Nenhuma</span>'}</strong>
                                                </div>
                                            </div>
                                            <div class="d-flex align-items-center">
                                                  <div class="pedido-values-container">
                                                    <small class="text-muted pedido-values-label">Valores</small>
                                                    <div class="row g-2 align-items-center justify-content-center">
                                                        <div class="col-6">
                                                            <div class="bg-light rounded p-2 text-center border">
                                                                <span class="text-muted small">Produtos</span><br>
                                                                <span class="fw-bold fs-5">R$ ${pedido.valor_total}</span>
                                                            </div>
                                                        </div>
                                                        <div class="col-6">
                                                            <div class="bg-primary bg-opacity-10 rounded p-2 text-center border">
                                                                <span class="text-muted small">Final</span><br>
                                                                <span class="fw-bold fs-5 text-primary">R$ ${pedido.valor_final || 'Não definido'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- Coluna de Atualização -->
                                <div class="col-md-6">
                                    <div class="card h-100 border shadow-sm">
                                        <div class="card-body">
                                            <h5 class="card-title mb-4">Atualizar Pedido</h5>
                                            <form onsubmit="atualizarPedido(event, ${pedido.id})" class="h-100">                                <div class="mb-4">
                                                <label class="form-label">
                                                    <i class="bi bi-arrow-repeat me-2"></i>Novo Status
                                                </label>
                                                <select class="form-select form-select-lg mb-2" name="status" required>
                                                    <option value="">Selecione o status...</option>
                                                    <option value="PENDENTE">
                                                        <i class="bi bi-hourglass me-2"></i>Pendente
                                                    </option>
                                                    <option value="AGUARDANDO_PAGAMENTO">
                                                        <i class="bi bi-cash me-2"></i>Aguardando Pagamento
                                                    </option>
                                                    <option value="CONFIRMADO">
                                                        <i class="bi bi-check-circle me-2"></i>Confirmado
                                                    </option>
                                                    <option value="EM_TRANSITO">
                                                        <i class="bi bi-truck me-2"></i>Em Trânsito
                                                    </option>
                                                    <option value="ENTREGUE">
                                                        <i class="bi bi-box-seam me-2"></i>Entregue
                                                    </option>
                                                    <option value="CANCELADO">
                                                        <i class="bi bi-x-circle me-2"></i>Cancelado
                                                    </option>
                                                </select>
                                            </div>

                                            <div class="mb-4">
                                                <label class="form-label">
                                                    <i class="bi bi-currency-dollar me-2"></i>Valor Final
                                                </label>
                                                <div class="input-group input-group-lg">
                                                    <span class="input-group-text">R$</span>
                                                    <input type="number" 
                                                           class="form-control" 
                                                           name="valor_final" 
                                                           step="0.01" 
                                                           min="0" 
                                                           value="${pedido.valor_final || pedido.valor_total}"
                                                           required>
                                                </div>
                                                <small class="form-text text-muted">Defina o valor final incluindo frete e taxas</small>
                                            </div>

                                            <div class="mb-4">
                                                <label class="form-label">
                                                    <i class="bi bi-chat-left-text me-2"></i>Comentário
                                                </label>
                                                <textarea class="form-control" 
                                                          name="comentario" 
                                                          rows="3"
                                                          placeholder="Adicione um comentário sobre a atualização..."></textarea>
                                            </div>

                                            <div class="d-grid">
                                                <button type="submit" class="btn btn-primary btn-lg">
                                                    <i class="bi bi-arrow-clockwise me-2"></i>Atualizar Pedido
                                                </button>
                                            </div>
                                        </form></div>
                                </div>            </div>

                            <!-- Itens do Pedido -->
                            <div class="card border mt-4">
                                <div class="card-body">
                                    <h5 class="card-title mb-4">
                                        <i class="bi bi-box-seam me-2"></i>Itens do Pedido
                                    </h5>
                                    <div class="table-responsive">
                                        <table class="table table-hover">
                                            <thead class="table-light">
                                                <tr>
                                                    <th>Descrição</th>                                                    <th class="text-end price-column">Preço</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                ${pedido.itens && pedido.itens.length > 0 ? 
                                                    pedido.itens.map(item => `
                                                        <tr>
                                                            <td>
                                                                <i class="bi bi-cart me-2 text-muted"></i>
                                                                ${item.descricao}
                                                            </td>
                                                            <td class="text-end">R$ ${parseFloat(item.preco).toFixed(2)}</td>
                                                        </tr>
                                                    `).join('') 
                                                    : '<tr><td colspan="2" class="text-center text-muted py-4"><i class="bi bi-inbox me-2"></i>Nenhum item encontrado</td></tr>'}
                                                ${pedido.itens && pedido.itens.length > 0 ? `
                                                    <tr class="table-light fw-bold">
                                                        <td class="text-end">Total dos Produtos:</td>
                                                        <td class="text-end">R$ ${pedido.valor_total}</td>
                                                    </tr>` : ''}
                                            </tbody>
                                        </table>
                                    </div>                </div>
                            </div>

                            <!-- Histórico -->
                            <div class="card border mt-4">
                                <div class="card-body">
                                    <h5 class="card-title mb-4">
                                        <i class="bi bi-clock-history me-2"></i>Histórico de Status
                                    </h5>
                                    <div class="list-group">
                                        ${pedido.historico_status.map(status => `
                                            <div class="list-group-item list-group-item-action">
                                                <div class="d-flex w-100 justify-content-between align-items-center mb-1">
                                                    <h6 class="mb-0">
                                                        <span class="badge ${getBadgeClass(status.status)} me-2">
                                                            ${getStatusIcon(status.status)}
                                                        </span>
                                                        ${formatStatus(status.status)}
                                                    </h6>
                                                    <small class="text-muted">
                                                        <i class="bi bi-clock me-1"></i>${new Date(status.data).toLocaleString()}
                                                    </small>
                                                </div>
                                                ${status.comentario ? `
                                                    <p class="mb-0 mt-2 ps-4 text-muted">
                                                        <i class="bi bi-chat-left-text me-2"></i>${status.comentario}
                                                    </p>` : ''}
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Divisor entre pedidos -->
                <div class="d-flex align-items-center my-5">                   
                    <div class="mx-4"></div>
                    <div class="border-bottom flex-grow-1"></div>
                </div>
            </div>
        `).join('');
        // Restaura os pedidos expandidos
        expanded.forEach(id => {
            const content = document.getElementById('pedido-content-' + id);
            const icon = document.getElementById('pedido-toggle-icon-' + id);
            if (content && icon) {
                content.style.display = 'block';
                icon.classList.remove('bi-chevron-down');
                icon.classList.add('bi-chevron-up');
            }
        });
    } catch (error) {
        console.error('Erro ao filtrar pedidos:', error);
        showMessage('Erro ao carregar pedidos', 'danger');
    }
}

async function atualizarPedido(event, pedidoId) {
    event.preventDefault();
    if (!await checkStaffAccess()) return;
    
    const form = event.target;
    
    try {
        const novoStatus = form.status.value;
        const valorFinal = parseFloat(form.valor_final.value);
        const comentario = form.comentario.value;

        const updateButton = form.querySelector('button[type="submit"]');
        const originalText = updateButton.textContent;
        updateButton.textContent = 'Atualizando...';
        updateButton.disabled = true;

        // Primeiro atualiza o status
        await fetchAPI(`/pedidos/${pedidoId}/update_status/`, {
            method: 'POST',
            body: JSON.stringify({
                status: novoStatus,
                comentario: comentario
            })
        });

        // Depois atualiza o valor final
        await fetchAPI(`/pedidos/${pedidoId}/`, {
            method: 'PATCH',
            body: JSON.stringify({
                valor_final: valorFinal
            })
        });

        showMessage('Pedido atualizado com sucesso! O cliente será notificado das alterações.', 'success');
        
        // Recarrega os dados do dashboard e a lista de pedidos
        await carregarDadosDashboard();
        await filtrarPedidos();

        // Restaura o botão
        updateButton.textContent = originalText;
        updateButton.disabled = false;
    } catch (error) {
        console.error('Erro ao atualizar pedido:', error);
        showMessage('Erro ao atualizar pedido', 'danger');
        
        // Restaura o botão em caso de erro também
        const updateButton = form.querySelector('button[type="submit"]');
        updateButton.textContent = 'Atualizar Pedido';
        updateButton.disabled = false;
    }
}

// Função global para minimizar/maximizar pedidos (corrigida)
window.togglePedidoMinimizado = function(pedidoId) {
    const content = document.getElementById('pedido-content-' + pedidoId);
    const icon = document.getElementById('pedido-toggle-icon-' + pedidoId);
    if (content && icon) {
        if (content.style.display === 'none') {
            content.style.display = 'block';
            icon.classList.remove('bi-chevron-down');
            icon.classList.add('bi-chevron-up');
        } else {
            content.style.display = 'none';
            icon.classList.remove('bi-chevron-up');
            icon.classList.add('bi-chevron-down');
        }
    }
};

// Funções auxiliares para estilização
function getBadgeClass(status) {
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

function getStatusIcon(status) {
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
