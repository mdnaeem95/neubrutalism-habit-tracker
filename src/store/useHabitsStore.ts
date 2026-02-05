import { create } from 'zustand';
import type { Habit, CheckIn, CreateHabitInput, UpdateHabitInput, HabitWithStats } from '@/types/habit';
import {
  createHabit as createHabitApi,
  getUserHabits,
  updateHabit as updateHabitApi,
  deleteHabit as deleteHabitApi,
  archiveHabit as archiveHabitApi,
  createCheckIn as createCheckInApi,
  getHabitCheckIns,
  getCheckInForDate as getCheckInForDateApi,
  updateCheckIn as updateCheckInApi,
} from '@services/firebase/habits';
import {
  calculateCurrentStreak,
  calculateLongestStreak,
  calculateTotalCompletions,
  calculateCompletionRate,
  isTodayCheckedIn,
  getTodayDate,
} from '@utils/habitCalculations';
import {
  trackHabitCreated,
  trackHabitCheckIn,
  trackHabitDeleted,
  trackHabitArchived,
  trackStreakMilestone,
} from '@services/firebase/analytics';

interface HabitsState {
  habits: HabitWithStats[];
  selectedHabit: HabitWithStats | null;
  checkIns: Record<string, CheckIn[]>; // habitId -> checkIns[]
  loading: boolean;
  error: string | null;
}

interface HabitsActions {
  // Habit CRUD
  fetchHabits: (userId: string) => Promise<void>;
  createHabit: (userId: string, input: CreateHabitInput, userPlan?: 'free' | 'premium' | 'trial') => Promise<Habit>;
  updateHabit: (habitId: string, input: UpdateHabitInput) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;
  archiveHabit: (habitId: string) => Promise<void>;

  // Check-ins
  fetchCheckIns: (habitId: string) => Promise<void>;
  toggleCheckIn: (userId: string, habitId: string, date?: string) => Promise<void>;
  updateCheckInNote: (checkInId: string, note: string) => Promise<void>;

  // Computed data
  enrichHabitWithStats: (habit: Habit, checkIns: CheckIn[]) => HabitWithStats;
  getHabitById: (habitId: string) => HabitWithStats | undefined;

