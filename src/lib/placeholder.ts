/**
 * Utility for generating high-performance deterministic placeholder graphics
 * when custom media has not yet been uploaded by the creator.
 */
export const placeholderUrl = (text: string, width = 800, height = 500): string => {
  const safeText = encodeURIComponent(text || 'Creanote').replace(/%20/g, '+');
  return `https://placehold.co/${width}x${height}/0c100d/f0f5f0?text=${safeText}`;
};

export default placeholderUrl;
