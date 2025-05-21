// nav.js
async function updateNavigation() {
    try {
        const response = await fetch('/api/current-user/', {
            credentials: 'include',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
            }
        });

        if (response.ok) {
            const user = await response.json();
            if (user && user.id) {
                // Usuário está logado
                document.getElementById('loginNav').classList.add('d-none');
                document.getElementById('registroNav').classList.add('d-none');
                document.getElementById('userInfo').classList.remove('d-none');
                document.getElementById('logoutNav').classList.remove('d-none');
                document.getElementById('userName').textContent = `${user.first_name} ${user.last_name}`;
                
                // Mostra o link do dashboard apenas para usuários staff
                const managerNav = document.getElementById('managerNav');
                if (managerNav) {
                    if (user.is_staff) {
                        managerNav.classList.remove('d-none');
                    } else {
                        managerNav.classList.add('d-none');
                    }
                }
                return true;
            }
        }
        // Usuário não está logado
        document.getElementById('loginNav').classList.remove('d-none');
        document.getElementById('registroNav').classList.remove('d-none');
        document.getElementById('userInfo').classList.add('d-none');
        document.getElementById('logoutNav').classList.add('d-none');
        const managerNav = document.getElementById('managerNav');
        if (managerNav) {
            managerNav.classList.add('d-none');
        }
        return false;
    } catch (error) {
        console.error('Erro ao verificar usuário:', error);
        return false;
    }
}
