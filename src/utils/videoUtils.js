import { VIDEO_PLATFORMS } from '../data/constants';

export function extractVideoId(url) {
  for (const platform of Object.values(VIDEO_PLATFORMS)) {
    for (const pattern of platform.patterns) {
      const match = url.match(pattern);
      if (match) {
        return { platform: platform.name, videoId: match[1] };
      }
    }
  }
  return null;
}

export function getThumbnailUrl(url) {
  const result = extractVideoId(url);
  if (!result) return null;

  if (result.platform === 'YouTube') {
    return `https://img.youtube.com/vi/${result.videoId}/mqdefault.jpg`;
  }
  if (result.platform === 'Vimeo') {
    return null; // Vimeo requires API call for thumbnails
  }
  return null;
}

export function getEmbedUrl(url) {
  const result = extractVideoId(url);
  if (!result) return null;

  if (result.platform === 'YouTube') {
    return `https://www.youtube.com/embed/${result.videoId}`;
  }
  if (result.platform === 'Vimeo') {
    return `https://player.vimeo.com/video/${result.videoId}`;
  }
  return null;
}

export function isValidVideoUrl(url) {
  return extractVideoId(url) !== null;
}

export function getVideoPlatformName(url) {
  const result = extractVideoId(url);
  return result ? result.platform : 'Unknown';
}
