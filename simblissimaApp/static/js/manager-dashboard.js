// Manager Dashboard
async function loadManagerDashboard() {
    try {
        const user = await getCurrentUser();
        if (!user || !user.is_staff) {
            showMessage('Acesso negado. Área restrita para gerentes.', 'danger');
            loadLogin();
            return;
        }        const mainContent = document.getElementById('content');
        
        // Para evitar recargas desnecessárias, verifica se já estamos no dashboard
        let dashboardLayout = document.querySelector('.container h2');
        if (dashboardLayout?.textContent === 'Dashboard do Gerente') {
            // Atualiza apenas os dados
            await carregarDadosDashboard();
            await filtrarPedidos();
            return;
        }

        mainContent.innerHTML = `
            <button class="btn btn-secondary mb-3" onclick="loadHome()">&larr; Voltar para Home</button>
            <div class="container">
                <h2>Dashboard do Gerente</h2>
                <!-- Cards com estatísticas -->
                <div class="row mb-4" id="statsCards">
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">Total de Pedidos</h5>
                                <p class="card-text" id="totalPedidos">Carregando...</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">Valor Total Arrecadado</h5>
                                <p class="card-text" id="valorTotal">Carregando...</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">Tempo Médio de Entrega</h5>
                                <p class="card-text" id="tempoMedio">Carregando...</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">Pedidos Pendentes</h5>
                                <p class="card-text" id="pedidosPendentes">Carregando...</p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Filtros -->
                <div class="row mb-4">
                    <div class="col-md-4">
                        <div class="input-group">
                            <label class="input-group-text" for="statusFilter">Status</label>
                            <select class="form-select" id="statusFilter">
                                <option value="">Todos</option>
                                <option value="PENDENTE">Pendente</option>
                                <option value="AGUARDANDO_PAGAMENTO">Aguardando Pagamento</option>
                                <option value="CONFIRMADO">Confirmado</option>
                                <option value="EM_TRANSITO">Em Trânsito</option>
                                <option value="ENTREGUE">Entregue</option>
                                <option value="CANCELADO">Cancelado</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="input-group">
                            <label class="input-group-text" for="sortOrder">Ordenar por</label>
                            <select class="form-select" id="sortOrder">
                                <option value="data_criacao">Data de Criação</option>
                                <option value="valor_total">Valor dos Produtos</option>
                                <option value="status">Status</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <button class="btn btn-primary w-100" onclick="aplicarFiltros()">
                            Aplicar Filtros
                        </button>
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
        showMessage('Erro ao carregar o dashboard', 'danger');
    }
}

async function carregarDadosDashboard() {
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
        console.log('Valor total arrecadado:', valorTotal); // Debug log
        document.getElementById('valorTotal').textContent = `R$ ${valorTotal.toFixed(2)}`;

        // Pedidos pendentes
        const pendentes = pedidos.filter(p => p.status === 'PENDENTE').length;
        console.log('Pedidos pendentes:', pendentes); // Debug log
        document.getElementById('pedidosPendentes').textContent = pendentes;        // Tempo médio de entrega (para pedidos entregues)
        const pedidosEntregues = pedidos.filter(p => p.status === 'ENTREGUE');
        console.log('Pedidos entregues:', pedidosEntregues); // Debug log

        if (pedidosEntregues.length > 0) {
            const tempoTotal = pedidosEntregues.reduce((acc, p) => {
                try {
                    const criacao = new Date(p.data_criacao);
                    const statusEntrega = p.historico_status
                        .find(s => s.status === 'ENTREGUE');
                        
                    if (!statusEntrega) {
                        console.log('Status de entrega não encontrado para pedido:', p.id);
                        return acc;
                    }                    const entrega = new Date(statusEntrega.data);
                    const tempoEntrega = entrega - criacao;
                    const horasEntrega = tempoEntrega / (1000 * 60 * 60);
                    console.log(`Tempo de entrega do pedido ${p.id}:`, horasEntrega, 'horas');
                    return acc + tempoEntrega;
                } catch (error) {
                    console.error('Erro ao calcular tempo de entrega do pedido:', p.id, error);
                    return acc;
                }
            }, 0);

            const tempoMedio = tempoTotal / pedidosEntregues.length;
            const horasMedio = Math.floor(tempoMedio / (1000 * 60 * 60));
            const minutosMedio = Math.floor((tempoMedio % (1000 * 60 * 60)) / (1000 * 60));
            
            console.log('Tempo médio de entrega:', horasMedio, 'horas e', minutosMedio, 'minutos'); // Debug log
            document.getElementById('tempoMedio').textContent = `${horasMedio}h ${minutosMedio}min`;
        } else {
            console.log('Nenhum pedido entregue encontrado');
            document.getElementById('tempoMedio').textContent = 'N/A';
        }    } catch (error) {
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
    const filterBtn = document.querySelector('button.btn-primary');
    filterBtn.disabled = true;
    filterBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Filtrando...';
    
    try {
        await filtrarPedidos();
        showMessage('Filtros aplicados com sucesso!', 'success');
    } catch (error) {
        showMessage('Erro ao aplicar filtros', 'danger');
    } finally {
        filterBtn.disabled = false;
        filterBtn.textContent = 'Aplicar Filtros';
    }
}

async function filtrarPedidos() {
    try {
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
        
        const url = `/pedidos/${params.toString() ? '?' + params.toString() : ''}`;        const response = await fetchAPI(url);
        if (!response || !response.results) {
            throw new Error('Resposta inválida da API');
        }                        const pedidos = response.results;
        console.log('Dados dos pedidos:', JSON.stringify(pedidos, null, 2)); // Log mais detalhado dos dados

        if (!pedidos || pedidos.length === 0) {
            document.getElementById('listaPedidos').innerHTML = '<p>Nenhum pedido encontrado.</p>';
            return;
        }        // Ordenar pedidos
        pedidos.sort((a, b) => {
            if (sortOrderElement.value === 'data_criacao') {
                return new Date(b.data_criacao) - new Date(a.data_criacao);
            } else if (sortOrderElement.value === 'valor_total') {
                return b.valor_total - a.valor_total;
            } else if (sortOrderElement.value === 'status') {
                return a.status.localeCompare(b.status);
            }
            return 0;
        });

        const listaPedidos = document.getElementById('listaPedidos');
        listaPedidos.innerHTML = pedidos.map(pedido => `
            <div class="list-group-item">
                <div class="d-flex w-100 justify-content-between mb-2">
                    <h5 class="mb-1">Pedido #${pedido.id}</h5>
                    <small>${new Date(pedido.data_criacao).toLocaleString()}</small>
                </div>
                
                <div class="row">
                    <div class="col-md-6">                        <p><strong>Cliente:</strong> ${pedido.cliente.user.first_name} ${pedido.cliente.user.last_name}</p>
                        <p><strong>Status Atual:</strong> ${pedido.status}</p>
                        <p><strong>Valor dos Produtos:</strong> R$ ${pedido.valor_total}</p>
                        <p><strong>Valor Final:</strong> R$ ${pedido.valor_final || 'Não definido'}</p>
                          <!-- Itens do Pedido -->
                        <div class="mt-2">
                            <h6>Itens do Pedido</h6>
                            <div class="table-responsive">
                                <table class="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>Descrição</th>
                                            <th>Preço</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${pedido.itens && pedido.itens.length > 0 ? 
                                            pedido.itens.map(item => `
                                                <tr>
                                                    <td>${item.descricao}</td>
                                                    <td>R$ ${parseFloat(item.preco).toFixed(2)}</td>
                                                </tr>
                                            `).join('') 
                                            : '<tr><td colspan="2" class="text-center">Nenhum item encontrado</td></tr>'}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <!-- Form de atualização -->
                        <form onsubmit="atualizarPedido(event, ${pedido.id})" class="border p-3 rounded">
                            <div class="mb-3">
                                <label class="form-label">Novo Status:</label>
                                <select class="form-select" name="status" required>
                                    <option value="">Selecione...</option>
                                    <option value="PENDENTE">Pendente</option>
                                    <option value="AGUARDANDO_PAGAMENTO">Aguardando Pagamento</option>
                                    <option value="CONFIRMADO">Confirmado</option>
                                    <option value="EM_TRANSITO">Em Trânsito</option>
                                    <option value="ENTREGUE">Entregue</option>
                                    <option value="CANCELADO">Cancelado</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Valor Final:</label>
                                <input type="number" class="form-control" name="valor_final" step="0.01" min="0" value="${pedido.valor_final || pedido.valor_total}">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Comentário:</label>
                                <textarea class="form-control" name="comentario" rows="2"></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary">Atualizar Pedido</button>
                        </form>
                    </div>
                </div>

                <!-- Histórico de Status -->
                <div class="mt-3">
                    <h6>Histórico de Status</h6>
                    <div class="list-group">
                        ${pedido.historico_status.map(status => `
                            <div class="list-group-item list-group-item-action">
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
        `).join('');

    } catch (error) {
        console.error('Erro ao filtrar pedidos:', error);
        showMessage('Erro ao carregar pedidos', 'danger');
    }
}

async function atualizarPedido(event, pedidoId) {
    event.preventDefault();
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
