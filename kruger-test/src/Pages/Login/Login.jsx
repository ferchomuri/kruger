import { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { Spin, message } from "antd";
import ButtonCustom from "../../components/button/button";
import { login } from "../../bridges/ServiceBridge";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const req = {
      username: username,
      password: password,
    };

    try {
      const user = await login(req);

      if (user?.user?.isAdmin) {
        navigate("/dashboard-administrator");
      } else {
        navigate("/dashboard-user");
      }
    } catch (err) {
      console.error(err);
      message.error("Usuario o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='general-container'>
      <h1 className='title'>Inicia sesión</h1>
      <label>
        # de Cédula:{" "}
        <input type='text' value={username} onChange={handleUsernameChange} />
      </label>
      <br />
      <label>
        Contraseña:{" "}
        <input
          type='password'
          value={password}
          onChange={handlePasswordChange}
        />
      </label>
      <br />
      {loading ? (
        <Spin />
      ) : (
        <ButtonCustom
          type='submit'
          text='Ingresar'
          size='lg'
          onClick={() => handleSubmit()}
        />
      )}
    </div>
  );
};

export default Login;
