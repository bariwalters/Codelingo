// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.tsx to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });


import { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, Pressable, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { onAuthStateChanged, User } from "firebase/auth";

import { signUpWithEmail, loginWithEmail, logout } from "./src/firebase/auth";
import { auth } from "./src/firebase/firebase";
import { getUserProfile } from "./src/firebase/db";

export default function App() {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [userInfo, setUserInfo] = useState<any>(null);

  // ✅ 1) Listen for auth state changes (updates UI reliably)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      console.log("onAuthStateChanged:", user ? user.uid : "signed out");
      setFirebaseUser(user);

      if (user) {
        const profile = await getUserProfile(user.uid);
        console.log("Loaded profile:", profile);
        setUserInfo(profile);
      } else {
        setUserInfo(null);
      }
    });

    return () => unsub();
  }, []);

  async function handleSignUp() {
    try {
      console.log("Attempting signup:", { email, username });

      const user = await signUpWithEmail({ email, password, username });

      console.log("Signup success:", user.uid, user.email);

      // profile doc should be created in signUpWithEmail -> createUserProfile
      const profile = await getUserProfile(user.uid);
      console.log("Profile after signup:", profile);
      setUserInfo(profile);

      Alert.alert("Sign up success", `UID: ${user.uid}`);
    } catch (err: any) {
      console.log("Signup error:", err);
      Alert.alert("Sign up error", err?.message ?? String(err));
    }
  }

  async function handleLogin() {
    try {
      console.log("Attempting login:", email);
      const user = await loginWithEmail(email, password);

      console.log("Login success:", user.uid, user.email);

      const profile = await getUserProfile(user.uid);
      console.log("Profile after login:", profile);
      setUserInfo(profile);

      Alert.alert("Login success", `UID: ${user.uid}`);
    } catch (err: any) {
      console.log("Login error:", err);
      Alert.alert("Login error", err?.message ?? String(err));
    }
  }

  async function handleLogout() {
    try {
      await logout();
      Alert.alert("Logged out");
    } catch (err: any) {
      console.log("Logout error:", err);
      Alert.alert("Logout error", err?.message ?? String(err));
    }
  }

  // ✅ 3) Debug button to prove what auth thinks is happening
  function handleDebugWhoAmI() {
    if (!auth.currentUser) {
      Alert.alert("No current user", "auth.currentUser is null");
      return;
    }
    Alert.alert("Current user", `UID: ${auth.currentUser.uid}\nEmail: ${auth.currentUser.email}`);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔥 Firebase Auth Test</Text>

      <Pressable style={styles.debugBtn} onPress={handleDebugWhoAmI}>
        <Text style={styles.debugText}>Who am I? (debug)</Text>
      </Pressable>

      {!firebaseUser && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Password (min 6 chars)"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Pressable style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </Pressable>

          <Pressable style={styles.buttonSecondary} onPress={handleLogin}>
            <Text style={styles.buttonText}>Log In</Text>
          </Pressable>
        </>
      )}

      {firebaseUser && (
        <>
          <Text style={styles.success}>✅ Logged in UID: {firebaseUser.uid}</Text>
          <Text>Email: {firebaseUser.email}</Text>

          <Text style={{ marginTop: 10, fontWeight: "600" }}>Firestore Profile:</Text>
          <Text>Username: {userInfo?.username ?? "(missing profile)"}</Text>
          <Text>XP: {userInfo?.xp ?? "-"}</Text>
          <Text>Streak: {userInfo?.streak ?? "-"}</Text>

          <Pressable style={styles.buttonSecondary} onPress={handleLogout}>
            <Text style={styles.buttonText}>Log Out</Text>
          </Pressable>
        </>
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10,
  },
  debugBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 16,
  },
  debugText: {
    color: "#111",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  button: {
    width: "100%",
    backgroundColor: "#4f46e5",
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonSecondary: {
    width: "100%",
    backgroundColor: "#64748b",
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
  success: {
    fontSize: 16,
    marginBottom: 10,
  },
});
