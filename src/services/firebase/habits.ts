import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import type { Habit, CheckIn, CreateHabitInput, UpdateHabitInput } from '@/types/habit';

// Collection references
const habitsCollection = collection(db, 'habits');
const checkInsCollection = collection(db, 'checkIns');

/**
 * Create a new habit
 */
export const createHabit = async (userId: string, input: CreateHabitInput): Promise<Habit> => {
  try {
    const habitData = {
      userId,
      ...input,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      archived: false,
    };

    const docRef = await addDoc(habitsCollection, habitData);
    const habitDoc = await getDoc(docRef);

    if (!habitDoc.exists()) {
      throw new Error('Failed to create habit');
    }

    return {
      id: habitDoc.id,
      ...habitDoc.data(),
    } as Habit;
  } catch (error: any) {
    console.error('Error creating habit:', error);
    throw new Error(error.message || 'Failed to create habit');
  }
};

/**
 * Get all habits for a user
 */
export const getUserHabits = async (userId: string, includeArchived = false): Promise<Habit[]> => {
  try {
    let q = query(
      habitsCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    if (!includeArchived) {
      q = query(
        habitsCollection,
        where('userId', '==', userId),
        where('archived', '==', false),
        orderBy('createdAt', 'desc')
      );
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Habit[];
  } catch (error: any) {
    console.error('Error fetching habits:', error);
    throw new Error(error.message || 'Failed to fetch habits');
  }
};

/**
 * Get a single habit by ID
 */
export const getHabitById = async (habitId: string): Promise<Habit | null> => {
  try {
    const habitDoc = await getDoc(doc(habitsCollection, habitId));

    if (!habitDoc.exists()) {
      return null;
    }

    return {
      id: habitDoc.id,
      ...habitDoc.data(),
    } as Habit;
  } catch (error: any) {
    console.error('Error fetching habit:', error);
    throw new Error(error.message || 'Failed to fetch habit');
  }
};

/**
 * Update a habit
 */
export const updateHabit = async (habitId: string, input: UpdateHabitInput): Promise<void> => {
  try {
    const habitRef = doc(habitsCollection, habitId);
    await updateDoc(habitRef, {
      ...input,
      updatedAt: serverTimestamp(),
    });
  } catch (error: any) {
    console.error('Error updating habit:', error);
    throw new Error(error.message || 'Failed to update habit');
  }
};

/**
 * Delete a habit (permanently)
 */
export const deleteHabit = async (habitId: string): Promise<void> => {
  try {
    await deleteDoc(doc(habitsCollection, habitId));
  } catch (error: any) {
    console.error('Error deleting habit:', error);
    throw new Error(error.message || 'Failed to delete habit');
  }
};

/**
 * Archive a habit
 */
export const archiveHabit = async (habitId: string): Promise<void> => {
  try {
    await updateHabit(habitId, { archived: true });
  } catch (error: any) {
    console.error('Error archiving habit:', error);
    throw new Error(error.message || 'Failed to archive habit');
  }
};

/**
 * Create a check-in for a habit
 */
export const createCheckIn = async (
  userId: string,
  habitId: string,
  date: string,
  completed: boolean,
  note?: string
): Promise<CheckIn> => {
  try {
    const checkInData = {
      userId,
      habitId,
      date,
      completed,
      note: note || null,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(checkInsCollection, checkInData);
    const checkInDoc = await getDoc(docRef);

    if (!checkInDoc.exists()) {
      throw new Error('Failed to create check-in');
    }

    return {
      id: checkInDoc.id,
      ...checkInDoc.data(),
    } as CheckIn;
  } catch (error: any) {
    console.error('Error creating check-in:', error);
    throw new Error(error.message || 'Failed to create check-in');
  }
};

/**
 * Get check-ins for a habit
 */
export const getHabitCheckIns = async (habitId: string, limit?: number): Promise<CheckIn[]> => {
  try {
    let q = query(
      checkInsCollection,
      where('habitId', '==', habitId),
      orderBy('date', 'desc')
    );

    const snapshot = await getDocs(q);
    let checkIns = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CheckIn[];

    if (limit) {
      checkIns = checkIns.slice(0, limit);
    }

    return checkIns;
  } catch (error: any) {
    console.error('Error fetching check-ins:', error);
    throw new Error(error.message || 'Failed to fetch check-ins');
  }
};

/**
 * Get check-in for a specific date
 */
export const getCheckInForDate = async (
  habitId: string,
  date: string
): Promise<CheckIn | null> => {
  try {
    const q = query(
      checkInsCollection,
      where('habitId', '==', habitId),
      where('date', '==', date)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    } as CheckIn;
  } catch (error: any) {
    console.error('Error fetching check-in:', error);
    throw new Error(error.message || 'Failed to fetch check-in');
  }
};

/**
 * Update a check-in
 */
export const updateCheckIn = async (
  checkInId: string,
  completed: boolean,
  note?: string
): Promise<void> => {
  try {
    const checkInRef = doc(checkInsCollection, checkInId);
    await updateDoc(checkInRef, {
      completed,
      note: note || null,
    });
  } catch (error: any) {
    console.error('Error updating check-in:', error);
    throw new Error(error.message || 'Failed to update check-in');
  }
};

/**
 * Delete a check-in
 */
export const deleteCheckIn = async (checkInId: string): Promise<void> => {
  try {
    await deleteDoc(doc(checkInsCollection, checkInId));
  } catch (error: any) {
    console.error('Error deleting check-in:', error);
    throw new Error(error.message || 'Failed to delete check-in');
  }
};

/**
 * Get all check-ins for a user within a date range
 */
export const getUserCheckIns = async (
  userId: string,
  startDate: string,
  endDate: string
): Promise<CheckIn[]> => {
  try {
    const q = query(
      checkInsCollection,
      where('userId', '==', userId),
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CheckIn[];
  } catch (error: any) {
    console.error('Error fetching user check-ins:', error);
    throw new Error(error.message || 'Failed to fetch check-ins');
  }
};
