# Projeto Simblissima

**Número do Grupo**: 2<br>
**Código da Disciplina**: IBM-8936<br>

## Alunos
|Matrícula | Aluno |
| -- | -- |
| Bernardo Lobo Marques  |  202401709433  |
| Bernardo Moreira Guimarães Gonçalves  |  202401500283 |
| Guilherme Dias Batista | 202402972091 |
| Michel de Melo Guimarães | 202401569852 |
| Julia Dominguez Curto |  202402192477 |


## Sobre 
Nosso projeto consiste em desenvolver uma API REST para gerenciamento de pedidos e entregas, focando na logística de produtos do continente para a Ilha Primeira, utilizando um sistema de integração com barcos já existentes.

## Screenshots
Adicione 3 ou mais screenshots do projeto em termos de interface e funcionamento.

## Instalação 
**Linguagens**: Python<br>
**Tecnologias**: Django, Django REST Framework, SQLite, HTML, CSS, JavaScript, Bootstrap<br>

Para rodar o projeto localmente, siga os passos abaixo:

### Pré-requisitos
* Python 3.9+ instalado.
* `pip` (gerenciador de pacotes do Python).

### Passos para Instalação
1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/seu-repositorio-simblissima.git](https://github.com/seu-usuario/seu-repositorio-simblissima.git)
    cd seu-repositorio-simblissima/simblissimaProject
    ```
2.  **Crie e ative um ambiente virtual (recomendado):**
    ```bash
    python -m venv venv
    # No Windows:
    .\venv\Scripts\activate
    # No macOS/Linux:
    source venv/bin/activate
    ```
3.  **Instale as dependências do Django:**
    ```bash
    pip install Django djangorestframework
    ```
4.  **Execute as migrações do banco de dados:**
    ```bash
    python manage.py migrate
    ```
5.  **Crie um superusuário (opcional, para acessar o painel de administração):**
    ```bash
    python manage.py createsuperuser
    ```
6.  **Colete arquivos estáticos (opcional, para produção):**
    ```bash
    python manage.py collectstatic
    ```

## Tutorial de uso 
Para iniciar o servidor de desenvolvimento e acessar a aplicação:

1.  **Certifique-se de que o ambiente virtual está ativado** (se você o criou).
2.  **Inicie o servidor Django:**
    ```bash
    python manage.py runserver
    ```
3.  **Acesse a aplicação no navegador:**
    * **Interface Principal (SPA):** Abra seu navegador e acesse `http://127.0.0.1:8000/`.
    * **Painel de Administração (Django Admin):** Acesse `http://127.0.0.1:8000/admin/` e faça login com as credenciais do superusuário criado.
    * **Endpoints da API REST:** Você pode explorar os endpoints da API através do navegador em `http://127.00.1:8000/api/`.

### Fluxo Básico do Usuário (Cliente):
1.  **Registro:** Acesse a interface principal e clique em "Registro" para criar uma nova conta de cliente.
2.  **Login:** Após o registro, faça login com seu CPF e senha.
3.  **Criar Pedido:** Na página inicial, clique em "Ver Pedidos" e depois em "Novo Pedido" para adicionar itens e observações.
4.  **Acompanhar Pedido:** Na página de pedidos, você pode ver o status de todos os seus pedidos e verificar detalhes.
5.  **Atualizar Perfil:** Acesse "Minha Conta" e depois "Ver Perfil" para gerenciar suas informações.

### Fluxo Básico do Gerente (Staff):
1.  **Login:** Faça login com as credenciais de um superusuário (staff).
2.  **Dashboard do Gerente:** Na página inicial, clique em "Dashboard do Gerente" para visualizar estatísticas e gerenciar todos os pedidos.
3.  **Atualizar Pedidos:** No dashboard, você pode alterar o status de pedidos, definir o valor final e adicionar comentários.


## Vídeo
Adicione 1 ou mais vídeos com a execução do projeto final.

## Outros 
https://www.canva.com/design/DAGjtltoot8/rh_b9t3NbySyI2s5XLXq-Q/edit?utm_content=DAGjtltoot8&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton
