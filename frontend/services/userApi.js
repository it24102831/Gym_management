import { BASE_URL } from "../config";

const parseResponse = async (response) => {
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(data.message || data.error || "Request failed");
  }

  return data;
};

const request = async (path, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    return await parseResponse(response);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("Server returned an invalid response");
    }
    throw error;
  }
};

export const registerUser = (payload) => request("/api/users/register", {
  method: "POST",
  body: JSON.stringify(payload),
});

export const loginUser = (payload) => request("/api/users/login", {
  method: "POST",
  body: JSON.stringify(payload),
});

export const getUserProfile = (email) =>
  request(`/api/users/profile?email=${encodeURIComponent(email)}`);

export const updateUserProfile = (payload) => request("/api/users/profile", {
  method: "PUT",
  body: JSON.stringify(payload),
});
