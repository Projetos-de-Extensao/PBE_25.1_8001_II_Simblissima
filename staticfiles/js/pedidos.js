// pedidos.js
const STATUS_CLASSES = {
    'PENDENTE': 'status-pendente',
    'AGUARDANDO_PAGAMENTO': 'status-aguardando',
    'CONFIRMADO': 'status-confirmado',
    'EM_TRANSITO': 'status-transito',
    'ENTREGUE': 'status-entregue',
    'CANCELADO': 'status-cancelado'
};

const STATUS_DISPLAY = {
    'PENDENTE': 'Pendente',
    'AGUARDANDO_PAGAMENTO': 'Aguardando Pagamento',
    'CONFIRMADO': 'Confirmado',
    'EM_TRANSITO': 'Em Trânsito',
    'ENTREGUE': 'Entregue',
    'CANCELADO': 'Cancelado'
};

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
}

function formatPrice(price) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(price);
}

async function loadPedidos() {
    try {
        const pedidos = await fetchAPI('/pedidos/');
        const content = document.getElementById('content');
        
        // Adicionar os estilos específicos da página
        content.innerHTML = `
            <style>
                .pedido-card {
                    border: 1px solid #ddd;
                    padding: 15px;
                    margin-bottom: 15px;
                    border-radius: 12px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    transition: transform 0.3s, box-shadow 0.3s;
                }
                .pedido-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
                }
                .pedido-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                }
                .status {
                    display: inline-block;
                    padding: 5px 10px;
                    border-radius: 8px;
                    font-weight: bold;
                }
                .status-pendente { background-color: #fff3cd; color: #856404; }
                .status-aguardando { background-color: #cce5ff; color: #004085; }
                .status-confirmado { background-color: #d4edda; color: #155724; }
                .status-transito { background-color: #e2e3e5; color: #383d41; }
                .status-entregue { background-color: #d1e7dd; color: #0f5132; }
                .status-cancelado { background-color: #f8d7da; color: #721c24; }
            </style>
            <div class="container">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2>Meus Pedidos</h2>
                    <button class="btn btn-primary" onclick="showNovoPedidoForm()">Novo Pedido</button>
                </div>
                ${pedidos.results.length === 0 ? `
                    <div class="alert alert-info">
                        Você ainda não tem pedidos. Que tal fazer um agora?
                    </div>
                ` : `
                    <div class="pedidos-list">
                        ${pedidos.results.map(pedido => `
                            <div class="pedido-card">
                                <div class="pedido-header">
                                    <h5>Pedido #${pedido.id}</h5>
                                    <span class="status ${STATUS_CLASSES[pedido.status]}">
                                        ${STATUS_DISPLAY[pedido.status]}
                                    </span>
                                </div>
                                <div class="pedido-body">
                                    <p><strong>Data:</strong> ${formatDate(pedido.data_criacao)}</p>
                                    <p><strong>Valor Total:</strong> ${formatPrice(pedido.valor_total)}</p>
                                    ${pedido.valor_final ? `
                                        <p><strong>Valor Final:</strong> ${formatPrice(pedido.valor_final)}</p>
                                    ` : ''}
                                    <div class="mt-3">
                                        <button class="btn btn-info" onclick="viewPedido(${pedido.id})">
                                            Ver Detalhes
                                        </button>
                                        ${pedido.status === 'AGUARDANDO_PAGAMENTO' ? `
                                            <button class="btn btn-success" onclick="confirmarPedido(${pedido.id})">
                                                Confirmar Pedido
                                            </button>
                                            <button class="btn btn-danger" onclick="rejeitarPedido(${pedido.id})">
                                                Rejeitar
                                            </button>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>
        `;
    } catch (error) {
        showMessage('Erro ao carregar pedidos', 'danger');
    }
}

async function viewPedido(id) {
    try {
        const pedido = await fetchAPI(`/pedidos/${id}/`);
        const content = document.getElementById('content');
        
        content.innerHTML = `
            <style>
                .item {
                    border: 1px solid #ddd;
                    padding: 10px;
                    margin-bottom: 10px;
                    border-radius: 4px;
                }
                .status {
                    display: inline-block;
                    padding: 5px 10px;
                    border-radius: 4px;
                    font-weight: bold;
                }
                .valores {
                    text-align: right;
                    font-size: 1.1em;
                    margin: 20px 0;
                }
            </style>
            <div class="container">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2>Pedido #${pedido.id}</h2>
                    <button class="btn btn-secondary" onclick="loadPedidos()">Voltar</button>
                </div>
                
                <div class="card">
                    <div class="card-body">
                        <div class="pedido-info">
                            <p><strong>Cliente:</strong> ${pedido.cliente.user.first_name} ${pedido.cliente.user.last_name}</p>
                            <p><strong>Data:</strong> ${formatDate(pedido.data_criacao)}</p>
                            <p><strong>Status:</strong> 
                                <span class="status ${STATUS_CLASSES[pedido.status]}">
                                    ${STATUS_DISPLAY[pedido.status]}
                                </span>
                            </p>
                        </div>

                        <h4>Itens do Pedido</h4>
                        ${pedido.itens.map(item => `
                            <div class="item">
                                <p>${item.descricao}</p>
                                <p class="text-end"><strong>Valor:</strong> ${formatPrice(item.preco)}</p>
                            </div>
                        `).join('')}

                        <div class="valores">
                            <p><strong>Valor Total:</strong> ${formatPrice(pedido.valor_total)}</p>
                            ${pedido.valor_final ? `
                                <p><strong>Valor Final:</strong> ${formatPrice(pedido.valor_final)}</p>
                            ` : ''}
                        </div>

                        <h4>Histórico de Status</h4>
                        <div class="historico">
                            ${pedido.historico_status.map(status => `
                                <div class="item">
                                    <p><strong>Status:</strong> 
                                        <span class="status ${STATUS_CLASSES[status.status]}">
                                            ${STATUS_DISPLAY[status.status]}
                                        </span>
                                    </p>
                                    <p><strong>Data:</strong> ${formatDate(status.data)}</p>
                                    ${status.comentario ? `<p><strong>Comentário:</strong> ${status.comentario}</p>` : ''}
                                </div>
                            `).join('')}
                        </div>

                        ${pedido.status === 'AGUARDANDO_PAGAMENTO' ? `
                            <div class="mt-4">
                                <button class="btn btn-success" onclick="confirmarPedido(${pedido.id})">
                                    Confirmar Pedido
                                </button>
                                <button class="btn btn-danger" onclick="rejeitarPedido(${pedido.id})">
                                    Rejeitar Pedido
                                </button>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        showMessage('Erro ao carregar detalhes do pedido', 'danger');
    }
}

function showNovoPedidoForm() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="container">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2>Novo Pedido</h2>
                <button class="btn btn-secondary" onclick="loadPedidos()">Voltar</button>
            </div>

            <div class="card">
                <div class="card-body">
                    <form id="novoPedidoForm" onsubmit="handleNovoPedido(event)">
                        <div id="itens">
                            <div class="item-pedido mb-3">
                                <h5>Item 1</h5>
                                <div class="row">
                                    <div class="col-md-8">
                                        <div class="form-group">
                                            <label>Descrição</label>
                                            <textarea name="descricao[]" class="form-control" required></textarea>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label>Preço</label>
                                            <input type="number" name="preco[]" class="form-control" step="0.01" required>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button type="button" class="btn btn-secondary mb-3" onclick="addItemField()">
                            Adicionar Item
                        </button>

                        <div class="text-end">
                            <button type="submit" class="btn btn-primary">Criar Pedido</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}

function addItemField() {
    const itensDiv = document.getElementById('itens');
    const itemCount = itensDiv.children.length + 1;
    
    const newItem = document.createElement('div');
    newItem.className = 'item-pedido mb-3';
    newItem.innerHTML = `
        <h5>Item ${itemCount}</h5>
        <div class="row">
            <div class="col-md-8">
                <div class="form-group">
                    <label>Descrição</label>
                    <textarea name="descricao[]" class="form-control" required></textarea>
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <label>Preço</label>
                    <input type="number" name="preco[]" class="form-control" step="0.01" required>
                </div>
            </div>
        </div>
    `;
    
    itensDiv.appendChild(newItem);
}

async function handleNovoPedido(event) {
    event.preventDefault();
    const form = event.target;
    const descricoes = Array.from(form.querySelectorAll('textarea[name="descricao[]"]')).map(el => el.value);
    const precos = Array.from(form.querySelectorAll('input[name="preco[]"]')).map(el => parseFloat(el.value));

    try {
        // Primeiro criar o pedido
        const pedido = await fetchAPI('/pedidos/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                status: 'PENDENTE'
            })
        });

        // Depois adicionar os itens
        for (let i = 0; i < descricoes.length; i++) {
            await fetchAPI(`/pedidos/${pedido.id}/add_item/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    descricao: descricoes[i],
                    preco: precos[i]
                })
            });
        }

        showMessage('Pedido criado com sucesso!');
        loadPedidos();
    } catch (error) {
        showMessage('Erro ao criar pedido', 'danger');
    }
}

