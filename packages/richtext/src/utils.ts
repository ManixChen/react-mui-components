/**
 * Utility functions for RichTextEditor
 */

/**
 * Format file size from bytes to human-readable string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes} bytes`;
  } else if (bytes < 1024 * 1024) {
    // Less than 1MB, show in KB
    const kb = bytes / 1024;
    return `${kb.toFixed(2)} KB`;
  } else {
    // 1MB or more, show in MB
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  }
};

/**
 * Count images in HTML content
 */
export const countImagesInContent = (htmlContent: string): number => {
  if (!htmlContent) return 0;
  try {
    const doc = new DOMParser().parseFromString(htmlContent, 'text/html');
    const images = doc.querySelectorAll('img');
    return images.length;
  } catch (error) {
    // Fallback: use regex to count img tags
    const imgMatches = htmlContent.match(/<img[^>]*>/gi);
    return imgMatches ? imgMatches.length : 0;
  }
};

/**
 * Create image element from URL
 */
export const createImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });
};

/**
 * Default alert handler (console.log)
 */
export const defaultHandleAlert = (message: string, type?: 'success' | 'error' | 'warning' | 'info') => {
  console.log(`[${type || 'info'}] ${message}`);
};

