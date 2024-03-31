import React from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { hideConfirmModal } from "../features/rolesPermissions/moduleSlice";

const ModalDelete = () => {
  const dispatch = useDispatch();
  const { confirmModal, deleteParams } = useSelector((store) => store.modules);

  const handleClose = () => {
    dispatch(hideConfirmModal());
  };

  const handleSubmit = async () => {
    e.preventDefault();
  };

  return (
    <Modal show={confirmModal} size="lg" onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Delete {deleteParams.title}</Modal.Title>
      </Modal.Header>
      <form method="post" onSubmit={handleSubmit}>
        <Modal.Body>
          <p>Sure you wish to {deleteParams.title}?</p>
        </Modal.Body>
        <Modal.Footer>
          <button type="submit" className="btn btn-danger me-2">
            Delete
          </button>
          <button
            type="button"
            className="btn btn-default"
            onClick={handleClose}
          >
            Close
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default ModalDelete;
