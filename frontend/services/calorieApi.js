import { BASE_URL } from "../config";

const USER_ID_FALLBACK = "demo-user-001";

const request = async (path, options = {}) => {
  const response = await fetch(`${BASE_URL}/api/logs${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.error || "Calorie request failed");
  }

  return data;
};

export const getCalorieUserId = (email) => email || USER_ID_FALLBACK;

export const createMealLog = (userId, mealData) => request("/", {
  method: "POST",
  body: JSON.stringify({ userId: userId || USER_ID_FALLBACK, ...mealData }),
});

export const getTodayLogs = (userId) => request(`/${encodeURIComponent(userId || USER_ID_FALLBACK)}`);

export const getWeeklyLogs = (userId) => request(`/${encodeURIComponent(userId || USER_ID_FALLBACK)}/weekly`);

export const getMonthlyLogs = (userId) => request(`/${encodeURIComponent(userId || USER_ID_FALLBACK)}/monthly`);

export const updateMealLog = (id, mealData) => request(`/${id}`, {
  method: "PUT",
  body: JSON.stringify(mealData),
});

export const deleteMealLog = (id) => request(`/${id}`, { method: "DELETE" });

export const FOOD_DATABASE = [
  { foodName: "Grilled Chicken Breast (100g)", calories: 165, protein: 31, carbs: 0, fats: 3.6 },
  { foodName: "Brown Rice (100g cooked)", calories: 111, protein: 2.6, carbs: 23, fats: 0.9 },
  { foodName: "Whole Egg (1 large)", calories: 78, protein: 6, carbs: 0.6, fats: 5 },
  { foodName: "Banana (1 medium)", calories: 89, protein: 1.1, carbs: 23, fats: 0.3 },
  { foodName: "Apple (1 medium)", calories: 95, protein: 0.5, carbs: 25, fats: 0.3 },
  { foodName: "Salmon (100g)", calories: 208, protein: 20, carbs: 0, fats: 13 },
  { foodName: "Greek Yogurt (100g)", calories: 59, protein: 10, carbs: 3.6, fats: 0.4 },
  { foodName: "Oatmeal (100g dry)", calories: 389, protein: 17, carbs: 66, fats: 7 },
  { foodName: "Whey Protein (1 scoop 30g)", calories: 120, protein: 25, carbs: 3, fats: 1 },
  { foodName: "Sweet Potato (100g)", calories: 86, protein: 1.6, carbs: 20, fats: 0.1 },
  { foodName: "Broccoli (100g)", calories: 34, protein: 2.8, carbs: 7, fats: 0.4 },
  { foodName: "Almonds (30g)", calories: 173, protein: 6, carbs: 6, fats: 15 },
  { foodName: "Avocado (100g)", calories: 160, protein: 2, carbs: 9, fats: 15 },
  { foodName: "Tuna in Water (100g)", calories: 116, protein: 26, carbs: 0, fats: 1 },
  { foodName: "White Rice (100g cooked)", calories: 130, protein: 2.7, carbs: 28, fats: 0.3 },
  { foodName: "Chicken Curry (1 cup)", calories: 320, protein: 26, carbs: 12, fats: 18 },
  { foodName: "Chicken Biryani (1 cup)", calories: 330, protein: 17, carbs: 39, fats: 11 },
  { foodName: "Kottu Roti Chicken (1 plate)", calories: 640, protein: 29, carbs: 72, fats: 24 },
  { foodName: "Hoppers Egg (1 hopper)", calories: 190, protein: 7, carbs: 19, fats: 9 },
  { foodName: "Paratha (1 piece)", calories: 260, protein: 5, carbs: 31, fats: 12 },
  { foodName: "Mango (1 cup slices)", calories: 99, protein: 1.4, carbs: 25, fats: 0.6 },
  { foodName: "Cashews (30g)", calories: 166, protein: 5.5, carbs: 9, fats: 13 },
];

export const searchFoods = (query) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return FOOD_DATABASE.slice(0, 8);
  }

  return FOOD_DATABASE
    .filter((food) => food.foodName.toLowerCase().includes(normalized))
    .slice(0, 8);
};
