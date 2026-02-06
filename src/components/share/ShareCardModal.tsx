import { useState, useRef, ReactElement, cloneElement } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { captureCard, shareGeneral, saveToPhotos, shareToInstagramStories } from '@services/share';
import { useDialog } from '@/contexts/DialogContext';

interface ShareCardModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactElement;
  title?: string;
}

type ShareAction = 'share' | 'instagram' | 'save';

export function ShareCardModal({
  visible,
  onClose,
  children,
  title = 'Share Your Progress',
}: ShareCardModalProps) {
  const [loading, setLoading] = useState<ShareAction | null>(null);
  const cardRef = useRef<View | null>(null);
  const dialog = useDialog();

  const handleShare = async (action: ShareAction) => {
    setLoading(action);

    try {
      const imageUri = await captureCard(cardRef as React.RefObject<View>);

      switch (action) {
        case 'share':
          await shareGeneral(imageUri, {
            title: 'Share',
            message: 'Check out my progress on Block! #BlockHabits',
          });
          break;
        case 'instagram':
          try {
            await shareToInstagramStories(imageUri);
          } catch (error: any) {
            if (error.message === 'Instagram is not installed') {
              dialog.alert('Instagram Not Found', 'Please install Instagram to share to Stories.');
            } else {
              // Fallback to general share
              await shareGeneral(imageUri, {
                title: 'Share to Instagram',
                message: 'Check out my progress on Block! #BlockHabits',
              });
            }
          }
          break;
        case 'save':
          await saveToPhotos(imageUri);
          dialog.alert('Saved!', 'Image saved to your photo library.');
          break;
      }
    } catch (error: any) {
      console.error('Share error:', error);
      if (error.message !== 'Permission to access media library was denied') {
        dialog.alert('Error', error.message || 'Failed to share. Please try again.');
      } else {
        dialog.alert('Permission Required', 'Please grant access to your photo library to save images.');
      }
    } finally {
      setLoading(null);
    }
  };

  const overlayStyle: ViewStyle = {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const containerStyle: ViewStyle = {
    backgroundColor: '#F5F5F5',
    borderWidth: 4,
    borderColor: '#000000',
    borderRadius: 0,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    maxHeight: '90%',
    shadowColor: '#000000',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  };

  const headerStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  };

  const titleStyle: TextStyle = {
    fontWeight: '900',
    fontSize: 20,
    color: '#000000',
  };

  const closeButtonStyle: ViewStyle = {
    width: 36,
    height: 36,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const cardPreviewStyle: ViewStyle = {
    alignItems: 'center',
    marginBottom: 24,
  };

  const actionsStyle: ViewStyle = {
    gap: 12,
  };

  const actionButtonStyle = (color: string): ViewStyle => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: color,
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  });

  const actionTextStyle: TextStyle = {
    fontWeight: '800',
    fontSize: 16,
    color: '#000000',
    marginLeft: 12,
  };

  // Clone the child and pass the ref
  const cardWithRef = cloneElement(children, { ref: cardRef } as any);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={overlayStyle}>
        <View style={containerStyle}>
          <View style={headerStyle}>
            <Text style={titleStyle}>{title}</Text>
            <TouchableOpacity
              style={closeButtonStyle}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={20} color="#000000" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={cardPreviewStyle}>{cardWithRef}</View>

            <View style={actionsStyle}>
              <TouchableOpacity
                style={actionButtonStyle('#00FF00')}
                onPress={() => handleShare('share')}
                activeOpacity={0.7}
                disabled={loading !== null}
              >
                {loading === 'share' ? (
                  <ActivityIndicator color="#000000" />
                ) : (
                  <>
                    <Ionicons name="share-outline" size={24} color="#000000" />
                    <Text style={actionTextStyle}>Share</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={actionButtonStyle('#FF69B4')}
                onPress={() => handleShare('instagram')}
                activeOpacity={0.7}
                disabled={loading !== null}
              >
                {loading === 'instagram' ? (
                  <ActivityIndicator color="#000000" />
                ) : (
                  <>
                    <Ionicons name="logo-instagram" size={24} color="#000000" />
                    <Text style={actionTextStyle}>Instagram Stories</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={actionButtonStyle('#00FFFF')}
                onPress={() => handleShare('save')}
                activeOpacity={0.7}
                disabled={loading !== null}
              >
                {loading === 'save' ? (
                  <ActivityIndicator color="#000000" />
                ) : (
                  <>
                    <Ionicons name="download-outline" size={24} color="#000000" />
                    <Text style={actionTextStyle}>Save to Photos</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
