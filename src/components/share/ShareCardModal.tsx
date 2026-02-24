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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { captureCard, shareGeneral, saveToPhotos, shareToInstagramStories } from '@services/share';
import { useDialog } from '@/contexts/DialogContext';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { colors } = useTheme();
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
          onClose();
          setTimeout(() => {
            dialog.alert('Saved!', 'Image saved to your photo library.');
          }, 300);
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
    backgroundColor: colors.surface,
    borderWidth: 3.5,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    maxHeight: '90%',
    shadowColor: colors.border,
    shadowOffset: { width: 6, height: 6 },
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
    fontFamily: 'SpaceMono_700Bold',
    fontSize: 20,
    color: colors.text,
  };

  const closeButtonStyle: ViewStyle = {
    width: 36,
    height: 36,
    borderWidth: 2.5,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
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
    borderWidth: 2.5,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: color,
    shadowColor: colors.border,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  });

  const actionTextStyle: TextStyle = {
    fontFamily: 'SpaceMono_700Bold',
    fontSize: 16,
    color: colors.text,
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
              <MaterialCommunityIcons name="close" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={cardPreviewStyle}>{cardWithRef}</View>

            <View style={actionsStyle}>
              <TouchableOpacity
                style={actionButtonStyle(colors.accent)}
                onPress={() => handleShare('share')}
                activeOpacity={0.7}
                disabled={loading !== null}
              >
                {loading === 'share' ? (
                  <ActivityIndicator color={colors.text} />
                ) : (
                  <>
                    <MaterialCommunityIcons name="share-variant" size={24} color={colors.text} />
                    <Text style={actionTextStyle}>Share</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={actionButtonStyle(colors.primary)}
                onPress={() => handleShare('instagram')}
                activeOpacity={0.7}
                disabled={loading !== null}
              >
                {loading === 'instagram' ? (
                  <ActivityIndicator color={colors.text} />
                ) : (
                  <>
                    <MaterialCommunityIcons name="instagram" size={24} color={colors.text} />
                    <Text style={actionTextStyle}>Instagram Stories</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={actionButtonStyle(colors.secondary)}
                onPress={() => handleShare('save')}
                activeOpacity={0.7}
                disabled={loading !== null}
              >
                {loading === 'save' ? (
                  <ActivityIndicator color={colors.text} />
                ) : (
                  <>
                    <MaterialCommunityIcons name="download" size={24} color={colors.text} />
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
