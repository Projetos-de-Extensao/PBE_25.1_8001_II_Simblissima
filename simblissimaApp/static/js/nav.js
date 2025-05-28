// nav.js
async function updateNavigation() {
    try {
        const user = await getCurrentUser();
        
        const loginNav = document.getElementById('loginNav');
        const registroNav = document.getElementById('registroNav');
        const userInfo = document.getElementById('userInfo');
        const logoutNav = document.getElementById('logoutNav');
        const managerNav = document.getElementById('managerNav');
        const pedidosNav = document.getElementById('pedidosNav');

        if (user && user.id) {
            // Usuário está logado
            // Esconde elementos de usuário não logado
            loginNav.classList.add('d-none');
            registroNav.classList.add('d-none');

            // Mostra elementos de usuário logado
            userInfo.classList.remove('d-none');
            logoutNav.classList.remove('d-none');
            document.getElementById('userName').textContent = `${user.first_name} ${user.last_name}`;            // Configura a visibilidade baseada no tipo de usuário
            if (user.is_staff) {
                // Gerente: mostra APENAS dashboard
                managerNav.classList.remove('d-none');
                managerNav.style.display = 'block';
                pedidosNav.style.display = 'none'; // Esconde completamente
                pedidosNav.classList.add('d-none');
                // Redireciona para o dashboard
                loadManagerDashboard();
            } else {
                // Cliente: mostra APENAS meus pedidos
                managerNav.style.display = 'none';
                managerNav.classList.add('d-none');
                pedidosNav.style.display = 'block';
                pedidosNav.classList.remove('d-none');
            }
            return true;
        }

        // Mostra elementos de login
        loginNav.classList.remove('d-none');
        registroNav.classList.remove('d-none');

        // Esconde elementos de usuário logado
        userInfo.classList.add('d-none');
        logoutNav.classList.add('d-none');
        managerNav.classList.add('d-none');
        pedidosNav.classList.add('d-none');
        return false;
    } catch (error) {
        console.error('Erro ao verificar usuário:', error);
        return false;
    }
}
