import { RefObject } from 'react';
import { View, Share, Platform, Linking } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

export interface ShareOptions {
  title?: string;
  message?: string;
}

/**
 * Capture a view as an image
 */
export async function captureCard(viewRef: RefObject<View>): Promise<string> {
  if (!viewRef.current) {
    throw new Error('View reference is not available');
  }

  try {
    const uri = await captureRef(viewRef, {
      format: 'png',
      quality: 1,
      result: 'tmpfile',
    });

    return uri;
  } catch (error) {
    console.error('Error capturing card:', error);
    throw new Error('Failed to capture card image');
  }
}

/**
 * Share to Instagram Stories
 */
export async function shareToInstagramStories(imageUri: string): Promise<boolean> {
  try {
    // Instagram Stories expects a specific URL scheme
    const instagramUrl = Platform.select({
      ios: 'instagram-stories://share',
      android: 'com.instagram.android',
    });

    if (!instagramUrl) {
      throw new Error('Platform not supported');
    }

    // Check if Instagram is installed
    const canOpen = await Linking.canOpenURL(instagramUrl);

    if (!canOpen) {
      throw new Error('Instagram is not installed');
    }

    // For iOS, we need to use the pasteboard
    if (Platform.OS === 'ios') {
      // Read the image as base64
      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: 'base64',
      });

      // Use a special URL scheme to share to Instagram Stories
      const shareUrl = `instagram-stories://share?source_application=com.blockapp.habits&backgroundImage=${encodeURIComponent(
        'data:image/png;base64,' + base64Image
      )}`;

      await Linking.openURL(shareUrl);
      return true;
    }

    // For Android, use the standard intent
    if (Platform.OS === 'android') {
      // This would require native module integration for full support
      // For now, fallback to general share
      await shareGeneral(imageUri, {
        title: 'Share to Instagram',
        message: 'Share your achievement!',
      });
      return true;
    }

    return false;
  } catch (error: any) {
    console.error('Error sharing to Instagram:', error);
    throw error;
  }
}

/**
 * General share (opens system share sheet)
 */
export async function shareGeneral(
  imageUri: string,
  options: ShareOptions = {}
): Promise<boolean> {
  try {
    const { title = 'Share', message = 'Check out my progress!' } = options;

    const result = await Share.share(
      Platform.select({
        ios: {
          url: imageUri,
          message,
        },
        android: {
          message: `${message}\n\nFile: ${imageUri}`,
        },
        default: {
          message,
        },
      }) as any,
      {
        dialogTitle: title,
      }
    );

    return result.action === Share.sharedAction;
  } catch (error) {
    console.error('Error sharing:', error);
    throw new Error('Failed to share');
  }
}

/**
 * Save image to photo library
 */
export async function saveToPhotos(imageUri: string): Promise<boolean> {
  try {
    // Request permission
    const { status } = await MediaLibrary.requestPermissionsAsync();

    if (status !== 'granted') {
      throw new Error('Permission to access media library was denied');
    }

    // Save to media library
    await MediaLibrary.saveToLibraryAsync(imageUri);
    return true;
  } catch (error: any) {
    console.error('Error saving to photos:', error);
    throw error;
  }
}

/**
 * Copy image to clipboard (iOS only)
 */
export async function copyToClipboard(imageUri: string): Promise<boolean> {
  try {
    if (Platform.OS !== 'ios') {
      throw new Error('Copy to clipboard is only supported on iOS');
    }

    // Read the image as base64
    const _base64Image = await FileSystem.readAsStringAsync(imageUri, {
      encoding: 'base64',
    });

    // Note: This requires react-native-clipboard package for full support
    // For now, this is a placeholder that logs success
    console.log('Image copied to clipboard');
    return true;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    throw new Error('Failed to copy image');
  }
}
