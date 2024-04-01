import React from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  hideConfirmModal,
  setRoles,
} from "../../features/rolesPermissions/roleSlice";
import { splitErrors } from "../../utils/showErrors";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

const DeleteRole = () => {
  const dispatch = useDispatch();
  const { roles, confirmModal, deleteParams } = useSelector(
    (store) => store.roles
  );

  const handleClose = () => {
    dispatch(hideConfirmModal());
  };

  const changed = roles.find((i) => i.id === deleteParams.id);
  const newObject = { ...changed, is_active: false };

  const reducedRoles = roles.filter((i) => i.id !== deleteParams.id);
  const newRoles = [...reducedRoles, newObject];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await customFetch.delete(`/roles-permissions/roles`, {
        params: {
          id: deleteParams.id,
        },
      });
      dispatch(setRoles(newRoles));
      dispatch(hideConfirmModal());
      toast.success(`Role deactivated`);
    } catch (error) {
      splitErrors(error?.response?.data?.msg);
      return error;
    }
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

export default DeleteRole;
