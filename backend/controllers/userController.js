import User from "../models/User.js";
import bcrypt from "bcryptjs";

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();
const toOptionalNumber = (value) => {
  if (value === undefined || value === null || value === "") return undefined;
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : NaN;
};
const withoutPassword = (user) => {
  const data = user.toObject ? user.toObject() : { ...user };
  delete data.password;
  return data;
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const cleanName = String(name || "").trim();
    const cleanEmail = normalizeEmail(email);

    if (!cleanName || !cleanEmail || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "User already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = normalizeEmail(email);

    if (!cleanEmail || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: cleanEmail });

    if (user && await bcrypt.compare(password, user.password)) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const {
      email,
      goal,
      targetWeight,
      height,
      weight,
      activityLevel,
      calories,
      protein,
    } = req.body;

    const cleanEmail = normalizeEmail(email);

    if (!cleanEmail) {
      return res.status(400).json({ message: "Email required" });
    }

    const numericFields = {
      targetWeight: toOptionalNumber(targetWeight),
      height: toOptionalNumber(height),
      weight: toOptionalNumber(weight),
      calories: toOptionalNumber(calories),
      protein: toOptionalNumber(protein),
    };

    if (Object.values(numericFields).some((value) => Number.isNaN(value))) {
      return res.status(400).json({ message: "Profile numbers must be valid" });
    }

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (goal !== undefined) user.goal = goal;
    if (numericFields.targetWeight !== undefined) user.targetWeight = numericFields.targetWeight;
    if (numericFields.height !== undefined) user.height = numericFields.height;
    if (numericFields.weight !== undefined) user.weight = numericFields.weight;
    if (activityLevel !== undefined) user.activityLevel = activityLevel;
    if (numericFields.calories !== undefined) user.calories = numericFields.calories;
    if (numericFields.protein !== undefined) user.protein = numericFields.protein;

    const updatedUser = await user.save();

    res.json(withoutPassword(updatedUser));

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { email } = req.body;
    const cleanEmail = normalizeEmail(email);

    if (!cleanEmail) {
      return res.status(400).json({ message: "Email required" });
    }

    const user = await User.findOneAndDelete({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
