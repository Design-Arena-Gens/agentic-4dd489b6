"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import {
  getFirebaseAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  User
} from "@/lib/firebase";
import toast from "react-hot-toast";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const authRef = useRef<ReturnType<typeof getFirebaseAuth> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const instance = getFirebaseAuth();
    authRef.current = instance;
    const unsubscribe = instance.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const ensureAuth = () => {
    const instance = authRef.current;
    if (!instance) {
      throw new Error("Firebase auth is not ready yet.");
    }
    return instance;
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      signInWithGoogle: async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(ensureAuth(), provider);
        toast.success("Signed in with Google");
      },
      signInWithEmail: async (email: string, password: string) => {
        await signInWithEmailAndPassword(ensureAuth(), email, password);
        toast.success("Welcome back!");
      },
      signUpWithEmail: async (email: string, password: string) => {
        await createUserWithEmailAndPassword(ensureAuth(), email, password);
        toast.success("Account created!");
      },
      resetPassword: async (email: string) => {
        await sendPasswordResetEmail(ensureAuth(), email);
        toast.success("Password reset email sent");
      },
      logout: async () => {
        await signOut(ensureAuth());
        toast.success("Signed out");
      }
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
