// Módulo responsável por comunicação com a API do GitHub

const BASE_URL = 'https://api.github.com';
// Retorna o usuário
export const fetchUserProfile = async (username) => {
    const response = await fetch(`${BASE_URL}/users/${username}`);

    if (!response.ok) {
        throw new Error('Usuário não encontrado');
    }

    return await response.json();
};
// Retorna os repositórios do usuário
export async function fetchGithubUserRepos(userName) {
    const response = await fetch(`${BASE_URL}/users/${userName}/repos?per_page=10&sort=created`);
    if (!response.ok) {
        throw new Error ('Repositórios não encontrados.');
    }
    return await response.json();
}