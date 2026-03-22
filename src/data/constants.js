export const CATEGORIES = [
  { value: '2D', label: '2D Development', icon: '🎮' },
  { value: '3D', label: '3D Development', icon: '🧊' },
  { value: 'Programming', label: 'Programming', icon: '💻' },
  { value: 'Art', label: 'Art & Design', icon: '🎨' },
  { value: 'Audio', label: 'Audio & Music', icon: '🎵' },
  { value: 'Game Design', label: 'Game Design', icon: '📐' },
];

export const DIFFICULTIES = [
  { value: 'Beginner', label: 'Beginner', color: 'var(--color-accent-success)' },
  { value: 'Intermediate', label: 'Intermediate', color: 'var(--color-accent-warning)' },
  { value: 'Advanced', label: 'Advanced', color: 'var(--color-accent-danger)' },
];

export const PLATFORMS = [
  { value: 'Unity', label: 'Unity' },
  { value: 'Unreal', label: 'Unreal Engine' },
  { value: 'Godot', label: 'Godot' },
  { value: 'GameMaker', label: 'GameMaker' },
  { value: 'Custom', label: 'Custom / Other' },
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'highest-rated', label: 'Highest Rated' },
  { value: 'most-viewed', label: 'Most Viewed' },
];

export const DURATION_RANGES = [
  { value: 'any', label: 'Any Duration', min: 0, max: Infinity },
  { value: 'short', label: 'Under 15 min', min: 0, max: 15 },
  { value: 'medium', label: '15 - 60 min', min: 15, max: 60 },
  { value: 'long', label: '1 - 3 hours', min: 60, max: 180 },
  { value: 'extra-long', label: 'Over 3 hours', min: 180, max: Infinity },
];

export const VIDEO_PLATFORMS = {
  youtube: {
    name: 'YouTube',
    patterns: [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([\w-]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([\w-]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([\w-]{11})/,
    ],
  },
  vimeo: {
    name: 'Vimeo',
    patterns: [
      /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/,
    ],
  },
};
