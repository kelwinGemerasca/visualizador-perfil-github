import { fetchUserProfile } from './api.js';
import { showLoading, renderProfile, showError, clearResults } from './ui.js';

const inputSearch = document.getElementById('input-search');
const btnSearch = document.getElementById('btn-search');

const handleSearch = async () => {
    const userName = inputSearch.value.trim();

    if (!userName) {
        showError('Por favor, digite um nome de usuário do GitHub.');
        return;
    }

    showLoading();

    try {
        const userData = await fetchUserProfile(userName);
        renderProfile(userData);
    } catch (error) {
        console.error('Erro ao buscar perfil do usuário:', error);
        showError('Usuário não encontrado. Por favor, verifique o nome do usuário e tente novamente.');
    }
};

btnSearch.addEventListener('click', handleSearch);

// Permite buscar ao pressionar Enter
inputSearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});