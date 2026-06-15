// Módulo responsável por comunicação com a API do GitHub

const BASE_URL = 'https://api.github.com';

const handleGithubError = async (response, fallbackMessage) => {
    if (response.status === 403) {
        const resetTimestamp = response.headers.get('x-ratelimit-reset');
        const resetDate = resetTimestamp ? new Date(Number(resetTimestamp) * 1000) : null;
        const resetMessage = resetDate ? ` Tente novamente após ${resetDate.toLocaleTimeString('pt-BR')}.` : '';

        throw new Error(`Limite de requisições da API do GitHub atingido.${resetMessage}`);
    }

    throw new Error(fallbackMessage);
};

// Retorna o usuário
export const fetchUserProfile = async (username) => {
    const response = await fetch(`${BASE_URL}/users/${username}`);

    if (!response.ok) {
        await handleGithubError(response, 'Usuário não encontrado');
    }

    return await response.json();
};

// Retorna os repositórios do usuário
export const fetchGithubUserRepos = async (userName) => {
    const response = await fetch(`${BASE_URL}/users/${userName}/repos?per_page=10&sort=created`);
    if (!response.ok) {
        await handleGithubError(response, 'Repositórios não encontrados.');
    }
    const repositories = await response.json();

    return repositories.map((repo) => ({
        ...repo,
        lastCommitDate: repo.pushed_at
    }));
};
