import React from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setModules } from "../features/rolesPermissions/moduleSlice";
import { splitErrors } from "../utils/showErrors";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import { hideConfirmModal } from "../features/common/commonSlice";

const ModalDelete = () => {
  const dispatch = useDispatch();
  const { modules } = useSelector((store) => store.modules);
  const { confirmModal, deleteParams } = useSelector((store) => store.common);

  const handleClose = () => {
    dispatch(hideConfirmModal());
  };

  const changed = modules.find((i) => i.id === deleteParams.id);
  const newObject = { ...changed, is_active: false };

  const reducedModules = modules.filter((i) => i.id !== deleteParams.id);
  const newModules = [...reducedModules, newObject];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await customFetch.delete(`/roles-permissions/${deleteParams.type}`, {
        params: {
          id: deleteParams.id,
          tables: deleteParams.tables,
        },
      });
      dispatch(setModules(newModules));
      dispatch(hideConfirmModal());
      toast.success(`Module deactivated`);
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

export default ModalDelete;
