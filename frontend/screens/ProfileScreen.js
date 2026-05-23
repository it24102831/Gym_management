import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";

import { clearUserEmail, getUserEmail } from "../utils/session";
import { getUserProfile, updateUserProfile } from "../services/userApi";

export default function ProfileScreen({ navigation }) {

  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const email = getUserEmail();

  const handleLogout = () => {
    clearUserEmail();
    navigation.replace("Login");
  };

  // =========================
  // FETCH USER
  // =========================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserProfile(email);
        setUser(data);

      } catch (error) {
        console.log("Profile fetch error:", error);
        Alert.alert("Profile error", error.message || "Could not load profile.");
      } finally {
        setLoading(false);
      }
    };

    if (email) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [email]);

  // =========================
  // SAVE UPDATE
  // =========================
  const handleSave = async () => {
    if (!user?.email) {
      Alert.alert("Profile error", "No user profile loaded.");
      return;
    }

    try {
      const data = await updateUserProfile({
        email: user.email,
        goal: user.goal,
        targetWeight: Number(user.targetWeight || 0),
        height: Number(user.height || 0),
        weight: Number(user.weight || 0),
        activityLevel: user.activityLevel,
        calories: Number(user.calories || 0),
        protein: Number(user.protein || 0),
      });

      setUser(data);
      setIsEditing(false);

    } catch (error) {
      console.log("Update error:", error);
      Alert.alert("Update failed", error.message || "Network error");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "white" }}>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "white", marginBottom: 16 }}>No user session found.</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity
          onPress={isEditing ? handleSave : () => setIsEditing(true)}
        >
          <Text style={styles.edit}>
            {isEditing ? "Save" : "Edit"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* AVATAR */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {user.name?.charAt(0).toUpperCase()}
        </Text>
      </View>

      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>

      {/* SUMMARY CARDS */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={String(user.height || "")}
              onChangeText={(text) =>
                setUser({ ...user, height: text })
              }
            />
          ) : (
            <Text style={styles.statValue}>{user.height}cm</Text>
          )}
          <Text style={styles.statLabel}>Height</Text>
        </View>

        <View style={styles.statCard}>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={String(user.weight || "")}
              onChangeText={(text) =>
                setUser({ ...user, weight: text })
              }
            />
          ) : (
            <Text style={styles.statValue}>{user.weight}kg</Text>
          )}
          <Text style={styles.statLabel}>Weight</Text>
        </View>

        <View style={styles.statCard}>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={user.goal || ""}
              onChangeText={(text) =>
                setUser({ ...user, goal: text })
              }
            />
          ) : (
            <Text style={styles.statValue}>{user.goal}</Text>
          )}
          <Text style={styles.statLabel}>Goal</Text>
        </View>
      </View>

      {/* CONTACT INFO */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Info</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{user.name}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>
      </View>

      {/* BODY & ACTIVITY */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Body & Activity</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Height</Text>
          {isEditing ? (
            <TextInput
              style={styles.inputInline}
              value={String(user.height || "")}
              onChangeText={(text) =>
                setUser({ ...user, height: text })
              }
            />
          ) : (
            <Text style={styles.value}>{user.height} cm</Text>
          )}
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Weight</Text>
          {isEditing ? (
            <TextInput
              style={styles.inputInline}
              value={String(user.weight || "")}
              onChangeText={(text) =>
                setUser({ ...user, weight: text })
              }
            />
          ) : (
            <Text style={styles.value}>{user.weight} kg</Text>
          )}
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Activity</Text>
          {isEditing ? (
            <TextInput
              style={styles.inputInline}
              value={user.activityLevel || ""}
              onChangeText={(text) =>
                setUser({ ...user, activityLevel: text })
              }
            />
          ) : (
            <Text style={styles.value}>{user.activityLevel}</Text>
          )}
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Goal</Text>
          {isEditing ? (
            <TextInput
              style={styles.inputInline}
              value={user.goal || ""}
              onChangeText={(text) =>
                setUser({ ...user, goal: text })
              }
            />
          ) : (
            <Text style={styles.value}>{user.goal}</Text>
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { color: "#fff", fontSize: 28, fontWeight: "bold" },
  edit: { color: "#C7F000", fontSize: 16, fontWeight: "bold" },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#C7F000",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 20,
  },
  avatarText: { fontSize: 40, fontWeight: "bold", color: "#000" },
  name: { color: "#fff", fontSize: 22, fontWeight: "bold", textAlign: "center", marginTop: 10 },
  email: { color: "#888", textAlign: "center", marginBottom: 20 },
  statsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  statCard: { backgroundColor: "#111", padding: 15, borderRadius: 15, width: "30%", alignItems: "center" },
  statValue: { color: "#fff", fontWeight: "bold" },
  statLabel: { color: "#888", fontSize: 12 },
  section: { backgroundColor: "#111", padding: 20, borderRadius: 15, marginBottom: 20 },
  sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  label: { color: "#888" },
  value: { color: "#fff", fontWeight: "500" },
  input: {
    backgroundColor: "#222",
    color: "white",
    padding: 5,
    borderRadius: 5,
    textAlign: "center",
    width: 70,
  },
  inputInline: {
    backgroundColor: "#222",
    color: "white",
    padding: 5,
    borderRadius: 5,
    width: 100,
    textAlign: "right",
  },
  logoutButton: {
    marginTop: 10,
    backgroundColor: "#ef4444",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
