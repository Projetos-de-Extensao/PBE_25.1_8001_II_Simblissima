# Documentação da API Simblissima

## Visão Geral

A API Simblissima é uma API REST desenvolvida com Django REST Framework para gerenciar um sistema de pedidos. A API oferece funcionalidades completas para:

- Registro e autenticação de usuários
- Gerenciamento de clientes
- Criação e acompanhamento de pedidos
- Controle de status e histórico de pedidos
- Processamento de pagamentos

## Documentação Interativa

A documentação interativa da API está disponível em:

- **Swagger UI**: [http://127.0.0.1:8000/swagger/](http://127.0.0.1:8000/swagger/)
- **ReDoc**: [http://127.0.0.1:8000/redoc/](http://127.0.0.1:8000/redoc/)

## Autenticação

A API utiliza autenticação por sessão. Para acessar os endpoints protegidos, você deve:

1. **Registrar um usuário**: `POST /api/register/`
2. **Fazer login**: `POST /api/login/`
3. **Usar os cookies de sessão** para acessar endpoints protegidos

## Endpoints Principais

### Autenticação e Usuários

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/api/register/` | Registra novo usuário e cliente | Não |
| POST | `/api/login/` | Autentica usuário | Não |
| GET | `/api/current-user/` | Retorna dados do usuário atual | Não |
| GET/PUT | `/api/perfil/` | Visualizar/editar perfil do cliente | Sim |

### Clientes

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/api/clientes/` | Lista clientes | Sim |
| GET | `/api/clientes/{id}/` | Detalhes de um cliente | Sim |
| PUT/PATCH | `/api/clientes/{id}/` | Atualiza cliente | Sim |

### Pedidos

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/api/pedidos/` | Lista pedidos | Sim |
| POST | `/api/pedidos/` | Cria novo pedido | Sim |
| GET | `/api/pedidos/{id}/` | Detalhes de um pedido | Sim |
| PUT/PATCH | `/api/pedidos/{id}/` | Atualiza pedido | Sim |
| POST | `/api/pedidos/{id}/add_item/` | Adiciona item ao pedido | Sim |
| POST | `/api/pedidos/{id}/update_status/` | Atualiza status do pedido | Sim |
| POST | `/api/pedidos/{id}/confirmar_pagamento/` | Confirma método de pagamento | Sim |

### Itens de Pedido

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/api/itens-pedido/` | Lista itens de pedidos | Sim |
| GET | `/api/itens-pedido/{id}/` | Detalhes de um item | Sim |
| PUT/PATCH | `/api/itens-pedido/{id}/` | Atualiza item | Sim |
| DELETE | `/api/itens-pedido/{id}/` | Remove item | Sim |

### Status de Pedidos

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/api/status-pedido/` | Lista histórico de status | Sim |
| GET | `/api/status-pedido/{id}/` | Detalhes de um status | Sim |

## Exemplos de Uso

### 1. Registrar Novo Usuário

```bash
curl -X POST http://127.0.0.1:8000/api/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "cpf": "12345678901",
    "email": "usuario@exemplo.com",
    "password": "senha123",
    "first_name": "João",
    "last_name": "Silva",
    "telefone": "(11) 99999-9999",
    "endereco": "Rua das Flores, 123 - São Paulo, SP"
  }'
```

### 2. Fazer Login

```bash
curl -X POST http://127.0.0.1:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "12345678901",
    "password": "senha123"
  }'
```

### 3. Criar Novo Pedido

```bash
curl -X POST http://127.0.0.1:8000/api/pedidos/ \
  -H "Content-Type: application/json" \
  -H "Cookie: sessionid=seu_session_id_aqui" \
  -d '{
    "observacoes": "Pedido urgente",
    "itens": [
      {
        "nome": "Hambúrguer",
        "descricao": "Hambúrguer artesanal",
        "preco": "25.90",
        "quantidade": 2
      }
    ]
  }'
```

### 4. Adicionar Item ao Pedido

```bash
curl -X POST http://127.0.0.1:8000/api/pedidos/1/add_item/ \
  -H "Content-Type: application/json" \
  -H "Cookie: sessionid=seu_session_id_aqui" \
  -d '{
    "nome": "Batata Frita",
    "descricao": "Porção grande",
    "preco": "12.50",
    "quantidade": 1
  }'
```

### 5. Atualizar Status do Pedido

```bash
curl -X POST http://127.0.0.1:8000/api/pedidos/1/update_status/ \
  -H "Content-Type: application/json" \
  -H "Cookie: sessionid=seu_session_id_aqui" \
  -d '{
    "status": "EM_PREPARO",
    "comentario": "Pedido iniciado na cozinha"
  }'
```

## Status Disponíveis

- `PENDENTE`: Pedido criado, aguardando confirmação
- `CONFIRMADO`: Pedido confirmado pelo cliente
- `EM_PREPARO`: Pedido sendo preparado
- `PRONTO`: Pedido pronto para entrega/retirada
- `ENTREGUE`: Pedido entregue ao cliente
- `CANCELADO`: Pedido cancelado
- `AGUARDANDO_PAGAMENTO`: Aguardando confirmação do pagamento

## Métodos de Pagamento

- `PIX`: Pagamento via PIX
- `CARTAO_CREDITO`: Cartão de crédito
- `CARTAO_DEBITO`: Cartão de débito
- `DINHEIRO`: Dinheiro em espécie

## Filtros

### Pedidos por Status

Você pode filtrar pedidos por status usando o parâmetro `status`:

```bash
curl "http://127.0.0.1:8000/api/pedidos/?status=EM_PREPARO" \
  -H "Cookie: sessionid=seu_session_id_aqui"
```

## Paginação

A API utiliza paginação padrão do Django REST Framework. Por padrão, são retornados 10 itens por página.

```json
{
  "count": 25,
  "next": "http://127.0.0.1:8000/api/pedidos/?page=2",
  "previous": null,
  "results": [...]
}
```

## Permissões

- **Usuários comuns**: Podem ver apenas seus próprios dados (clientes, pedidos, itens, status)
- **Staff/Admin**: Podem ver e gerenciar todos os dados do sistema

## Códigos de Status HTTP

- `200 OK`: Operação bem-sucedida
- `201 Created`: Recurso criado com sucesso
- `400 Bad Request`: Dados inválidos ou incompletos
- `401 Unauthorized`: Não autenticado
- `403 Forbidden`: Sem permissão para acessar o recurso
- `404 Not Found`: Recurso não encontrado
- `500 Internal Server Error`: Erro interno do servidor

## Desenvolvimento

Para executar o servidor de desenvolvimento:

```bash
python manage.py runserver
```

A API estará disponível em `http://127.0.0.1:8000/`

## Tecnologias Utilizadas

- Django 5.2
- Django REST Framework 3.16
- drf-yasg (para documentação Swagger)
- SQLite (banco de dados padrão)
