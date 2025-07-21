export interface VideoData {
  url: string;
  size: number;
  title: string;
  createdAt: string;
}

export interface StoredVideos {
  [videoId: string]: VideoData;
}

const STORAGE_KEY = 'shared-videos';
const MAX_STORED_VIDEOS = 50; // Limitar el número de videos almacenados

export const generateVideoId = (): string => {
  return `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const storeVideo = (videoId: string, videoData: VideoData): void => {
  try {
    const storedVideos = getStoredVideos();
    storedVideos[videoId] = videoData;
    
    // Limitar el número de videos almacenados
    const videoIds = Object.keys(storedVideos);
    if (videoIds.length > MAX_STORED_VIDEOS) {
      // Ordenar por fecha de creación y eliminar los más antiguos
      const sortedIds = videoIds.sort((a, b) => {
        const dateA = new Date(storedVideos[a].createdAt).getTime();
        const dateB = new Date(storedVideos[b].createdAt).getTime();
        return dateA - dateB;
      });
      
      // Eliminar los videos más antiguos
      for (let i = 0; i < videoIds.length - MAX_STORED_VIDEOS; i++) {
        delete storedVideos[sortedIds[i]];
      }
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedVideos));
  } catch (error) {
    console.error('Error storing video:', error);
  }
};

export const getStoredVideos = (): StoredVideos => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error getting stored videos:', error);
    return {};
  }
};

export const getVideo = (videoId: string): VideoData | null => {
  try {
    const storedVideos = getStoredVideos();
    return storedVideos[videoId] || null;
  } catch (error) {
    console.error('Error getting video:', error);
    return null;
  }
};

export const removeVideo = (videoId: string): void => {
  try {
    const storedVideos = getStoredVideos();
    delete storedVideos[videoId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedVideos));
  } catch (error) {
    console.error('Error removing video:', error);
  }
};

export const cleanupOldVideos = (daysOld: number = 7): void => {
  try {
    const storedVideos = getStoredVideos();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    Object.keys(storedVideos).forEach(videoId => {
      const videoDate = new Date(storedVideos[videoId].createdAt);
      if (videoDate < cutoffDate) {
        delete storedVideos[videoId];
      }
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedVideos));
  } catch (error) {
    console.error('Error cleaning up old videos:', error);
  }
}; 