async function confirmarPedido(id) {
    try {
        await fetchAPI(`/pedidos/${id}/update_status/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                status: 'CONFIRMADO',
                comentario: 'Pedido confirmado pelo cliente'
            })
        });
        
        showMessage('Pedido confirmado com sucesso!');
        viewPedido(id);
    } catch (error) {
        showMessage('Erro ao confirmar pedido', 'danger');
    }
}

async function rejeitarPedido(id) {
    if (confirm('Tem certeza que deseja rejeitar este pedido?')) {
        try {
            await fetchAPI(`/pedidos/${id}/update_status/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: 'CANCELADO',
                    comentario: 'Pedido rejeitado pelo cliente'
                })
            });
            
            showMessage('Pedido rejeitado com sucesso!');
            viewPedido(id);
        } catch (error) {
            showMessage('Erro ao rejeitar pedido', 'danger');
        }
    }
}
async function loadPedidos() {
    try {
        const pedidos = await fetchAPI('/pedidos/');
        const content = document.getElementById('content');
        content.innerHTML = `
            <h2>Pedidos</h2>
            <button class="btn btn-primary mb-3" onclick="showAddPedidoForm()">Novo Pedido</button>
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cliente</th>
                            <th>Status</th>
                            <th>Valor Total</th>
                            <th>Data</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${pedidos.results.map(pedido => `
                            <tr>
                                <td>${pedido.id}</td>
                                <td>${pedido.cliente.user.first_name} ${pedido.cliente.user.last_name}</td>
                                <td>${pedido.status}</td>
                                <td>R$ ${pedido.valor_total}</td>
                                <td>${new Date(pedido.data_criacao).toLocaleDateString()}</td>
                                <td>
                                    <button class="btn btn-sm btn-info" onclick="viewPedido(${pedido.id})">
                                        Ver
                                    </button>
                                    <button class="btn btn-sm btn-warning" onclick="updateStatus(${pedido.id})">
                                        Status
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        showMessage('Erro ao carregar pedidos', 'danger');
    }
}

