import { useContext } from 'react';
import { TutorialContext } from '../contexts/TutorialContext';

export function useTutorials() {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorials must be used within a TutorialProvider');
  }
  return context;
}
