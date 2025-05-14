// produtos.js
async function loadProdutos() {
    try {
        const produtos = await fetchAPI('/produtos/');
        const content = document.getElementById('content');
        content.innerHTML = `
            <h2>Produtos</h2>
            <button class="btn btn-primary mb-3" onclick="showAddProdutoForm()">Novo Produto</button>
            <div class="row" id="produtosGrid">
                ${produtos.results.map(produto => `
                    <div class="col-md-4 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${produto.nome}</h5>
                                <p class="card-text">R$ ${produto.preco}</p>
                                <p class="card-text">${produto.descricao}</p>
                                <p class="card-text">
                                    <small class="text-muted">
                                        ${produto.disponivel ? 'Disponível' : 'Indisponível'}
                                    </small>
                                </p>
                                <button class="btn btn-sm btn-warning" onclick="editProduto(${produto.id})">
                                    Editar
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="deleteProduto(${produto.id})">
                                    Excluir
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (error) {
        showMessage('Erro ao carregar produtos', 'danger');
    }
}

function showAddProdutoForm() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">Novo Produto</div>
                    <div class="card-body">
                        <form id="produtoForm" onsubmit="handleAddProduto(event)">
                            <div class="mb-3">
                                <label for="nome" class="form-label">Nome</label>
                                <input type="text" class="form-control" id="nome" required>
                            </div>
                            <div class="mb-3">
                                <label for="preco" class="form-label">Preço</label>
                                <input type="number" step="0.01" class="form-control" id="preco" required>
                            </div>
                            <div class="mb-3">
                                <label for="descricao" class="form-label">Descrição</label>
                                <textarea class="form-control" id="descricao" required></textarea>
                            </div>
                            <div class="mb-3 form-check">
                                <input type="checkbox" class="form-check-input" id="disponivel" checked>
                                <label class="form-check-label" for="disponivel">Disponível</label>
                            </div>
                            <button type="submit" class="btn btn-primary">Salvar</button>
                            <button type="button" class="btn btn-secondary" onclick="loadProdutos()">Cancelar</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function handleAddProduto(event) {
    event.preventDefault();
    const produto = {
        nome: document.getElementById('nome').value,
        preco: document.getElementById('preco').value,
        descricao: document.getElementById('descricao').value,
        disponivel: document.getElementById('disponivel').checked
    };

    try {
        await fetchAPI('/produtos/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(produto)
        });
        showMessage('Produto adicionado com sucesso!');
        loadProdutos();
    } catch (error) {
        showMessage('Erro ao adicionar produto', 'danger');
    }
}

async function editProduto(id) {
    try {
        const produto = await fetchAPI(`/produtos/${id}/`);
        const content = document.getElementById('content');
        content.innerHTML = `
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">Editar Produto</div>
                        <div class="card-body">
                            <form id="produtoForm" onsubmit="handleEditProduto(event, ${id})">
                                <div class="mb-3">
                                    <label for="nome" class="form-label">Nome</label>
                                    <input type="text" class="form-control" id="nome" value="${produto.nome}" required>
                                </div>
                                <div class="mb-3">
                                    <label for="preco" class="form-label">Preço</label>
                                    <input type="number" step="0.01" class="form-control" id="preco" value="${produto.preco}" required>
                                </div>
                                <div class="mb-3">
                                    <label for="descricao" class="form-label">Descrição</label>
                                    <textarea class="form-control" id="descricao" required>${produto.descricao}</textarea>
                                </div>
                                <div class="mb-3 form-check">
                                    <input type="checkbox" class="form-check-input" id="disponivel" ${produto.disponivel ? 'checked' : ''}>
                                    <label class="form-check-label" for="disponivel">Disponível</label>
                                </div>
                                <button type="submit" class="btn btn-primary">Salvar</button>
                                <button type="button" class="btn btn-secondary" onclick="loadProdutos()">Cancelar</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        showMessage('Erro ao carregar produto', 'danger');
    }
}

async function handleEditProduto(event, id) {
    event.preventDefault();
    const produto = {
        nome: document.getElementById('nome').value,
        preco: document.getElementById('preco').value,
        descricao: document.getElementById('descricao').value,
        disponivel: document.getElementById('disponivel').checked
    };

    try {
        await fetchAPI(`/produtos/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(produto)
        });
        showMessage('Produto atualizado com sucesso!');
        loadProdutos();
    } catch (error) {
        showMessage('Erro ao atualizar produto', 'danger');
    }
}

async function deleteProduto(id) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        try {
            await fetchAPI(`/produtos/${id}/`, {
                method: 'DELETE'
            });
            showMessage('Produto excluído com sucesso!');
            loadProdutos();
        } catch (error) {
            showMessage('Erro ao excluir produto', 'danger');
        }
    }
}