async function viewPedido(id) {
    try {
        const pedido = await fetchAPI(`/pedidos/${id}/`);
        const content = document.getElementById('content');
        content.innerHTML = `
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h3>Pedido #${pedido.id}</h3>
                    <button class="btn btn-secondary" onclick="loadPedidos()">Voltar</button>
                </div>
                <div class="card-body">
                    <div class="row mb-4">
                        <div class="col-md-6">
                            <h5>Cliente</h5>
                            <p>${pedido.cliente.user.first_name} ${pedido.cliente.user.last_name}</p>
                            <p>CPF: ${pedido.cliente.cpf}</p>
                            <p>Endereço: ${pedido.cliente.endereco}</p>
                        </div>
                        <div class="col-md-6">
                            <h5>Status do Pedido</h5>
                            <p>Status Atual: ${pedido.status}</p>
                            <p>Data de Criação: ${new Date(pedido.data_criacao).toLocaleString()}</p>
                            <p>Última Atualização: ${new Date(pedido.data_atualizacao).toLocaleString()}</p>
                        </div>
                    </div>

                    <h5>Itens do Pedido</h5>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Descrição</th>
                                <th>Preço</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${pedido.itens.map(item => `
                                <tr>
                                    <td>${item.descricao}</td>
                                    <td>R$ ${item.preco}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th>Total</th>
                                <th>R$ ${pedido.valor_total}</th>
                            </tr>
                        </tfoot>
                    </table>

                    <h5>Histórico de Status</h5>
                    <div class="list-group">
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
        `;
    } catch (error) {
        showMessage('Erro ao carregar detalhes do pedido', 'danger');
    }
}

async function updateStatus(id) {
    try {
        const pedido = await fetchAPI(`/pedidos/${id}/`);
        const content = document.getElementById('content');
        content.innerHTML = `
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">Atualizar Status do Pedido #${id}</div>
                        <div class="card-body">
                            <form id="statusForm" onsubmit="handleStatusUpdate(event, ${id})">
                                <div class="mb-3">
                                    <label for="status" class="form-label">Novo Status</label>
                                    <select class="form-select" id="status" required>
                                        <option value="">Selecione um status</option>
                                        <option value="PENDENTE">Pendente</option>
                                        <option value="AGUARDANDO_PAGAMENTO">Aguardando Pagamento</option>
                                        <option value="CONFIRMADO">Confirmado</option>
                                        <option value="EM_TRANSITO">Em Trânsito</option>
                                        <option value="ENTREGUE">Entregue</option>
                                        <option value="CANCELADO">Cancelado</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="comentario" class="form-label">Comentário</label>
                                    <textarea class="form-control" id="comentario"></textarea>
                                </div>
                                <button type="submit" class="btn btn-primary">Atualizar</button>
                                <button type="button" class="btn btn-secondary" onclick="loadPedidos()">Cancelar</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        showMessage('Erro ao carregar formulário de status', 'danger');
    }
}

