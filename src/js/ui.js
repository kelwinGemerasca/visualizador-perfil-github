// Módulo responsável por manipulação de DOM e renderização

const profileResults = document.querySelector('.profile-results');
const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
});

export const showLoading = () => {
    profileResults.innerHTML = `<p class="loading">Carregando...</p>`;
};

const formatCommitDate = (date) => {
    if (!date) {
        return 'Não informada';
    }

    return dateFormatter.format(new Date(date));
};

export const renderProfile = (userData, userRepos, sortType = 'lastCommit') => {
    const sortOptions = {
        lastCommit: 'Último commit',
        stars: 'Estrelas',
        forks: 'Forks',
        watchers: 'Watchers'
    };

    const repositoriesHTML = userRepos && userRepos.length > 0 ? userRepos.map(repo => `
    <a href="${repo.html_url}" target="_blank">
        <div class="repository-card">
            <h3>${repo.name}</h3>
            <div class="repository-stats">
                <span>⭐Stars: ${repo.stargazers_count}</span>
                <span>🍴Forks: ${repo.forks_count}</span>
                <span>👀Watchers: ${repo.watchers_count}</span>
                <span>💻Language: ${repo.language || 'Não informada'}</span>
                <span>🗓️Último commit: ${formatCommitDate(repo.lastCommitDate)}</span>
                </div>
        </div>
    </a>
        `).join('') : `<p>Nenhum repositório encontrado.</p>`;

    profileResults.innerHTML = `
        <div class="profile-card">
            <img src="${userData.avatar_url}" alt="Avatar de ${userData.name}" class="profile-avatar">
            <div class="profile-info">
                <h2>${userData.name || 'Não possui nome cadastrado 😒.'}</h2>
                <p>${userData.bio || 'Sem biografia disponível 😒.'}</p>
            </div>
        </div>
        
        <div class="profile-counters">
            <div class="followers">
                <h4>👥 Seguidores</h4>
                <span>${userData.followers}</span>
            </div>
            <div class="following">
                <h4>👥 Seguindo</h4>
                <span>${userData.following}</span>
            </div>
        </div>

        <div class="profile-repositories">
            <h2>Repositórios</h2>
            <label class="sort-control" for="sort-select">
                Ordenar por
                <select id="sort-select">
                    ${Object.entries(sortOptions).map(([value, label]) => `
                        <option value="${value}" ${value === sortType ? 'selected' : ''}>${label}</option>
                    `).join('')}
                </select>
            </label>
            <div class=repositories>
                ${repositoriesHTML}
            </div>
        </div>

    `;
};

export const showError = (errorMessage) => {
    alert(errorMessage);
    profileResults.innerHTML = '';
};

export const clearResults = () => {
    profileResults.innerHTML = '';
};
