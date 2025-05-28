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
        const userName = document.getElementById('userName');

        // Checagem de existência dos elementos antes de manipular
        if (user && user.id) {
            if (loginNav) loginNav.classList.add('d-none');
            if (registroNav) registroNav.classList.add('d-none');
            if (userInfo) userInfo.classList.remove('d-none');
            if (logoutNav) logoutNav.classList.remove('d-none');
            if (userName) userName.textContent = `${user.first_name} ${user.last_name}`;
            // Configura a visibilidade baseada no tipo de usuário
            if (user.is_staff) {
                if (managerNav) managerNav.classList.remove('d-none');
                if (pedidosNav) {
                    // Só manipula style se o elemento existir e tem propriedade style
                    if (pedidosNav.style) {
                        pedidosNav.style.display = 'none';
                    }
                    pedidosNav.classList.add('d-none');
                }
                loadManagerDashboard();
            } else {
                if (managerNav) {
                    if (managerNav.style) {
                        managerNav.style.display = 'none';
                    }
                    managerNav.classList.add('d-none');
                }
                if (pedidosNav) {
                    if (pedidosNav.style) {
                        pedidosNav.style.display = 'block';
                    }
                    pedidosNav.classList.remove('d-none');
                }
            }
            return true;
        }
        // Mostra elementos de login
        if (loginNav) loginNav.classList.remove('d-none');
        if (registroNav) registroNav.classList.remove('d-none');
        // Esconde elementos de usuário logado
        if (userInfo) userInfo.classList.add('d-none');
        if (logoutNav) logoutNav.classList.add('d-none');
        if (managerNav) managerNav.classList.add('d-none');
        if (pedidosNav) pedidosNav.classList.add('d-none');
        return false;
    } catch (error) {
        console.error('Erro ao verificar usuário:', error);
        return false;
    }
}
// ...restante do código...
