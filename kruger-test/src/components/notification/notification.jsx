import { Alert } from "antd";
import PropTypes from "prop-types";

const Notification = ({ type, message }) => {
  return <Alert type={type} message={message} />;
};

Notification.propTypes = {
  type: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default Notification;
