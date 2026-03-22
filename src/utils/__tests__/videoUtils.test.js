import {
  extractVideoId,
  getEmbedUrl,
  getThumbnailUrl,
  isValidVideoUrl,
  getVideoPlatformName,
  sanitizeUrl,
} from '../videoUtils';

describe('extractVideoId', () => {
  test('extracts ID from YouTube watch URL', () => {
    const result = extractVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    expect(result).toEqual({ platform: 'YouTube', videoId: 'dQw4w9WgXcQ' });
  });

  test('extracts ID from YouTube short URL', () => {
    const result = extractVideoId('https://youtu.be/dQw4w9WgXcQ');
    expect(result).toEqual({ platform: 'YouTube', videoId: 'dQw4w9WgXcQ' });
  });

  test('extracts ID from YouTube embed URL', () => {
    const result = extractVideoId('https://www.youtube.com/embed/dQw4w9WgXcQ');
    expect(result).toEqual({ platform: 'YouTube', videoId: 'dQw4w9WgXcQ' });
  });

  test('extracts ID from Vimeo URL', () => {
    const result = extractVideoId('https://vimeo.com/123456789');
    expect(result).toEqual({ platform: 'Vimeo', videoId: '123456789' });
  });

  test('returns null for invalid URL', () => {
    expect(extractVideoId('https://example.com/video')).toBeNull();
  });

  test('returns null for empty string', () => {
    expect(extractVideoId('')).toBeNull();
  });
});

describe('getEmbedUrl', () => {
  test('returns YouTube embed URL', () => {
    const result = getEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    expect(result).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ');
  });

  test('returns Vimeo embed URL', () => {
    const result = getEmbedUrl('https://vimeo.com/123456789');
    expect(result).toBe('https://player.vimeo.com/video/123456789');
  });

  test('returns null for invalid URL', () => {
    expect(getEmbedUrl('https://example.com')).toBeNull();
  });
});

describe('getThumbnailUrl', () => {
  test('returns YouTube thumbnail URL', () => {
    const result = getThumbnailUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    expect(result).toBe('https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg');
  });

  test('returns null for Vimeo', () => {
    const result = getThumbnailUrl('https://vimeo.com/123456789');
    expect(result).toBeNull();
  });

  test('returns null for invalid URL', () => {
    expect(getThumbnailUrl('https://example.com')).toBeNull();
  });
});

describe('isValidVideoUrl', () => {
  test('returns true for valid YouTube URL', () => {
    expect(isValidVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true);
  });

  test('returns true for valid Vimeo URL', () => {
    expect(isValidVideoUrl('https://vimeo.com/123456789')).toBe(true);
  });

  test('returns false for invalid URL', () => {
    expect(isValidVideoUrl('https://example.com')).toBe(false);
  });

  test('returns false for random string', () => {
    expect(isValidVideoUrl('not-a-url')).toBe(false);
  });
});

describe('getVideoPlatformName', () => {
  test('returns YouTube for YouTube URL', () => {
    expect(getVideoPlatformName('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('YouTube');
  });

  test('returns Vimeo for Vimeo URL', () => {
    expect(getVideoPlatformName('https://vimeo.com/123456789')).toBe('Vimeo');
  });

  test('returns Unknown for invalid URL', () => {
    expect(getVideoPlatformName('https://example.com')).toBe('Unknown');
  });
});

describe('sanitizeUrl', () => {
  test('allows https URLs', () => {
    expect(sanitizeUrl('https://youtube.com/watch?v=abc')).toBe(
      'https://youtube.com/watch?v=abc'
    );
  });

  test('allows http URLs', () => {
    expect(sanitizeUrl('http://example.com')).toBe('http://example.com');
  });

  test('blocks javascript: URLs', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBe('#');
  });

  test('blocks data: URLs', () => {
    expect(sanitizeUrl('data:text/html,<h1>test</h1>')).toBe('#');
  });

  test('returns # for empty string', () => {
    expect(sanitizeUrl('')).toBe('#');
  });

  test('blocks ftp: URLs', () => {
    expect(sanitizeUrl('ftp://files.example.com')).toBe('#');
  });

  test('returns # for malformed URL', () => {
    expect(sanitizeUrl('not a valid url at all')).toBe('#');
  });
});
