// auth.js
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

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
            const data = await response.json();
            // Atualiza o token se estiver presente na resposta
            if (data.token) {
                authToken = data.token;
                localStorage.setItem('authToken', authToken);
            }
            return data;
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
            // Limpa dados de autenticação
            authToken = null;
            localStorage.removeItem('authToken');
            // Atualiza a navegação
            updateNavigation();
            // Carrega a página de login
            loadLogin();
            showMessage('Logout realizado com sucesso!');
        }
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        showMessage('Erro ao fazer logout', 'danger');
    }
}

// Atualiza o nome do usuário com saudação personalizada
function updateNavigation() {
    const navContainer = document.querySelector('.navbar-nav.ms-auto');
    const userNav = document.getElementById('userNav');
    
    getCurrentUser().then(user => {
        console.log('Updating navigation with user:', user); // Debug log
        if (user) {
            // Usuário está logado
            document.getElementById('loginNav').classList.add('d-none');
            document.getElementById('registroNav').classList.add('d-none');
            document.getElementById('userInfo').classList.remove('d-none');
            document.getElementById('logoutNav').classList.remove('d-none');
            document.getElementById('userName').textContent = `Olá, ${user.first_name} ${user.last_name}`;
            
            // Mostra o link do dashboard para usuários staff
            const managerNav = document.getElementById('managerNav');
            if (managerNav) {
                if (user.is_staff) {
                    console.log('User is staff, showing manager nav'); // Debug log
                    managerNav.classList.remove('d-none');
                } else {
                    console.log('User is not staff, hiding manager nav'); // Debug log
                    managerNav.classList.add('d-none');
                }
            }
        } else {
            // Usuário não está logado
            document.getElementById('loginNav').classList.remove('d-none');
            document.getElementById('registroNav').classList.remove('d-none');
            document.getElementById('userInfo').classList.add('d-none');
            document.getElementById('logoutNav').classList.add('d-none');
            const managerNav = document.getElementById('managerNav');
            if (managerNav) {
                managerNav.classList.add('d-none');
            }
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
        color: #1976d2;
    }

    .btn-register {
        background-color: transparent;
        color: #1976d2;
        border: 2px solid #1976d2;
    }

    .btn-register:hover {
        background-color: #1976d2;
        color: white;
    }

    .btn-danger {
        background-color: #d32f2f;
        color: white;
    }

    .btn-danger:hover {
        background-color: #b71c1c;
    }
`;
document.head.appendChild(style);

// Initialization code
async function initializeApp() {
    console.log('Initializing app...');
    const user = await getCurrentUser();
    console.log('Current user:', user);
}

async function checkAuthAndRedirect(redirectIfNotAuth = true) {
    const user = await getCurrentUser();
    if (!user && redirectIfNotAuth) {
        showMessage('Por favor, faça login para acessar esta página.', 'warning');
        loadLogin();
        return null;
    }
    return user;
}

// Call initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, initializing app...');
    await initializeApp();
    await updateNavigation();
});
