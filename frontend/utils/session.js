let currentUserEmail = null;

const getStorage = () => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }

  return window.localStorage;
};

export const setUserEmail = (email) => {
  currentUserEmail = email;

  const storage = getStorage();
  if (storage) {
    if (email) {
      storage.setItem('userEmail', email);
    } else {
      storage.removeItem('userEmail');
    }
  }
};

export const getUserEmail = () => {
  if (currentUserEmail) {
    return currentUserEmail;
  }

  const storage = getStorage();
  if (storage) {
    const storedEmail = storage.getItem('userEmail');
    if (storedEmail) {
      currentUserEmail = storedEmail;
      return storedEmail;
    }
  }

  return currentUserEmail;
};

export const clearUserEmail = () => {
  currentUserEmail = null;

  const storage = getStorage();
  if (storage) {
    storage.removeItem('userEmail');
  }
};