  // State management
  setSelectedHabit: (habit: HabitWithStats | null) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type HabitsStore = HabitsState & HabitsActions;

export const useHabitsStore = create<HabitsStore>((set, get) => ({
  // Initial state
  habits: [],
  selectedHabit: null,
  checkIns: {},
  loading: false,
  error: null,

  // Enrich habit with stats
  enrichHabitWithStats: (habit: Habit, checkIns: CheckIn[]): HabitWithStats => {
    const currentStreak = calculateCurrentStreak(checkIns);
    const longestStreak = calculateLongestStreak(checkIns);
    const totalCompletions = calculateTotalCompletions(checkIns);
    const completionRate = calculateCompletionRate(checkIns, 30);
    const todayCheckedIn = isTodayCheckedIn(checkIns);
    const lastCheckIn = checkIns[0]; // Assuming sorted by date desc

    return {
      ...habit,
      currentStreak,
      longestStreak,
      totalCompletions,
      completionRate,
      lastCheckIn,
      todayCheckedIn,
    };
  },

  // Fetch all habits for a user
  fetchHabits: async (userId: string) => {
    try {
      set({ loading: true, error: null });

      const habits = await getUserHabits(userId, false);

      // Fetch check-ins for all habits
      const checkInsMap: Record<string, CheckIn[]> = {};
      const enrichedHabits: HabitWithStats[] = [];

      for (const habit of habits) {
        const checkIns = await getHabitCheckIns(habit.id);
        checkInsMap[habit.id] = checkIns;
        enrichedHabits.push(get().enrichHabitWithStats(habit, checkIns));
      }

      set({
        habits: enrichedHabits,
        checkIns: checkInsMap,
        loading: false,
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Create a new habit
  createHabit: async (userId: string, input: CreateHabitInput, userPlan: 'free' | 'premium' | 'trial' = 'free') => {
    try {
      set({ loading: true, error: null });

      // Check free tier limit (5 habits)
      const currentHabits = get().habits;
      const activeHabits = currentHabits.filter((h) => !h.archived);

      if (userPlan === 'free' && activeHabits.length >= 5) {
        const error = new Error('Free tier limit reached. Upgrade to Premium for unlimited habits!');
        set({ error: error.message, loading: false });
        throw error;
      }

      const newHabit = await createHabitApi(userId, input);
      const enrichedHabit = get().enrichHabitWithStats(newHabit, []);

      set((state) => ({
        habits: [enrichedHabit, ...state.habits],
        checkIns: { ...state.checkIns, [newHabit.id]: [] },
        loading: false,
      }));

      // Track habit creation
      trackHabitCreated(input.category, input.color);

      return newHabit;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Update a habit
  updateHabit: async (habitId: string, input: UpdateHabitInput) => {
    try {
      set({ loading: true, error: null });

      await updateHabitApi(habitId, input);

      set((state) => ({
        habits: state.habits.map((h) =>
          h.id === habitId ? { ...h, ...input } : h
        ),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Delete a habit
  deleteHabit: async (habitId: string) => {
    try {
      set({ loading: true, error: null });

      // Get habit stats before deleting
      const habit = get().habits.find((h) => h.id === habitId);
      const totalCompletions = habit?.totalCompletions || 0;

      await deleteHabitApi(habitId);

      set((state) => {
        const newCheckIns = { ...state.checkIns };
        delete newCheckIns[habitId];

        return {
          habits: state.habits.filter((h) => h.id !== habitId),
          checkIns: newCheckIns,
          selectedHabit:
            state.selectedHabit?.id === habitId ? null : state.selectedHabit,
          loading: false,
        };
      });

      // Track habit deletion
      trackHabitDeleted(habitId, totalCompletions);
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Archive a habit
  archiveHabit: async (habitId: string) => {
    try {
      set({ loading: true, error: null });

      await archiveHabitApi(habitId);

      set((state) => ({
        habits: state.habits.filter((h) => h.id !== habitId),
        loading: false,
      }));

      // Track habit archival
      trackHabitArchived(habitId);
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Fetch check-ins for a habit
  fetchCheckIns: async (habitId: string) => {
    try {
      const checkIns = await getHabitCheckIns(habitId);

      set((state) => ({
        checkIns: { ...state.checkIns, [habitId]: checkIns },
        habits: state.habits.map((h) =>
          h.id === habitId ? get().enrichHabitWithStats(h, checkIns) : h
        ),
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  // Toggle check-in for a habit
  toggleCheckIn: async (userId: string, habitId: string, date?: string) => {
    try {
      const checkInDate = date || getTodayDate();
      const existingCheckIn = await getCheckInForDateApi(habitId, checkInDate);

      if (existingCheckIn) {
        // Toggle the completion status
        await updateCheckInApi(
          existingCheckIn.id,
          !existingCheckIn.completed,
          existingCheckIn.note
        );

        // Update local state
        set((state) => {
          const habitCheckIns = state.checkIns[habitId] || [];
          const updatedCheckIns = habitCheckIns.map((c) =>
            c.id === existingCheckIn.id
              ? { ...c, completed: !c.completed }
              : c
          );

          const habit = state.habits.find((h) => h.id === habitId);
          const updatedHabit = habit
            ? get().enrichHabitWithStats(habit, updatedCheckIns)
            : null;

          return {
            checkIns: { ...state.checkIns, [habitId]: updatedCheckIns },
            habits: state.habits.map((h) =>
              h.id === habitId && updatedHabit ? updatedHabit : h
            ),
          };
        });
      } else {
        // Create new check-in
        const newCheckIn = await createCheckInApi(
          userId,
          habitId,
          checkInDate,
          true
        );

        // Update local state
        set((state) => {
          const habitCheckIns = state.checkIns[habitId] || [];
          const updatedCheckIns = [newCheckIn, ...habitCheckIns];

          const habit = state.habits.find((h) => h.id === habitId);
          const updatedHabit = habit
            ? get().enrichHabitWithStats(habit, updatedCheckIns)
            : null;

          // Track check-in and streak milestones
          if (updatedHabit) {
            trackHabitCheckIn(habitId, updatedHabit.currentStreak);

            // Track milestone streaks (7, 14, 30, 60, 90, 180, 365 days)
            const milestones = [7, 14, 30, 60, 90, 180, 365];
            if (milestones.includes(updatedHabit.currentStreak)) {
              trackStreakMilestone(habitId, updatedHabit.currentStreak);
            }
          }

          return {
            checkIns: { ...state.checkIns, [habitId]: updatedCheckIns },
            habits: state.habits.map((h) =>
              h.id === habitId && updatedHabit ? updatedHabit : h
            ),
          };
        });
      }
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  // Update check-in note
  updateCheckInNote: async (checkInId: string, note: string) => {
    try {
      // Find the check-in in state
      const state = get();
      let habitId: string | null = null;
      let checkIn: CheckIn | null = null;

      for (const [hId, checkIns] of Object.entries(state.checkIns)) {
        const found = checkIns.find((c) => c.id === checkInId);
        if (found) {
          habitId = hId;
          checkIn = found;
          break;
        }
      }

      if (!habitId || !checkIn) {
        throw new Error('Check-in not found');
      }

      await updateCheckInApi(checkInId, checkIn.completed, note);

      // Update local state
      set((state) => {
        const habitCheckIns = state.checkIns[habitId!] || [];
        const updatedCheckIns = habitCheckIns.map((c) =>
          c.id === checkInId ? { ...c, note } : c
        );

        return {
          checkIns: { ...state.checkIns, [habitId!]: updatedCheckIns },
        };
      });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  // Get habit by ID
  getHabitById: (habitId: string) => {
    return get().habits.find((h) => h.id === habitId);
  },

  // Set selected habit
  setSelectedHabit: (habit: HabitWithStats | null) => {
    set({ selectedHabit: habit });
  },

  // Set error
  setError: (error: string | null) => {
    set({ error });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
