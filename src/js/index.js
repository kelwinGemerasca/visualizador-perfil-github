import { fetchGithubUserRepos, fetchUserProfile } from './api.js';
import { renderProfile, showError, showLoading } from './ui.js';

const inputSearch = document.getElementById('input-search');
const btnSearch = document.getElementById('btn-search');
const themeToggle = document.getElementById('theme-toggle');
let currentUserData = null;
let currentUserRepos = [];
let currentSortType = 'lastCommit';

const updateThemeToggle = () => {
    const isDarkTheme = document.documentElement.dataset.theme === 'dark';

    themeToggle.setAttribute('aria-pressed', String(isDarkTheme));
};

const toggleTheme = () => {
    const isDarkTheme = document.documentElement.dataset.theme === 'dark';
    const nextTheme = isDarkTheme ? 'light' : 'dark';

    if (nextTheme === 'dark') {
        document.documentElement.dataset.theme = 'dark';
    } else {
        delete document.documentElement.dataset.theme;
    }

    try {
        localStorage.setItem('theme', nextTheme);
    } catch (error) {
        console.warn('Não foi possível salvar a preferência de tema.', error);
    }

    updateThemeToggle();
};

const getSortValue = (repo, sortType) => {
    const sortValues = {
        lastCommit: Date.parse(repo.lastCommitDate) || 0,
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        watchers: repo.watchers_count || 0
    };

    return sortValues[sortType] || 0;
};

const sortRepositories = (repositories, sortType) => {
    return [...repositories].sort((firstRepo, secondRepo) => {
        return getSortValue(secondRepo, sortType) - getSortValue(firstRepo, sortType);
    });
};

const renderSortedProfile = () => {
    if (!currentUserData) {
        return;
    }

    const sortedRepos = sortRepositories(currentUserRepos, currentSortType);
    renderProfile(currentUserData, sortedRepos, currentSortType);
    bindSortSelect();
};

const bindSortSelect = () => {
    const sortSelect = document.getElementById('sort-select');

    if (!sortSelect) {
        return;
    }

    sortSelect.addEventListener('change', (event) => {
        currentSortType = event.target.value;
        renderSortedProfile();
    });
};

const handleSearch = async () => {
    const userName = inputSearch.value.trim();

    if (!userName) {
        showError('Por favor, digite um nome de usuário do GitHub.');
        return;
    }

    showLoading();

    try {
        const userData = await fetchUserProfile(userName);
        const userRepos = await fetchGithubUserRepos(userName);

        currentUserData = userData;
        currentUserRepos = userRepos;
        currentSortType = 'lastCommit';
        renderSortedProfile();

    } catch (error) {
        console.error('Erro ao buscar perfil do usuário:', error);
        currentUserData = null;
        currentUserRepos = [];
        showError(error.message || 'Não foi possível buscar o usuário. Tente novamente mais tarde.');
    }
};

btnSearch.addEventListener('click', handleSearch);
themeToggle.addEventListener('click', toggleTheme);
updateThemeToggle();

// Permite buscar ao pressionar Enter
inputSearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});
