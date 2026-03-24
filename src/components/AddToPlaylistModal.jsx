import React, { useState } from 'react';
import { useTutorials } from '../hooks/useTutorials';
import { useAuth } from '../hooks/useAuth';
import Modal from './Modal';
import styles from './AddToPlaylistModal.module.css';

export default function AddToPlaylistModal({ isOpen, onClose, tutorialId }) {
  const { currentUser } = useAuth();
  const { getUserPlaylists, createPlaylist, addTutorialToPlaylist, removeTutorialFromPlaylist } = useTutorials();

  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  if (!isOpen || !currentUser) return null;

  const playlists = getUserPlaylists(currentUser.id);

  const handleTogglePlaylist = (playlist) => {
    if (playlist.tutorialIds.includes(tutorialId)) {
      removeTutorialFromPlaylist(currentUser.id, playlist.id, tutorialId);
    } else {
      addTutorialToPlaylist(currentUser.id, playlist.id, tutorialId);
    }
  };

  const handleCreatePlaylist = (e) => {
    e.preventDefault();
    if (newPlaylistName.trim()) {
      const newPl = createPlaylist(currentUser.id, newPlaylistName.trim());
      addTutorialToPlaylist(currentUser.id, newPl.id, tutorialId);
      setNewPlaylistName('');
      setIsCreating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Save to Playlist">
      <div className={styles.container}>
        {playlists.length > 0 ? (
          <div className={styles.playlistList}>
            {playlists.map(pl => (
              <label key={pl.id} className={styles.playlistItem}>
                <input
                  type="checkbox"
                  checked={pl.tutorialIds.includes(tutorialId)}
                  onChange={() => handleTogglePlaylist(pl)}
                />
                <span className={styles.playlistName}>{pl.name}</span>
                <span className={styles.playlistCount}>({pl.tutorialIds.length})</span>
              </label>
            ))}
          </div>
        ) : (
          <p className={styles.emptyMsg}>You don't have any playlists yet.</p>
        )}

        {isCreating ? (
          <form onSubmit={handleCreatePlaylist} className={styles.createForm}>
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Playlist Name"
              autoFocus
              className={styles.input}
            />
            <div className={styles.actions}>
              <button type="button" onClick={() => setIsCreating(false)} className={styles.cancelBtn}>Cancel</button>
              <button type="submit" disabled={!newPlaylistName.trim()} className={styles.submitBtn}>Create</button>
            </div>
          </form>
        ) : (
          <button onClick={() => setIsCreating(true)} className={styles.createBtn}>
            + Create New Playlist
          </button>
        )}
      </div>
    </Modal>
  );
}
