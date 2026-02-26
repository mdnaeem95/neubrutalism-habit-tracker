import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Badge } from '@components/ui';
import { PremiumLockBadge } from '@components/ui/PremiumLockBadge';
import { useTheme } from '@/contexts/ThemeContext';
import { HABIT_TEMPLATES, type HabitTemplate } from '@/constants/habitTemplates';
import { getFrequencyLabel } from '@utils/frequencyUtils';
import type { HabitCategory } from '@/types/habit';

const CATEGORIES: (HabitCategory | 'all')[] = ['all', 'health', 'fitness', 'productivity', 'learning', 'mindfulness', 'other'];

interface TemplatePickerModalProps {
  visible: boolean;
  isPremium: boolean;
  onSelect: (template: HabitTemplate) => void;
  onPremiumPress: () => void;
  onClose: () => void;
}

export const TemplatePickerModal: React.FC<TemplatePickerModalProps> = ({
  visible,
  isPremium,
  onSelect,
  onPremiumPress,
  onClose,
}) => {
  const { colors } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory | 'all'>('all');

  const filteredTemplates = selectedCategory === 'all'
    ? HABIT_TEMPLATES
    : HABIT_TEMPLATES.filter((t) => t.category === selectedCategory);

  const getColorValue = (color: string): string => {
    switch (color) {
      case 'yellow': return colors.warning;
      case 'pink': return colors.primary;
      case 'cyan': return colors.secondary;
      case 'lime': return colors.accent;
      case 'orange': return colors.orange;
      default: return colors.warning;
    }
  };

  const handleSelect = (template: HabitTemplate) => {
    if (template.isPremium && !isPremium) {
      onPremiumPress();
      return;
    }
    onSelect(template);
  };

  const categoryChipStyle = (isSelected: boolean): ViewStyle => ({
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 2.5,
    borderColor: colors.border,
    borderRadius: 9999,
    backgroundColor: isSelected ? colors.secondary : colors.surface,
    shadowColor: colors.border,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
    flexShrink: 0,
  });

  const templateCardStyle = (color: string): ViewStyle => ({
    borderWidth: 2.5,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: getColorValue(color),
    padding: 14,
    marginBottom: 12,
    shadowColor: colors.border,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  });

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Header */}
        <View style={{ paddingHorizontal: 24, paddingTop: 48, paddingBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 24, color: colors.text }}>
              Templates
            </Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <Text style={{ fontFamily: 'SpaceMono_400Regular', fontSize: 14, color: colors.textMuted }}>
            Choose a template to get started quickly
          </Text>
        </View>

        {/* Category tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, gap: 8, marginBottom: 16 }}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={categoryChipStyle(selectedCategory === cat)}
              onPress={() => setSelectedCategory(cat)}
              activeOpacity={0.7}
            >
              <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 12, color: colors.text }} numberOfLines={1}>
                {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Template list */}
        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 48 }}>
          {filteredTemplates.map((template) => (
            <TouchableOpacity
              key={template.id}
              style={templateCardStyle(template.color)}
              onPress={() => handleSelect(template)}
              activeOpacity={0.8}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <View style={{
                  width: 40,
                  height: 40,
                  borderWidth: 2,
                  borderColor: colors.border,
                  borderRadius: 10,
                  backgroundColor: colors.surface,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12,
                }}>
                  <MaterialCommunityIcons name={template.icon as any} size={22} color={colors.text} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 16, color: colors.text }}>
                    {template.name}
                  </Text>
                  <Text style={{ fontFamily: 'SpaceMono_400Regular', fontSize: 12, color: colors.text }} numberOfLines={1}>
                    {template.description}
                  </Text>
                </View>
                {template.isPremium && !isPremium && (
                  <PremiumLockBadge size="sm" />
                )}
              </View>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                <Badge variant="default">{getFrequencyLabel(template.frequency)}</Badge>
                {template.trackingType !== 'boolean' && (
                  <Badge variant="info">
                    {template.trackingType === 'duration' ? 'Duration' : 'Quantity'}
                  </Badge>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};
