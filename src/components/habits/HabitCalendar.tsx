import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';

interface HabitCalendarProps {
  checkIns: { date: string; completed: boolean }[];
  onDayPress?: (date: string) => void;
  currentMonth?: Date;
  onMonthChange?: (date: Date) => void;
}

export function HabitCalendar({
  checkIns,
  onDayPress,
  currentMonth = new Date(),
  onMonthChange,
}: HabitCalendarProps) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the day of week for the first day (0 = Sunday)
  const firstDayOfWeek = getDay(monthStart);

  // Create padding days for the calendar grid
  const paddingDays = Array(firstDayOfWeek).fill(null);
  const allDays = [...paddingDays, ...daysInMonth];

  // Check if a date has a check-in
  const isCheckedIn = (date: Date): boolean => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return checkIns.some((checkIn) => checkIn.date === dateStr && checkIn.completed);
  };

  const handlePrevMonth = () => {
    if (onMonthChange) {
      onMonthChange(subMonths(currentMonth, 1));
    }
  };

  const handleNextMonth = () => {
    if (onMonthChange) {
      onMonthChange(addMonths(currentMonth, 1));
    }
  };

  const handleDayPress = (date: Date) => {
    if (onDayPress) {
      const dateStr = format(date, 'yyyy-MM-dd');
      onDayPress(dateStr);
    }
  };

  const today = new Date();
  const isToday = (date: Date): boolean => isSameDay(date, today);

  const containerStyle: ViewStyle = {
    width: '100%',
  };

  const headerStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  };

  const monthTextStyle: TextStyle = {
    fontWeight: '900',
    fontSize: 20,
    color: '#000000',
  };

  const navButtonStyle: ViewStyle = {
    width: 40,
    height: 40,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  };

  const weekdaysContainerStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  };

  const weekdayTextStyle: TextStyle = {
    fontWeight: '800',
    fontSize: 12,
    color: '#000000',
    width: 40,
    textAlign: 'center',
  };

  const gridStyle: ViewStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
  };

  const dayContainerStyle: ViewStyle = {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    padding: 2,
  };

  const getDayBoxStyle = (date: Date | null, checked: boolean, today: boolean): ViewStyle => {
    let bgColor = '#FFFFFF';
    if (checked) {
      bgColor = '#00FF00';
    } else if (today) {
      bgColor = '#FFD700';
    }

    return {
      flex: 1,
      borderWidth: 3,
      borderColor: '#000000',
      borderRadius: 0,
      backgroundColor: bgColor,
      justifyContent: 'center',
      alignItems: 'center',
      opacity: date ? 1 : 0,
    };
  };

  const dayTextStyle: TextStyle = {
    fontWeight: '800',
    fontSize: 14,
    color: '#000000',
  };

  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <View style={containerStyle}>
      {/* Header with month navigation */}
      <View style={headerStyle}>
        <TouchableOpacity
          style={navButtonStyle}
          onPress={handlePrevMonth}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={20} color="#000000" />
        </TouchableOpacity>

        <Text style={monthTextStyle}>
          {format(currentMonth, 'MMMM yyyy')}
        </Text>

        <TouchableOpacity
          style={navButtonStyle}
          onPress={handleNextMonth}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-forward" size={20} color="#000000" />
        </TouchableOpacity>
      </View>

      {/* Weekday labels */}
      <View style={weekdaysContainerStyle}>
        {weekdays.map((day, index) => (
          <Text key={index} style={weekdayTextStyle}>
            {day}
          </Text>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={gridStyle}>
        {allDays.map((day, index) => {
          if (!day) {
            return (
              <View key={`padding-${index}`} style={dayContainerStyle}>
                <View style={getDayBoxStyle(null, false, false)} />
              </View>
            );
          }

          const checked = isCheckedIn(day);
          const isTodayDate = isToday(day);

          return (
            <View key={format(day, 'yyyy-MM-dd')} style={dayContainerStyle}>
              <TouchableOpacity
                style={getDayBoxStyle(day, checked, isTodayDate)}
                onPress={() => handleDayPress(day)}
                activeOpacity={0.7}
                disabled={!onDayPress}
              >
                <Text style={dayTextStyle}>{format(day, 'd')}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      {/* Legend */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View
            style={{
              width: 20,
              height: 20,
              borderWidth: 3,
              borderColor: '#000000',
              backgroundColor: '#00FF00',
            }}
          />
          <Text style={{ fontWeight: '700', fontSize: 12, color: '#000000' }}>Completed</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View
            style={{
              width: 20,
              height: 20,
              borderWidth: 3,
              borderColor: '#000000',
              backgroundColor: '#FFD700',
            }}
          />
          <Text style={{ fontWeight: '700', fontSize: 12, color: '#000000' }}>Today</Text>
        </View>
      </View>
    </View>
  );
}
