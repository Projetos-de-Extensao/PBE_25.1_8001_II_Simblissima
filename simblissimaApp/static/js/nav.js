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
                return true;
            }
        }
        // Usuário não está logado
        document.getElementById('loginNav').classList.remove('d-none');
        document.getElementById('registroNav').classList.remove('d-none');
        document.getElementById('userInfo').classList.add('d-none');
        document.getElementById('logoutNav').classList.add('d-none');
        return false;
    } catch (error) {
        console.error('Erro ao verificar usuário:', error);
        return false;
    }
}
