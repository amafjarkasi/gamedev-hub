import PropTypes from 'prop-types';

export const tutorialShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  url: PropTypes.string.isRequired,
  thumbnailUrl: PropTypes.string,
  category: PropTypes.string.isRequired,
  difficulty: PropTypes.oneOf(['Beginner', 'Intermediate', 'Advanced']).isRequired,
  platform: PropTypes.string.isRequired,
  engineVersion: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  estimatedDuration: PropTypes.number,
  seriesId: PropTypes.string,
  seriesOrder: PropTypes.number,
  prerequisites: PropTypes.arrayOf(PropTypes.string),
  author: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
  }),
  viewCount: PropTypes.number,
  averageRating: PropTypes.number,
  ratingCount: PropTypes.number,
  isFeatured: PropTypes.bool,
});

export const filterShape = PropTypes.shape({
  searchQuery: PropTypes.string,
  categories: PropTypes.arrayOf(PropTypes.string),
  difficulties: PropTypes.arrayOf(PropTypes.string),
  platforms: PropTypes.arrayOf(PropTypes.string),
  engineVersions: PropTypes.arrayOf(PropTypes.string),
  durationRange: PropTypes.string,
  minRating: PropTypes.number,
});
