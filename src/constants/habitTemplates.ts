import type { HabitCategory, HabitColor, HabitFrequency, HabitTrackingType } from '@/types/habit';

export interface HabitTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: HabitColor;
  category: HabitCategory;
  frequency: HabitFrequency;
  trackingType: HabitTrackingType;
  unit?: string;
  targetValue?: number;
  isPremium: boolean;
}

export const HABIT_TEMPLATES: HabitTemplate[] = [
  // === FREE TEMPLATES (1 per category) ===
  {
    id: 'drink_water',
    name: 'Drink Water',
    description: 'Stay hydrated throughout the day',
    icon: 'water',
    color: 'cyan',
    category: 'health',
    frequency: { type: 'daily' },
    trackingType: 'quantity',
    unit: 'glasses',
    targetValue: 8,
    isPremium: false,
  },
  {
    id: 'exercise',
    name: 'Exercise',
    description: 'Move your body regularly',
    icon: 'run',
    color: 'orange',
    category: 'fitness',
    frequency: { type: 'specific_days', daysOfWeek: [1, 3, 5] },
    trackingType: 'boolean',
    isPremium: false,
  },
  {
    id: 'deep_work',
    name: 'Deep Work',
    description: 'Focus on meaningful work without distractions',
    icon: 'lightbulb',
    color: 'yellow',
    category: 'productivity',
    frequency: { type: 'daily' },
    trackingType: 'duration',
    unit: 'minutes',
    targetValue: 60,
    isPremium: false,
  },
  {
    id: 'read',
    name: 'Read',
    description: 'Read books or articles every day',
    icon: 'book-open-variant',
    color: 'lime',
    category: 'learning',
    frequency: { type: 'daily' },
    trackingType: 'duration',
    unit: 'minutes',
    targetValue: 30,
    isPremium: false,
  },
  {
    id: 'meditate',
    name: 'Meditate',
    description: 'Practice mindfulness and calm your mind',
    icon: 'leaf',
    color: 'lime',
    category: 'mindfulness',
    frequency: { type: 'daily' },
    trackingType: 'duration',
    unit: 'minutes',
    targetValue: 10,
    isPremium: false,
  },
  {
    id: 'journal',
    name: 'Journal',
    description: 'Write down your thoughts and reflections',
    icon: 'pencil',
    color: 'pink',
    category: 'other',
    frequency: { type: 'daily' },
    trackingType: 'boolean',
    isPremium: false,
  },

  // === PREMIUM TEMPLATES ===

  // Health
  {
    id: 'sleep_8_hours',
    name: 'Sleep 8 Hours',
    description: 'Get enough rest for your body and mind',
    icon: 'bed',
    color: 'cyan',
    category: 'health',
    frequency: { type: 'daily' },
    trackingType: 'duration',
    unit: 'hours',
    targetValue: 8,
    isPremium: true,
  },
  {
    id: 'eat_vegetables',
    name: 'Eat Vegetables',
    description: 'Include vegetables in every meal',
    icon: 'food',
    color: 'lime',
    category: 'health',
    frequency: { type: 'daily' },
    trackingType: 'quantity',
    unit: 'servings',
    targetValue: 5,
    isPremium: true,
  },
  {
    id: 'take_vitamins',
    name: 'Take Vitamins',
    description: 'Remember your daily supplements',
    icon: 'heart',
    color: 'pink',
    category: 'health',
    frequency: { type: 'daily' },
    trackingType: 'boolean',
    isPremium: true,
  },
  {
    id: 'no_sugar',
    name: 'No Sugar',
    description: 'Avoid added sugar today',
    icon: 'food',
    color: 'orange',
    category: 'health',
    frequency: { type: 'daily' },
    trackingType: 'boolean',
    isPremium: true,
  },

  // Fitness
  {
    id: '10k_steps',
    name: '10K Steps',
    description: 'Walk at least 10,000 steps daily',
    icon: 'walk',
    color: 'orange',
    category: 'fitness',
    frequency: { type: 'daily' },
    trackingType: 'quantity',
    unit: 'steps',
    targetValue: 10000,
    isPremium: true,
  },
  {
    id: 'stretch',
    name: 'Stretch',
    description: 'Stretch for flexibility and recovery',
    icon: 'run',
    color: 'lime',
    category: 'fitness',
    frequency: { type: 'daily' },
    trackingType: 'duration',
    unit: 'minutes',
    targetValue: 15,
    isPremium: true,
  },
  {
    id: 'yoga',
    name: 'Yoga',
    description: 'Practice yoga for mind-body connection',
    icon: 'leaf',
    color: 'cyan',
    category: 'fitness',
    frequency: { type: 'specific_days', daysOfWeek: [1, 3, 5] },
    trackingType: 'duration',
    unit: 'minutes',
    targetValue: 30,
    isPremium: true,
  },
  {
    id: 'running',
    name: 'Go for a Run',
    description: 'Build your cardio endurance',
    icon: 'run',
    color: 'pink',
    category: 'fitness',
    frequency: { type: 'specific_days', daysOfWeek: [2, 4, 6] },
    trackingType: 'duration',
    unit: 'minutes',
    targetValue: 30,
    isPremium: true,
  },

  // Productivity
  {
    id: 'no_social_media',
    name: 'No Social Media',
    description: 'Stay off social media until evening',
    icon: 'crosshairs-gps',
    color: 'yellow',
    category: 'productivity',
    frequency: { type: 'daily' },
    trackingType: 'boolean',
    isPremium: true,
  },
  {
    id: 'inbox_zero',
    name: 'Inbox Zero',
    description: 'Clear your email inbox daily',
    icon: 'lightbulb',
    color: 'cyan',
    category: 'productivity',
    frequency: { type: 'specific_days', daysOfWeek: [1, 2, 3, 4, 5] },
    trackingType: 'boolean',
    isPremium: true,
  },
  {
    id: 'plan_tomorrow',
    name: 'Plan Tomorrow',
    description: 'Spend 10 minutes planning your next day',
    icon: 'clock',
    color: 'orange',
    category: 'productivity',
    frequency: { type: 'daily' },
    trackingType: 'boolean',
    isPremium: true,
  },

  // Learning
  {
    id: 'practice_language',
    name: 'Practice Language',
    description: 'Learn a new language every day',
    icon: 'book-open-variant',
    color: 'yellow',
    category: 'learning',
    frequency: { type: 'daily' },
    trackingType: 'duration',
    unit: 'minutes',
    targetValue: 15,
    isPremium: true,
  },
  {
    id: 'online_course',
    name: 'Online Course',
    description: 'Make progress on an online course',
    icon: 'lightbulb',
    color: 'cyan',
    category: 'learning',
    frequency: { type: 'specific_days', daysOfWeek: [1, 3, 5] },
    trackingType: 'duration',
    unit: 'minutes',
    targetValue: 30,
    isPremium: true,
  },

  // Mindfulness
  {
    id: 'gratitude',
    name: 'Gratitude',
    description: 'Write down 3 things you are grateful for',
    icon: 'heart',
    color: 'pink',
    category: 'mindfulness',
    frequency: { type: 'daily' },
    trackingType: 'boolean',
    isPremium: true,
  },
  {
    id: 'digital_detox',
    name: 'Digital Detox',
    description: 'No screens for 1 hour before bed',
    icon: 'bed',
    color: 'cyan',
    category: 'mindfulness',
    frequency: { type: 'daily' },
    trackingType: 'boolean',
    isPremium: true,
  },
];

export const FREE_TEMPLATES = HABIT_TEMPLATES.filter((t) => !t.isPremium);
export const PREMIUM_TEMPLATES = HABIT_TEMPLATES.filter((t) => t.isPremium);

export const getTemplatesByCategory = (category?: HabitCategory) => {
  if (!category) return HABIT_TEMPLATES;
  return HABIT_TEMPLATES.filter((t) => t.category === category);
};
