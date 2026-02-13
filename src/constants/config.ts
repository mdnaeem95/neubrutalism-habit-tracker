/**
 * App Configuration
 * Global app settings and constants
 */

export const config = {
  // App info
  app: {
    name: 'HabitBrutal',
    version: '1.0.0',
    description: 'Track your habits with bold, beautiful design',
  },

  // Subscription plans
  subscription: {
    freeTier: {
      maxHabits: 5,
      features: ['Basic statistics', 'Daily reminders', 'Streak tracking'],
    },
    premium: {
      monthly: {
        productId: 'habit_brutal_premium_monthly',
        price: '$4.99',
      },
      yearly: {
        productId: 'habit_brutal_premium_yearly',
        price: '$39.99',
      },
      features: [
        'Unlimited habits',
        'Advanced statistics',
        'Custom themes',
        'Data export',
        'Habit templates',
        'Notes per habit',
        'Priority support',
      ],
    },
    trialDays: 7,
  },

  // Habit categories
  habitCategories: [
    { id: 'health', label: 'Health', icon: 'heart', color: '#FF6B9D' },
    { id: 'productivity', label: 'Productivity', icon: 'flash', color: '#FFD93D' },
    { id: 'fitness', label: 'Fitness', icon: 'dumbbell', color: '#6BCB77' },
    { id: 'learning', label: 'Learning', icon: 'book-open-variant', color: '#4D96FF' },
    { id: 'mindfulness', label: 'Mindfulness', icon: 'leaf', color: '#A855F7' },
    { id: 'other', label: 'Other', icon: 'dots-horizontal', color: '#FF8C42' },
  ] as const,

  // Notification defaults
  notifications: {
    defaultTime: '09:00',
    channels: {
      reminders: {
        id: 'habit-reminders',
        name: 'Habit Reminders',
        description: 'Daily reminders for your habits',
      },
      streaks: {
        id: 'streak-milestones',
        name: 'Streak Milestones',
        description: 'Notifications for streak achievements',
      },
    },
  },

  // Analytics events
  analytics: {
    events: {
      habitCreated: 'habit_created',
      habitCompleted: 'habit_completed',
      streakAchieved: 'streak_achieved',
      subscriptionStarted: 'subscription_started',
      paywallViewed: 'paywall_viewed',
    },
  },
} as const;

export type HabitCategory = (typeof config.habitCategories)[number]['id'];
