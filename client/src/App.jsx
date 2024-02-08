import useAuth from "./hooks/useAuth";
import AppRouter from "./routes/AppRouter";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const {loading} = useAuth()

  if(loading) {
    return (
      <span className="loading loading-bars loading-lg"></span>
    )
  }

  return (
    <div>
     <ToastContainer />
      <AppRouter />
    </div>
    
  );
}

export default App;
