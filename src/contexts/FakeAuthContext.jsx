import { createContext, useContext, useReducer } from "react";

const FAKE_USER = {
  name: "Yousef",
  email: "jack@example.com",
  password: "qwerty",
  avatar:
    "https://res.cloudinary.com/dhrdefqza/image/upload/v1738681036/lcubsbfhavu6yk2k9zgq.jpg",
};

const AuthContext = createContext();

const initialState = { user: {}, isAuthenticated: false };

function reducer(state, { type, payload }) {
  console.log(payload);
  switch (type) {
    case "login":
      return { ...state, user: payload, isAuthenticated: true };
    case "logout":
      return { ...state, ...initialState };
    default:
      throw new Error("Unknow Action type");
  }
}

function AuthProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );
  // fake login
  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password)
      dispatch({ type: "login", payload: FAKE_USER });
  }
  // fake logout
  function logout() {
    dispatch({ type: "logout" });
  }
  return (
    <AuthContext.Provider value={{ login, logout, user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("You've used auth context outside its range");
  return context;
}

export { AuthProvider, useAuth };
