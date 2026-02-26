import { useEffect, useMemo } from 'react';
import { View, Text, ScrollView, ViewStyle, TextStyle } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from '@components/ui';
import { AdBanner } from '@components/ui/AdBanner';
import { useHabitsStore } from '@store/useHabitsStore';
import { useTheme } from '@/contexts/ThemeContext';
import { trackScreenView } from '@services/firebase/analytics';
import { isHabitScheduledForDate } from '@utils/frequencyUtils';
import { format, subDays } from 'date-fns';

export default function StatsScreen() {
  const { habits, checkIns } = useHabitsStore();
  const { colors, colorScheme } = useTheme();

  useEffect(() => {
    trackScreenView('Stats');
  }, []);

  // Memoize all stat calculations to avoid recomputing on every render
  const activeHabits = useMemo(() => habits.filter((h) => !h.archived), [habits]);

  const { totalCheckIns, totalStreaks, longestStreak, averageCompletion } = useMemo(() => {
    const totalCheckIns = Object.values(checkIns).flat().filter((c) => c.completed).length;
    const totalStreaks = habits.reduce((sum, h) => sum + h.currentStreak, 0);
    const longestStreak = Math.max(...habits.map((h) => h.longestStreak), 0);
    const averageCompletion = activeHabits.length > 0
      ? Math.round(activeHabits.reduce((sum, h) => sum + h.completionRate, 0) / activeHabits.length)
      : 0;
    return { totalCheckIns, totalStreaks, longestStreak, averageCompletion };
  }, [habits, checkIns, activeHabits]);

  const last7Days = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => format(subDays(today, 6 - i), 'yyyy-MM-dd'));
  }, []);

  const { thisWeekCheckIns, possibleCheckIns, weekCompletionRate } = useMemo(() => {
    const thisWeekCheckIns = Object.entries(checkIns).reduce((count, [_, habitCheckIns]) => {
      return count + habitCheckIns.filter(c =>
        c.completed && last7Days.includes(c.date)
      ).length;
    }, 0);

    const possibleCheckIns = activeHabits.reduce((total, habit) => {
      return total + last7Days.filter((dateStr) =>
        isHabitScheduledForDate(habit as any, dateStr)
      ).length;
    }, 0);

    const weekCompletionRate = possibleCheckIns > 0
      ? Math.round((thisWeekCheckIns / possibleCheckIns) * 100)
      : 0;

    return { thisWeekCheckIns, possibleCheckIns, weekCompletionRate };
  }, [checkIns, activeHabits, last7Days]);

  const topHabits = useMemo(() =>
    [...activeHabits].sort((a, b) => b.completionRate - a.completionRate).slice(0, 3),
    [activeHabits]
  );

  const categoryStats = useMemo(() =>
    activeHabits.reduce((acc, habit) => {
      const category = habit.category;
      if (!acc[category]) {
        acc[category] = { count: 0, completions: 0 };
      }
      acc[category].count++;
      acc[category].completions += habit.totalCompletions;
      return acc;
    }, {} as Record<string, { count: number; completions: number }>),
    [activeHabits]
  );

  const dailyActivity = useMemo(() =>
    last7Days.map(date => {
      const dayCheckIns = Object.entries(checkIns).reduce((count, [_, habitCheckIns]) => {
        return count + habitCheckIns.filter(c => c.completed && c.date === date).length;
      }, 0);
      return {
        date,
        count: dayCheckIns,
        dayName: format(new Date(date), 'EEE'),
      };
    }),
    [checkIns, last7Days]
  );

  const maxDailyActivity = useMemo(() => Math.max(...dailyActivity.map(d => d.count), 1), [dailyActivity]);

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

  const statBoxStyle: ViewStyle = {
    padding: 16,
    borderWidth: 2.5,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    flex: 1,
    alignItems: 'center',
    shadowColor: colors.border,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  };

  const statValueStyle: TextStyle = {
    fontFamily: 'SpaceMono_700Bold',
    fontSize: 28,
    color: colors.text,
    marginBottom: 4,
  };

  const statLabelStyle: TextStyle = {
    fontFamily: 'SpaceMono_700Bold',
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
  };

  const sectionTitleStyle: TextStyle = {
    fontFamily: 'SpaceMono_700Bold',
    fontSize: 18,
    color: colors.text,
    marginBottom: 12,
  };

  const habitItemStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.divider,
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      <View style={{ paddingHorizontal: 24, paddingTop: 48, paddingBottom: 16 }}>
        <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 28, color: colors.text, marginBottom: 8 }}>
          Stats
        </Text>
      </View>

      <View style={{ paddingHorizontal: 24 }}>
        {/* Ad Banner */}
        <View style={{ marginBottom: 16 }}>
          <AdBanner unitKey="bannerStats" />
        </View>

        {/* Overall Stats Grid */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
          <View style={{ flex: 1 }}>
            <View style={statBoxStyle}>
              <Text style={statValueStyle}>{activeHabits.length}</Text>
              <Text style={statLabelStyle}>Active Habits</Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <View style={statBoxStyle}>
              <Text style={statValueStyle}>{totalCheckIns}</Text>
              <Text style={statLabelStyle}>Total Check-ins</Text>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
          <View style={{ flex: 1 }}>
            <View style={statBoxStyle}>
              <Text style={statValueStyle}>{totalStreaks}</Text>
              <Text style={statLabelStyle}>Total Streaks</Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <View style={statBoxStyle}>
              <Text style={statValueStyle}>{longestStreak}</Text>
              <Text style={statLabelStyle}>Longest Streak</Text>
            </View>
          </View>
        </View>

        {/* This Week Card */}
        <Card style={{ marginBottom: 24, backgroundColor: colors.warning }}>
          <Text style={sectionTitleStyle}>This Week</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 40, color: colors.text }}>
                {weekCompletionRate}%
              </Text>
              <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 12, color: colors.text }}>
                Completion Rate
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 22, color: colors.text }}>
                {thisWeekCheckIns}/{possibleCheckIns}
              </Text>
              <Text style={{ fontFamily: 'SpaceMono_400Regular', fontSize: 12, color: colors.text }}>
                Check-ins
              </Text>
            </View>
          </View>
        </Card>

        {/* Daily Activity Chart */}
        <Card style={{ marginBottom: 24 }}>
          <Text style={sectionTitleStyle}>Daily Activity</Text>
          <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'space-between' }}>
            {dailyActivity.map((day) => {
              const height = day.count > 0 ? (day.count / maxDailyActivity) * 100 : 10;
              return (
                <View key={day.date} style={{ flex: 1, alignItems: 'center' }}>
                  <View
                    style={{
                      height: 80,
                      justifyContent: 'flex-end',
                      marginBottom: 8,
                    }}
                  >
                    <View
                      style={{
                        width: '100%',
                        height: `${height}%`,
                        minHeight: day.count > 0 ? 12 : 0,
                        borderWidth: 2.5,
                        borderColor: colors.border,
                        borderRadius: 4,
                        backgroundColor: day.count > 0 ? colors.accent : colors.divider,
                      }}
                    />
                  </View>
                  <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 10, color: colors.textMuted }}>
                    {day.dayName}
                  </Text>
                  <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 12, color: colors.text, marginTop: 4 }}>
                    {day.count}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>

        {/* Top Performing Habits */}
        {topHabits.length > 0 && (
          <Card style={{ marginBottom: 24 }}>
            <Text style={sectionTitleStyle}>Top Performing Habits</Text>
            {topHabits.map((habit, index) => (
              <View key={habit.id} style={habitItemStyle}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderWidth: 2.5,
                    borderColor: colors.border,
                    borderRadius: 12,
                    backgroundColor: getColorValue(habit.color),
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                  }}
                >
                  <MaterialCommunityIcons name={habit.icon as any} size={24} color={colors.text} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 15, color: colors.text }}>
                    {habit.name}
                  </Text>
                  <Text style={{ fontFamily: 'SpaceMono_400Regular', fontSize: 12, color: colors.textMuted }}>
                    {habit.currentStreak} day streak - {habit.completionRate}% completion
                  </Text>
                </View>
                <View
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderWidth: 2.5,
                    borderColor: colors.border,
                    borderRadius: 8,
                    backgroundColor: index === 0 ? colors.warning : index === 1 ? colors.surface : colors.orange,
                  }}
                >
                  <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 12, color: colors.text }}>
                    #{index + 1}
                  </Text>
                </View>
              </View>
            ))}
          </Card>
        )}

        {/* Category Breakdown */}
        {Object.keys(categoryStats).length > 0 && (
          <Card style={{ marginBottom: 24 }}>
            <Text style={sectionTitleStyle}>Category Breakdown</Text>
            {Object.entries(categoryStats).map(([category, stats]) => {
              return (
                <View
                  key={category}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: 12,
                    borderBottomWidth: 1.5,
                    borderBottomColor: colors.divider,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 15, color: colors.text }}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Text>
                    <Text style={{ fontFamily: 'SpaceMono_400Regular', fontSize: 12, color: colors.textMuted }}>
                      {stats.count} habit{stats.count !== 1 ? 's' : ''}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 18, color: colors.text }}>
                      {stats.completions}
                    </Text>
                    <Text style={{ fontFamily: 'SpaceMono_400Regular', fontSize: 10, color: colors.textMuted }}>
                      total check-ins
                    </Text>
                  </View>
                </View>
              );
            })}
          </Card>
        )}

        {/* Overall Completion Rate */}
        <Card style={{ marginBottom: 48 }}>
          <Text style={sectionTitleStyle}>Overall Performance</Text>
          <View style={{ alignItems: 'center', paddingVertical: 16 }}>
            <View
              style={{
                width: 120,
                height: 120,
                borderWidth: 3.5,
                borderColor: colors.border,
                borderRadius: 16,
                backgroundColor: averageCompletion >= 80 ? colors.accent : averageCompletion >= 50 ? colors.warning : colors.orange,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: colors.border,
                shadowOffset: { width: 4, height: 4 },
                shadowOpacity: 1,
                shadowRadius: 0,
              }}
            >
              <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 36, color: colors.text }}>
                {averageCompletion}%
              </Text>
            </View>
            <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 12, color: colors.text, marginTop: 16, textAlign: 'center' }}>
              Average Completion Rate
            </Text>
            <Text style={{ fontFamily: 'SpaceMono_400Regular', fontSize: 12, color: colors.textMuted, marginTop: 4, textAlign: 'center' }}>
              {averageCompletion >= 80 ? 'Excellent! Keep it up!' :
               averageCompletion >= 50 ? 'Good progress!' :
               'You can do better!'}
            </Text>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}
