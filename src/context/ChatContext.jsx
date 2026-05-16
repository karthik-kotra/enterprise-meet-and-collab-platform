import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { io } from 'socket.io-client';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState({}); // { contactId: [messages...] }
  const [activeContactId, setActiveContactId] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socketRef = useRef(null);

  // Initialize Socket and fetch contacts when user logs in
  useEffect(() => {
    if (!user) {
      if (socketRef.current) socketRef.current.disconnect();
      return;
    }

    // Fetch contacts
    const fetchContacts = async () => {
      try {
        const res = await fetch('/api/users', {
          // ensure cookie is sent
          headers: { 'Content-Type': 'application/json' },
        });
        if (res.ok) {
          const data = await res.json();
          // Provide a fallback role if not present
          const processedContacts = data.map(c => ({
            id: c._id,
            name: c.name,
            email: c.email,
            role: c.role || 'Member'
          }));
          setContacts(processedContacts);
        }
      } catch (err) {
        console.error('Failed to fetch contacts:', err);
      }
    };
    fetchContacts();

    // Setup Socket
    socketRef.current = io('http://localhost:5000', {
      withCredentials: true,
    });

    socketRef.current.on('connect', () => {
      socketRef.current.emit('register_user', user.id);
    });

    socketRef.current.on('online_users', (users) => {
      setOnlineUsers(users);
    });

    socketRef.current.on('receiveMessage', (msg) => {
      // The message involves either us sending it, or us receiving it.
      // We group messages by the ID of the *other* person.
      const otherPersonId = msg.senderId === user.id ? msg.receiverId : msg.senderId;
      
      setMessages((prev) => {
        const existing = prev[otherPersonId] || [];
        // Prevent duplicates
        if (existing.find(m => m._id === msg._id)) return prev;
        
        return {
          ...prev,
          [otherPersonId]: [...existing, msg],
        };
      });
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user]);

  // Fetch message history when clicking a contact
  useEffect(() => {
    if (!activeContactId || !user) return;

    // Check if we already have them loaded (optional optimization, but we'll fetch to ensure it's fresh)
    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/chat/${activeContactId}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(prev => ({
            ...prev,
            [activeContactId]: data
          }));
        }
      } catch (err) {
        console.error('Failed to fetch chat history', err);
      }
    };

    fetchHistory();
  }, [activeContactId, user]);

  const getMessages = useCallback(
    (contactId) => messages[contactId] || [],
    [messages]
  );

  const sendMessage = useCallback((receiverId, text) => {
    if (!socketRef.current || !user) return;
    
    // We emit to socket, and listen for 'receiveMessage' to update UI
    socketRef.current.emit('sendMessage', {
      senderId: user.id,
      receiverId,
      text
    });
  }, [user]);

  const getLastMessage = useCallback(
    (contactId) => {
      const msgs = messages[contactId] || [];
      return msgs[msgs.length - 1] || null;
    },
    [messages]
  );

  // Map online status into contacts
  const contactsWithStatus = contacts.map(c => ({
    ...c,
    online: onlineUsers.includes(c.id)
  }));

  return (
    <ChatContext.Provider
      value={{ 
        contacts: contactsWithStatus, 
        messages, 
        activeContactId, 
        setActiveContactId, 
        getMessages, 
        sendMessage, 
        getLastMessage, 
        currentUser: user 
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
