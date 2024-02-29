import { Button, Layout, Tooltip } from "antd";
import { LoginOutlined } from "@ant-design/icons";
import { logout } from "../../bridges/ServiceBridge";

import "./header.css";

const { Header } = Layout;

const HeaderCustom = () => {
  const handleLogout = async () => {
    await logout();
  };

  return (
    <Header className='header'>
      <div className='logo'>Kruger</div>
      <Tooltip title='Cerrar sesión'>
        <Button
          shape='circle'
          icon={<LoginOutlined />}
          onClick={handleLogout}
        />
      </Tooltip>
    </Header>
  );
};

export default HeaderCustom;
