import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import { setUserEmail } from "../utils/session";
import { registerUser } from "../services/userApi";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName || !normalizedEmail || !password || !confirmPassword) {
      Alert.alert("Missing details", "Please fill all fields.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Weak password", "Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password mismatch", "Passwords do not match.");
      return;
    }

    try {
      const data = await registerUser({
        name: normalizedName,
        email: normalizedEmail,
        password,
      });

      setUserEmail(data.email);
      navigation.navigate("Goal", {
        email: data.email,
      });

    } catch (error) {
      console.log(error);
      Alert.alert("Registration failed", error.message || "Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>

      {/* Header */}
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>
        Start your fitness journey today
      </Text>

      {/* Inputs */}
      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter full name"
        placeholderTextColor="#777"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="you@email.com"
        placeholderTextColor="#777"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Min. 6 characters"
        placeholderTextColor="#777"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Re-enter password"
        placeholderTextColor="#777"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Create Button */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footerRow}>
        <Text style={styles.footerText}>
          Already have an account?
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.signIn}> Sign in</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
    justifyContent: "center",
  },

  back: {
    color: "#C7F000",
    marginBottom: 20,
    fontSize: 16,
  },

  title: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 5,
  },

  subtitle: {
    color: "#777",
    marginBottom: 30,
  },

  label: {
    color: "#aaa",
    marginBottom: 5,
    marginTop: 10,
  },

  input: {
    backgroundColor: "#1a1a1a",
    padding: 15,
    borderRadius: 14,
    color: "#fff",
  },

  button: {
    backgroundColor: "#C7F000",
    padding: 18,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 30,
  },

  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },

  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },

  footerText: {
    color: "#777",
  },

  signIn: {
    color: "#C7F000",
    fontWeight: "bold",
  },
});
