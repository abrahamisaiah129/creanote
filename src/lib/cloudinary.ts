/**
 * Cloudinary Client-side and Server-side Upload Utility
 *
 * Configured with Creanote credentials:
 * Cloud Name: ddzpchp5x
 * Upload Preset: creanote-client-upload (unsigned)
 */

export const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'ddzpchp5x';

export const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'creanote-client-upload';

/**
 * Upload an image file directly to Cloudinary from the client browser.
 * Falls back to base64 Data URL in offline or test mode.
 */
export async function uploadImageToCloudinary(file: File): Promise<string> {
  // If in Jest / test environment without network, generate a data URL
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'test') {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) || '');
      reader.readAsDataURL(file);
    });
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Upload failed with HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.secure_url || data.url;
  } catch (error) {
    console.warn('Direct Cloudinary upload failed, falling back to local base64:', error);
    // Graceful offline fallback to Base64 data URL so user work is never lost
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) || '');
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(file);
    });
  }
}
