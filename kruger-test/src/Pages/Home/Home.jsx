import { useNavigate } from "react-router-dom";
import Button from "../../components/button/button";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className='general-container'>
      <div className='center-vertical'>
        <div className='title bold'>Bienvenido al</div>
        <div className='title bold'>Inventario de vacunación de empleados</div>
        <Button text='Iniciar' onClick={goToLogin} />
      </div>
      <div>
        <div className='subtitle bold'>
          <span className='general-text'>Fernando Murillo - 2024</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
