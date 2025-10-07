import { BrowserRouter as Router } from 'react-router-dom';
import routes, { renderRoutes } from './routes/routes';
import LoadingFullScreen from './components/LoadingFullScreen';
import { AuthProvider } from './contexts/JWTAuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
function App() {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        toast.dismiss();
      }
    };
    const handleWindowBlur = () => {
      toast.dismiss();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, []);
  return (
    <>
      <Router>
        <AuthProvider>{renderRoutes(routes)}</AuthProvider>
      </Router>
      <LoadingFullScreen />
      <ToastContainer />
    </>
  );
}

export default App;
