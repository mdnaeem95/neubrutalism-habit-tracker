import { useEffect } from 'react';
import { View, Text, ScrollView, ViewStyle, TextStyle } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@components/ui';
import { useHabitsStore } from '@store/useHabitsStore';
import { trackScreenView } from '@services/firebase/analytics';
import { format, subDays } from 'date-fns';

export default function StatsScreen() {
  const { habits, checkIns } = useHabitsStore();

  useEffect(() => {
    trackScreenView('Stats');
  }, []);

  // Calculate overall stats
  const activeHabits = habits.filter((h) => !h.archived);
  const totalCheckIns = Object.values(checkIns).flat().filter((c) => c.completed).length;
  const totalStreaks = habits.reduce((sum, h) => sum + h.currentStreak, 0);
  const longestStreak = Math.max(...habits.map((h) => h.longestStreak), 0);
  const averageCompletion = activeHabits.length > 0
    ? Math.round(activeHabits.reduce((sum, h) => sum + h.completionRate, 0) / activeHabits.length)
    : 0;

  // Calculate this week's stats
  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => format(subDays(today, 6 - i), 'yyyy-MM-dd'));

  const thisWeekCheckIns = Object.entries(checkIns).reduce((count, [_, habitCheckIns]) => {
    return count + habitCheckIns.filter(c =>
      c.completed && last7Days.includes(c.date)
    ).length;
  }, 0);

  const possibleCheckIns = activeHabits.length * 7;
  const weekCompletionRate = possibleCheckIns > 0
    ? Math.round((thisWeekCheckIns / possibleCheckIns) * 100)
    : 0;

  // Get top 3 performing habits
  const topHabits = [...activeHabits]
    .sort((a, b) => b.completionRate - a.completionRate)
    .slice(0, 3);

  // Calculate category breakdown
  const categoryStats = activeHabits.reduce((acc, habit) => {
    const category = habit.category;
    if (!acc[category]) {
      acc[category] = { count: 0, completions: 0 };
    }
    acc[category].count++;
    acc[category].completions += habit.totalCompletions;
    return acc;
  }, {} as Record<string, { count: number; completions: number }>);

  // Get daily activity for the week
  const dailyActivity = last7Days.map(date => {
    const dayCheckIns = Object.entries(checkIns).reduce((count, [_, habitCheckIns]) => {
      return count + habitCheckIns.filter(c => c.completed && c.date === date).length;
    }, 0);
    return {
      date,
      count: dayCheckIns,
      dayName: format(new Date(date), 'EEE'),
    };
  });

  const maxDailyActivity = Math.max(...dailyActivity.map(d => d.count), 1);

  const getColorValue = (color: string): string => {
    switch (color) {
      case 'yellow': return '#FFD700';
      case 'pink': return '#FF69B4';
      case 'cyan': return '#00FFFF';
      case 'lime': return '#00FF00';
      case 'orange': return '#FF6B35';
      default: return '#FFD700';
    }
  };

  const headerStyle: ViewStyle = {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 16,
  };

  const titleStyle: TextStyle = {
    fontWeight: '900',
    fontSize: 48,
    color: '#000000',
    marginBottom: 8,
  };

  const sectionTitleStyle: TextStyle = {
    fontWeight: '800',
    fontSize: 18,
    color: '#000000',
    marginBottom: 12,
  };

  const statBoxStyle: ViewStyle = {
    padding: 16,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    flex: 1,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  };

  const statValueStyle: TextStyle = {
    fontWeight: '900',
    fontSize: 32,
    color: '#000000',
    marginBottom: 4,
  };

  const statLabelStyle: TextStyle = {
    fontWeight: '700',
    fontSize: 12,
    color: '#000000',
    textAlign: 'center',
  };

  const habitItemStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <StatusBar style="dark" />

      <View style={headerStyle}>
        <Text style={titleStyle}>Stats</Text>
      </View>

      <View style={{ paddingHorizontal: 24 }}>
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
        <Card style={{ marginBottom: 24, backgroundColor: '#FFD700' }}>
          <Text style={sectionTitleStyle}>This Week</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontWeight: '900', fontSize: 48, color: '#000000' }}>
                {weekCompletionRate}%
              </Text>
              <Text style={{ fontWeight: '700', fontSize: 14, color: '#000000' }}>
                Completion Rate
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontWeight: '800', fontSize: 24, color: '#000000' }}>
                {thisWeekCheckIns}/{possibleCheckIns}
              </Text>
              <Text style={{ fontWeight: '600', fontSize: 12, color: '#000000' }}>
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
                        borderWidth: 3,
                        borderColor: '#000000',
                        backgroundColor: day.count > 0 ? '#00FF00' : '#E0E0E0',
                      }}
                    />
                  </View>
                  <Text style={{ fontWeight: '700', fontSize: 10, color: '#000000' }}>
                    {day.dayName}
                  </Text>
                  <Text style={{ fontWeight: '800', fontSize: 14, color: '#000000', marginTop: 4 }}>
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
                    borderWidth: 3,
                    borderColor: '#000000',
                    backgroundColor: getColorValue(habit.color),
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                  }}
                >
                  <Ionicons name={habit.icon as any} size={24} color="#000000" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '800', fontSize: 16, color: '#000000' }}>
                    {habit.name}
                  </Text>
                  <Text style={{ fontWeight: '600', fontSize: 12, color: '#666666' }}>
                    {habit.currentStreak} day streak • {habit.completionRate}% completion
                  </Text>
                </View>
                <View
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderWidth: 3,
                    borderColor: '#000000',
                    backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#E0E0E0' : '#CD7F32',
                  }}
                >
                  <Text style={{ fontWeight: '900', fontSize: 14, color: '#000000' }}>
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
                    borderBottomWidth: 1,
                    borderBottomColor: '#E0E0E0',
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '800', fontSize: 16, color: '#000000' }}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Text>
                    <Text style={{ fontWeight: '600', fontSize: 12, color: '#666666' }}>
                      {stats.count} habit{stats.count !== 1 ? 's' : ''}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontWeight: '900', fontSize: 20, color: '#000000' }}>
                      {stats.completions}
                    </Text>
                    <Text style={{ fontWeight: '600', fontSize: 10, color: '#666666' }}>
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
                borderWidth: 8,
                borderColor: '#000000',
                borderRadius: 0,
                backgroundColor: averageCompletion >= 80 ? '#00FF00' : averageCompletion >= 50 ? '#FFD700' : '#FF6B35',
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000000',
                shadowOffset: { width: 4, height: 4 },
                shadowOpacity: 1,
                shadowRadius: 0,
              }}
            >
              <Text style={{ fontWeight: '900', fontSize: 40, color: '#000000' }}>
                {averageCompletion}%
              </Text>
            </View>
            <Text style={{ fontWeight: '700', fontSize: 14, color: '#000000', marginTop: 16, textAlign: 'center' }}>
              Average Completion Rate
            </Text>
            <Text style={{ fontWeight: '600', fontSize: 12, color: '#666666', marginTop: 4, textAlign: 'center' }}>
              {averageCompletion >= 80 ? 'Excellent! Keep it up! 🔥' :
               averageCompletion >= 50 ? 'Good progress! 💪' :
               'You can do better! 🎯'}
            </Text>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}
