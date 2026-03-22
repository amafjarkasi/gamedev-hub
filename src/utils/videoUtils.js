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

/**
 * Check if a YouTube or Vimeo video is actually accessible.
 * Uses the oEmbed endpoint which returns 200 for valid videos, 404 for invalid.
 * Returns { available: boolean, error?: string }
 */
export async function checkVideoAvailability(url) {
  const result = extractVideoId(url);
  if (!result) {
    return { available: false, error: 'Could not parse video URL' };
  }

  try {
    let oembedUrl;
    if (result.platform === 'YouTube') {
      oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${result.videoId}&format=json`;
    } else if (result.platform === 'Vimeo') {
      oembedUrl = `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${result.videoId}`;
    } else {
      return { available: false, error: 'Unsupported video platform' };
    }

    const response = await fetch(oembedUrl, {
      method: 'HEAD',
      mode: 'no-cors',
    });

    // In no-cors mode we get opaque responses, so fall back to a full fetch
    // if status is 0 (opaque). For CORS-enabled endpoints this works directly.
    if (response.status === 0) {
      // no-cors gives opaque response; try with cors
      const corsResponse = await fetch(oembedUrl);
      if (corsResponse.ok) {
        return { available: true };
      }
      return {
        available: false,
        error: 'Video is unavailable or has been removed',
      };
    }

    if (response.ok) {
      return { available: true };
    }

    return {
      available: false,
      error: 'Video is unavailable or has been removed',
    };
  } catch {
    // Network errors or CORS issues — we can't definitively say it's broken
    // from client-side, so give benefit of the doubt but warn
    return {
      available: true,
      error: 'Could not verify video availability (network issue)',
    };
  }
}
