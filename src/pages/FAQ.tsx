import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FAQ = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redireciona para o dashboard
    navigate("/dashboard", { replace: true });
  }, [navigate]);

  return null;
};

export default FAQ;
