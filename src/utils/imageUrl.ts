const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Converts a relative image path to a full URL
 * @param path - The image path (can be relative or full URL)
 * @returns Full URL to the image
 */
export const getImageUrl = (path: string | null): string | null => {
  if (!path) return null;
  
  // If already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Combine base URL with path
  return `${API_BASE_URL}/${cleanPath}`;
};