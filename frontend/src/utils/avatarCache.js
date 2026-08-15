/**
 * Converts an image URL into a base64 string and caches it in localStorage.
 * This avoids hitting the server/database for the avatar image on subsequent visits.
 * @param {string} url - The URL of the avatar image.
 * @returns {Promise<string|null>} - Resolves with the base64 string or null.
 */
export const cacheAvatar = async (url) => {
  if (!url) {
    localStorage.removeItem("cachedAvatar");
    return null;
  }
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result;
        localStorage.setItem("cachedAvatar", base64data);
        resolve(base64data);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Failed to cache avatar image", error);
    return null;
  }
};

/**
 * Directly caches a File object (e.g. from a file input) as a base64 string in localStorage.
 * @param {File} file - The file object to cache.
 * @returns {Promise<string>}
 */
export const cacheAvatarFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result;
      localStorage.setItem("cachedAvatar", base64data);
      resolve(base64data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Retrieves the cached base64 avatar from localStorage.
 * @returns {string} - The base64 string or an empty string.
 */
export const getCachedAvatar = () => {
  return localStorage.getItem("cachedAvatar") || "";
};
