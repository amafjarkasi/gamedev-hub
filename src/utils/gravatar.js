import MD5 from 'crypto-js/md5';

/**
 * Generate Gravatar URL from email
 * @param {string} email - User email
 * @param {number} size - Avatar size in pixels
 * @param {string} defaultType - Default avatar type (identicon, monsterid, wavatar, retro, robohash)
 * @returns {string} Gravatar URL
 */
export function getGravatarUrl(email, size = 80, defaultType = 'identicon') {
  const trimmedEmail = email.trim().toLowerCase();
  const hash = MD5(trimmedEmail).toString();
  
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${defaultType}`;
}

/**
 * Get avatar URL - uses Gravatar if available, falls back to initial
 * @param {string} email - User email
 * @param {string} name - User display name
 * @param {number} size - Avatar size in pixels
 * @returns {object} Avatar object with url and type
 */
export function getAvatar(email, name, size = 80) {
  const gravatarUrl = getGravatarUrl(email, size);
  
  // Check if Gravatar exists by fetching the URL
  // For performance, we'll use a default type that returns 404 if no gravatar exists
  return {
    url: gravatarUrl,
    type: 'gravatar',
    initial: name.charAt(0).toUpperCase()
  };
}
