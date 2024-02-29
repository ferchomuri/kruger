import PropTypes from "prop-types";
import "./button.css";

const ButtonCustom = ({ text, onClick, type, size, icon }) => {
  return (
    <button
      className={size === "lg" ? "lg-button" : "md-button"}
      onClick={() => onClick()}
      type={type}
    >
      {text}
      {icon && <span className='icon'>{icon}</span>}
    </button>
  );
};

ButtonCustom.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.string,
  size: PropTypes.string,
  icon: PropTypes.element,
};

export default ButtonCustom;
