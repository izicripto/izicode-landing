const fetch = require("node-fetch");

/**
 * Módulo para postar no LinkedIn via API (v2/ugcPosts)
 * Requer variáveis de ambiente: LINKEDIN_ACCESS_TOKEN, LINKEDIN_PERSON_URN
 */

const LINKEDIN_API_URL = "https://api.linkedin.com/v2";

/**
 * Cria um post de texto simples no LinkedIn
 * @param {string} text - O conteúdo do post
 * @param {string} accessToken - Token OAuth2
 * @param {string} personUrn - URN do autor (ex: urn:li:person:12345)
 */
async function createTextPost(text, accessToken, personUrn) {
    if (!accessToken || !personUrn) throw new Error("Missing LinkedIn Credentials");

    const endpoint = `${LINKEDIN_API_URL}/ugcPosts`;
    
    const body = {
        "author": personUrn,
        "lifecycleState": "PUBLISHED",
        "specificContent": {
            "com.linkedin.ugc.ShareContent": {
                "shareCommentary": {
                    "text": text
                },
                "shareMediaCategory": "NONE"
            }
        },
        "visibility": {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
        }
    };

    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "X-Restli-Protocol-Version": "2.0.0"
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`LinkedIn API Error: ${response.status} ${err}`);
    }

    return await response.json();
}

/**
 * (Opcional) Função para postar com imagem
 * 1. Register Upload -> 2. Upload Image -> 3. Create Post
 * Implementação simplificada: apenas esqueleto
 */
async function registerUpload(accessToken, personUrn) {
    // Implementar se necessário envio de mídia
}

module.exports = { createTextPost };