async function handleStatusUpdate(event, id) {
    event.preventDefault();
    const data = {
        status: document.getElementById('status').value,
        comentario: document.getElementById('comentario').value
    };

    try {
        await fetchAPI(`/pedidos/${id}/update_status/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        showMessage('Status atualizado com sucesso!');
        viewPedido(id);
    } catch (error) {
        showMessage('Erro ao atualizar status', 'danger');
    }
}

function showAddPedidoForm() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Novo Pedido</div>
                    <div class="card-body">
                        <form id="pedidoForm" onsubmit="handleAddPedido(event)">
                            <div id="itens">
                                <div class="item-pedido mb-3">
                                    <div class="row">
                                        <div class="col-md-8">
                                            <label class="form-label">Descrição</label>
                                            <input type="text" class="form-control descricao" required>
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label">Preço</label>
                                            <input type="number" step="0.01" class="form-control preco" required>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button type="button" class="btn btn-secondary mb-3" onclick="addItemField()">
                                + Adicionar Item
                            </button>
                            <button type="submit" class="btn btn-primary">Criar Pedido</button>
                            <button type="button" class="btn btn-secondary" onclick="loadPedidos()">Cancelar</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function addItemField() {
    const itensDiv = document.getElementById('itens');
    const newItem = document.createElement('div');
    newItem.className = 'item-pedido mb-3';
    newItem.innerHTML = `
        <div class="row">
            <div class="col-md-8">
                <label class="form-label">Descrição</label>
                <input type="text" class="form-control descricao" required>
            </div>
            <div class="col-md-4">
                <label class="form-label">Preço</label>
                <input type="number" step="0.01" class="form-control preco" required>
            </div>
        </div>
    `;
    itensDiv.appendChild(newItem);
}

async function handleAddPedido(event) {
    event.preventDefault();
    const items = [];
    const descricoes = document.querySelectorAll('.descricao');
    const precos = document.querySelectorAll('.preco');
    
    for (let i = 0; i < descricoes.length; i++) {
        items.push({
            descricao: descricoes[i].value,
            preco: precos[i].value
        });
    }

    try {
        // Criar o pedido
        const pedidoResponse = await fetchAPI('/pedidos/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({})  // O pedido será criado com o cliente atual
        });

        // Adicionar os itens ao pedido
        for (const item of items) {
            await fetchAPI(`/pedidos/${pedidoResponse.id}/add_item/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(item)
            });
        }

        showMessage('Pedido criado com sucesso!');
        loadPedidos();
    } catch (error) {
        showMessage('Erro ao criar pedido', 'danger');
    }
}
