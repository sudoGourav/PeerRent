import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from "../services/notification.service";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = async () => {
    try {
      const response = await getNotifications();
      setNotifications(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await getUnreadCount();
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error(error);
    }
  };
  const markNotificationAsRead = async (id) => {
  try {
    await markAsRead(id);

    await loadNotifications();
    await loadUnreadCount();
  } catch (error) {
    console.error(error);
  }
};

const markEveryNotificationAsRead = async () => {
  try {
    await markAllAsRead();

    await loadNotifications();
    await loadUnreadCount();
  } catch (error) {
    console.error(error);
  }
};

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
  }, []);

  return (
    <NotificationContext.Provider
      value={{
  notifications,
  unreadCount,
  loadNotifications,
  loadUnreadCount,
  markNotificationAsRead,
  markEveryNotificationAsRead,
}}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () =>
  useContext(NotificationContext);