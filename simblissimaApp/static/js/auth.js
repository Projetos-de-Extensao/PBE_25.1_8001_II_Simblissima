// auth.js
async function getCurrentUser() {
    try {
        const response = await fetch('/api/current-user/', {
            method: 'GET',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
            },
            credentials: 'include'
        });
        
        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error('Erro ao obter usuário atual:', error);
        return null;
    }
}

async function logout() {
    try {
        const response = await fetch('/api-auth/logout/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
            },
            credentials: 'include'
        });

        if (response.ok) {
            window.location.href = '/';
            showMessage('Logout realizado com sucesso!');
        }
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        showMessage('Erro ao fazer logout', 'danger');
    }
}

function updateNavigation() {
    const navContainer = document.querySelector('.nav-container');
    const userNav = document.getElementById('userNav');
    
    getCurrentUser().then(user => {
        if (user) {
            // Usuário está logado
            if (!userNav) {
                const userNavElement = document.createElement('div');
                userNavElement.id = 'userNav';
                userNavElement.classList.add('user-nav');
                userNavElement.innerHTML = `
                    <span class="user-name">Olá, ${user.first_name} ${user.last_name}</span>
                    <button onclick="logout()" class="btn btn-danger">Sair</button>
                `;
                navContainer.appendChild(userNavElement);
            }
            
            // Remove botões de login e registro se existirem
            const loginBtn = document.querySelector('.btn-login');
            const registerBtn = document.querySelector('.btn-register');
            if (loginBtn) loginBtn.style.display = 'none';
            if (registerBtn) registerBtn.style.display = 'none';
        } else {
            // Usuário não está logado
            if (userNav) {
                userNav.remove();
            }
            
            // Mostra botões de login e registro
            const loginBtn = document.querySelector('.btn-login');
            const registerBtn = document.querySelector('.btn-register');
            if (loginBtn) loginBtn.style.display = 'block';
            if (registerBtn) registerBtn.style.display = 'block';
        }
    });
}

function showMessage(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    const content = document.getElementById('content');
    content.insertBefore(alertDiv, content.firstChild);
    
    // Remove a mensagem após 3 segundos
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Atualiza os estilos
const style = document.createElement('style');
style.textContent = `
    .nav-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 2rem;
    }

    .auth-container {
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    .user-nav {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .user-name {
        color: white;
        font-weight: 500;
    }

    .btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.3s ease;
    }

    .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .btn-login {
        background-color: white;
        color: var(--primary-color);
    }

    .btn-register {
        background-color: transparent;
        color: white;
        border: 2px solid white;
    }

    .btn-danger {
        background-color: #dc3545;
        color: white;
    }

    .btn-danger:hover {
        background-color: #c82333;
    }
`;
document.head.appendChild(style);

// Atualiza a navegação quando a página carrega
document.addEventListener('DOMContentLoaded', updateNavigation);
