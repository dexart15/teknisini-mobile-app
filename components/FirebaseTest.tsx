import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import { auth, db } from "../config/firebase.config";

export default function FirebaseTest() {
  const [status, setStatus] = useState("Testing Firebase connection...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testFirebaseConnection();
  }, []);

  const testFirebaseConnection = async () => {
    try {
      // Test 1: Check if Firebase is initialized
      if (auth && db) {
        setStatus("✅ Firebase initialized successfully!\n");
      }

      // Test 2: Try to read from Firestore (optional)
      try {
        const testCollection = collection(db, "test");
        await getDocs(testCollection);
        setStatus((prev) => prev + "✅ Firestore connection successful!\n");
      } catch (firestoreError: any) {
        if (firestoreError.code === "permission-denied") {
          setStatus(
            (prev) =>
              prev +
              "⚠️ Firestore connected but permission denied (normal for empty/protected DB)\n"
          );
        } else {
          setStatus(
            (prev) => prev + `⚠️ Firestore: ${firestoreError.message}\n`
          );
        }
      }

      // Test 3: Check Auth
      setStatus(
        (prev) => prev + `✅ Auth configured: ${auth.app.options.projectId}\n`
      );

      setStatus((prev) => prev + "\n🎉 Firebase is ready to use!");
      setLoading(false);
    } catch (error: any) {
      setStatus(`❌ Error: ${error.message}`);
      setLoading(false);
      Alert.alert("Firebase Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Connection Test</Text>
      {loading && <ActivityIndicator size="large" color="#0066CC" />}
      <Text style={styles.status}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  status: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 20,
    lineHeight: 24,
  },
});
