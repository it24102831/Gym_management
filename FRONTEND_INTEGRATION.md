# Frontend Integration Guide: AI Generators

## Overview
This guide explains how to integrate the AI meal and workout generators into the React Native frontend.

## API Client Setup

Create a new service file `frontend/services/generatorService.js`:

```javascript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://your-backend-url/api'; // Update with your backend URL

const generatorAPI = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 second timeout for generator requests
});

// Meal Generator APIs
export const generateMealPlan = async (userId, preferences) => {
  try {
    const response = await generatorAPI.post(
      `/generators/meal/personalized/${userId}`,
      preferences
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to generate meal plan');
  }
};

export const generateSingleMeal = async (mealType, constraints) => {
  try {
    const response = await generatorAPI.post(
      '/generators/meal/single',
      { mealType, ...constraints }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to generate meal');
  }
};

export const generateMacroOptimizedMeal = async (macros) => {
  try {
    const response = await generatorAPI.post(
      '/generators/meal/macro-optimized',
      macros
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to generate macro meal');
  }
};

// Workout Generator APIs
export const generateWorkoutPlan = async (userId, preferences) => {
  try {
    const response = await generatorAPI.post(
      `/generators/workout/personalized/${userId}`,
      preferences
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to generate workout');
  }
};

export const generateFocusedWorkout = async (focusMuscle, constraints) => {
  try {
    const response = await generatorAPI.post(
      '/generators/workout/focused',
      { focusMuscle, ...constraints }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to generate workout');
  }
};

export const generateCardioSession = async (cardioType, duration) => {
  try {
    const response = await generatorAPI.post(
      '/generators/workout/cardio',
      { cardioType, duration }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to generate cardio');
  }
};

export const generateProgressionPlan = async (exercise, weeks) => {
  try {
    const response = await generatorAPI.post(
      '/generators/workout/progression',
      { exercise, weeks }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to generate progression');
  }
};
```

## Screen Examples

### 1. Meal Generator Screen

```javascript
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import { generateMealPlan } from '../services/generatorService';

export default function MealGeneratorScreen({ userId }) {
  const [loading, setLoading] = useState(false);
  const [mealPlan, setMealPlan] = useState(null);
  const [preferences, setPreferences] = useState({
    mealsPerDay: 3,
    targetCalories: 2500,
    dietaryRestrictions: [],
    allergies: [],
  });

  const handleGenerateMealPlan = async () => {
    if (!userId) {
      Alert.alert('Error', 'User ID not found');
      return;
    }

    setLoading(true);
    try {
      const result = await generateMealPlan(userId, preferences);
      if (result.success) {
        setMealPlan(result.data.mealPlan);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Meal Plan Generator</Text>

      {/* Input Fields */}
      <View style={styles.section}>
        <Text style={styles.label}>Meals per Day</Text>
        {/* Add input component for mealsPerDay */}

        <Text style={styles.label}>Target Calories</Text>
        {/* Add input component for targetCalories */}
      </View>

      {/* Generate Button */}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleGenerateMealPlan}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Generate Meal Plan</Text>
        )}
      </TouchableOpacity>

      {/* Results */}
      {mealPlan && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Generated Meal Plan</Text>
          <Text style={styles.resultText}>{mealPlan}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
});
```

### 2. Workout Generator Screen

```javascript
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Picker,
} from 'react-native';
import { generateWorkoutPlan, generateFocusedWorkout } from '../services/generatorService';

export default function WorkoutGeneratorScreen({ userId }) {
  const [loading, setLoading] = useState(false);
  const [workout, setWorkout] = useState(null);
  const [generationType, setGenerationType] = useState('personalized'); // personalized, focused
  const [preferences, setPreferences] = useState({
    goal: 'muscle_building',
    daysPerWeek: 4,
    sessionDuration: 60,
  });

  const handleGenerateWorkout = async () => {
    if (!userId) {
      Alert.alert('Error', 'User ID not found');
      return;
    }

    setLoading(true);
    try {
      let result;
      if (generationType === 'personalized') {
        result = await generateWorkoutPlan(userId, preferences);
      } else {
        result = await generateFocusedWorkout('chest', { difficulty: 'intermediate' });
      }

      if (result.success) {
        setWorkout(result.data.workoutPlan || result.data.workout);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Workout Generator</Text>

      {/* Generation Type Selector */}
      <View style={styles.section}>
        <Text style={styles.label}>Generation Type</Text>
        <Picker
          selectedValue={generationType}
          onValueChange={setGenerationType}
          style={styles.picker}
        >
          <Picker.Item label="Personalized Plan" value="personalized" />
          <Picker.Item label="Focused Workout" value="focused" />
        </Picker>
      </View>

      {/* Generate Button */}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleGenerateWorkout}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Generate Workout</Text>
        )}
      </TouchableOpacity>

      {/* Results */}
      {workout && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Generated Workout</Text>
          <Text style={styles.resultText}>{workout}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  picker: {
    height: 50,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
});
```

## Navigation Setup

Add screens to your navigation stack in `navigation/AppNavigator.js`:

```javascript
import MealGeneratorScreen from '../screens/MealGeneratorScreen';
import WorkoutGeneratorScreen from '../screens/WorkoutGeneratorScreen';

// Add to your stack navigator:
<Stack.Screen name="MealGenerator" component={MealGeneratorScreen} />
<Stack.Screen name="WorkoutGenerator" component={WorkoutGeneratorScreen} />
```

## Loading States

Implement proper loading and error handling:

```javascript
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const handleGenerate = async () => {
  setLoading(true);
  setError(null);
  try {
    const result = await generateMealPlan(userId, preferences);
    // Handle result
  } catch (err) {
    setError(err.message);
    Alert.alert('Error', err.message);
  } finally {
    setLoading(false);
  }
};
```

## Tips

1. **Long Generation Times**: Show loading indicator and inform users it may take 15-30 seconds
2. **Network Timeout**: Ensure backend API URL is correct
3. **User Context**: Store generated plans in AsyncStorage for offline access
4. **Favorites**: Add ability to save favorite meal/workout plans
5. **Sharing**: Allow users to share generated plans via social media or email

## Testing

Use Postman or Insomnia to test API endpoints before integrating into frontend.

Example Postman collection requests available in documentation.
