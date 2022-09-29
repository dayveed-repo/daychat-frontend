import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  currentChat: null,
  chats: null,
  messages: {},
  usersOnline: [],
};

export const counterSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    login: (state, action) => {
      state.currentUser = action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
    },
    changeChat: (state, action) => {
      state.currentChat = action.payload;
    },

    getchats: (state, action) => {
      state.chats = action.payload;
    },

    getMessages: (state, action) => {
      state.messages[action.payload.chatId] = action.payload.messages;
    },

    addMessage: (state, action) => {
      state.messages[action.payload.chatId] = state.messages[
        action.payload.chatId
      ]
        ? [...state.messages[action.payload.chatId], action.payload.message]
        : [action.payload.message];

      if (action.payload.message.sender_id) {
        state.chats = state.chats.map((chat) =>
          chat.doc._id === action.payload.chatId
            ? {
                ...chat,
                doc: { ...chat.doc, recent_message: action.payload.message },
              }
            : chat
        );
      }
    },

    failedMessage: (state, action) => {
      state.messages[action.payload.chatId] = state.messages[
        action.payload.chatId
      ].map((message) =>
        message.message === action.payload.message.message &&
        message._id === action.payload.message._id
          ? { ...message, status: "failed" }
          : message
      );
    },

    sentMessage: (state, action) => {
      state.messages[action.payload.chatId] = state.messages[
        action.payload.chatId
      ].map((message) =>
        message.message === action.payload.initial.message &&
        message._id === action.payload.initial._id
          ? { ...action.payload.message }
          : message
      );

      state.chats = state.chats.map((chat) =>
        chat.doc._id === action.payload.chatId
          ? {
              ...chat,
              doc: { ...chat.doc, recent_message: action.payload.message },
            }
          : chat
      );
    },

    getUsersOnline: (state, action) => {
      state.usersOnline = action.payload;
    },

    addChat: (state, action) => {
      if (state.chats) {
        state.chats = [action.payload, ...state.chats];
      } else {
        state.chats = [action.payload];
      }
    },

    clearChat: (state, action) => {
      state.messages[action.payload.chatId] = [];
    },

    readMessages: (state, action) => {
      state.chats = state.chats.map((chat) =>
        chat.doc._id === action.payload.chatId
          ? { ...chat, unreadMessages: [] }
          : chat
      );
    },

    addUnReadMessage: (state, action) => {
      state.chats = state.chats.map((chat) =>
        chat.doc._id === action.payload.chatId
          ? {
              ...chat,
              unreadMessages: [...chat.unreadMessages, action.payload.message],
            }
          : chat
      );
    },

    togglePinChat: (state, action) => {
      if (state.currentUser.pinned_chats.includes(action.payload)) {
        state.currentUser = {
          ...state.currentUser,
          pinned_chats: state.currentUser.pinned_chats.filter(
            (chatId) => chatId != action.payload
          ),
        };
      } else {
        state.currentUser = {
          ...state.currentUser,
          pinned_chats: [...state.currentUser.pinned_chats, action.payload],
        };
      }
    },

    toggleBlockUser: (state, action) => {
      if (state.currentUser.blocked_users.includes(action.payload)) {
        state.currentUser.blocked_users =
          state.currentUser.blocked_users.filter(
            (userId) => userId !== action.payload
          );
      } else {
        state.currentUser.blocked_users = [
          ...state.currentUser.blocked_users,
          action.payload,
        ];
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  login,
  logout,
  changeChat,
  getchats,
  getMessages,
  addMessage,
  failedMessage,
  sentMessage,
  getUsersOnline,
  addChat,
  clearChat,
  readMessages,
  addUnReadMessage,
  toggleBlockUser,
  togglePinChat,
} = counterSlice.actions;

export default counterSlice.reducer;
