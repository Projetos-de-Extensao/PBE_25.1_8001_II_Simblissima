// nav.js
async function updateNavigation() {
    try {
        const user = await getCurrentUser();
        
        const loginNav = document.getElementById('loginNav');
        const registroNav = document.getElementById('registroNav');
        const userInfo = document.getElementById('userInfo');
        const logoutNav = document.getElementById('logoutNav');
        const managerNav = document.getElementById('managerNav');
        const userName = document.getElementById('userName');
        const dashboardNav = document.getElementById('dashboardNav'); // Dashboard do cliente
        const infoNav = document.getElementById('infoNav'); // Ver informações

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
                if (dashboardNav) dashboardNav.classList.remove('d-none');
                if (infoNav) infoNav.classList.remove('d-none');
            } else {
                if (managerNav) {
                    if (managerNav.style) {
                        managerNav.style.display = 'none';
                    }
                    managerNav.classList.add('d-none');
                }
                if (dashboardNav) dashboardNav.classList.add('d-none');
                if (infoNav) infoNav.classList.add('d-none');
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
        if (dashboardNav) dashboardNav.classList.add('d-none');
        if (infoNav) infoNav.classList.add('d-none');
        return false;
    } catch (error) {
        console.error('Erro ao verificar usuário:', error);
        return false;
    }
}
// ...restante do código...
