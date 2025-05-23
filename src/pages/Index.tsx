
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login page
    navigate('/login');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <Loader className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">RideAdmin Command Center</h1>
        <p className="text-xl text-gray-600">Redirecting to login...</p>
      </div>
    </div>
  );
};

export default Index;
