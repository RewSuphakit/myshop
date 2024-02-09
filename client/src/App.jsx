import React from "react";
import useAuth from "./hooks/useAuth";
import AppRouter from "./routes/AppRouter";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { loading } = useAuth();

  return (
    <div>
      {loading ? (
        <span className="loading loading-bars loading-lg"></span>
      ) : (
        <>
          <ToastContainer />
          <AppRouter />
        </>
      )}
    </div>
  );
}

export default App;
