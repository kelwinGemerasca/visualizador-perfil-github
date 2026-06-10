// Módulo responsável por comunicação com a API do GitHub

const BASE_URL = 'https://api.github.com';

export const fetchUserProfile = async (username) => {
    const response = await fetch(`${BASE_URL}/users/${username}`);

    if (!response.ok) {
        throw new Error('Usuário não encontrado');
    }

    return await response.json();
};
