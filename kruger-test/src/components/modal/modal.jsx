import PropTypes from "prop-types";
import { Modal } from "antd";
import "./modal.css";

const ModalComponent = ({
  open,
  confirmLoading,
  content,
  handleOk,
  title,
  handleCancel,
}) => {
  return (
    <Modal
      title={title}
      open={open}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      okButtonProps={{ className: "md-button" }}
      okText='Aceptar'
      cancelButtonProps={{ className: "md-button-inverse" }}
      destroyOnClose={true}
    >
      {content}
    </Modal>
  );
};

ModalComponent.propTypes = {
  open: PropTypes.bool.isRequired,
  confirmLoading: PropTypes.bool.isRequired,
  content: PropTypes.element.isRequired,
  handleOk: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  handleCancel: PropTypes.func.isRequired,
};

export default ModalComponent;
