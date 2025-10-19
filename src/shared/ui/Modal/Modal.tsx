import React from "react";
import { Modal } from "antd";
import styles from "./Modal.module.scss";

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  open,
  onClose,
  children,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      className={styles.modal}
      width={400}
    >
      <div className={styles.content}>{children}</div>
    </Modal>
  );
};
