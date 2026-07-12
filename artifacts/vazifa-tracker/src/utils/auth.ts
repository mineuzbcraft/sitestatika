
import {
  getAuth,
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { auth } from "../firebase-config";

// Re-export User type for convenience
export type { User };

// Listener function type
type AuthStateListener = (user: User | null) => void;

// Array of listeners
const listeners: AuthStateListener[] = [];

// Notify all listeners about an auth state change
const notifyListeners = (user: User | null) => {
  listeners.forEach(listener => listener(user));
};

// Subscribe to auth state changes
onAuthStateChanged(auth, (user) => {
  notifyListeners(user);
});

/**
 * Registers a callback to be invoked when the user's auth state changes.
 * @param callback The function to call when the auth state changes.
 * @returns A function to unsubscribe the callback.
 */
export const onAuthChange = (callback: AuthStateListener): (() => void) => {
  listeners.push(callback);
  
  // Immediately call with current state
  callback(auth.currentUser);

  // Return an unsubscribe function
  return () => {
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
};

/**
 * Signs in a user with email and password.
 * @param email The user's email.
 * @param password The user's password.
 * @returns A promise that resolves with the user credential.
 */
export const login = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Creates a new user with email and password.
 * @param email The new user's email.
 * @param password The new user's password.
 * @returns A promise that resolves with the user credential.
 */
export const register = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

/**
 * Signs out the current user.
 * @returns A promise that resolves when sign-out is complete.
 */
export const logout = () => {
  return signOut(auth);
};
