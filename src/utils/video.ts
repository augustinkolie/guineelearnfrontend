/**
 * Utilitaires pour la manipulation et le formatage des URLs d'intégration vidéo.
 */

/**
 * Extrait l'identifiant (ID) d'une vidéo YouTube à partir de son URL.
 * @param url L'URL de la vidéo
 * @returns L'ID de 11 caractères ou null si non trouvé
 */
export const getYoutubeId = (url: string): string | null => {
    if (!url) return null;
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(youtubeRegex);
    return match ? match[1] : null;
};

/**
 * Convertit une URL YouTube standard (watch?, youtu.be, etc.) en URL d'intégration (embed).
 * @param url L'URL source de la vidéo
 * @returns L'URL formatée pour une iframe embed, ou l'URL originale si non reconnue
 */
export const getYoutubeEmbedUrl = (url: string): string => {
    const id = getYoutubeId(url);
    if (id) {
        return `https://www.youtube.com/embed/${id}`;
    }
    return url;
};

/**
 * Génère l'URL de la miniature (thumbnail) d'une vidéo YouTube.
 * @param url L'URL de la vidéo
 * @param quality La qualité souhaitée ('default', 'mqdefault', 'hqdefault', 'sddefault', 'maxresdefault')
 * @returns L'URL de l'image
 */
export const getYoutubeThumbnail = (url: string, quality: 'default' | 'mqdefault' | 'hqdefault' | 'sddefault' | 'maxresdefault' = 'hqdefault'): string | null => {
    const id = getYoutubeId(url);
    if (!id) return null;
    return `https://img.youtube.com/vi/${id}/${quality}.jpg`;
};
