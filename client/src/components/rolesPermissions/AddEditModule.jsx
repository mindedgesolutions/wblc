import React from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  hideAddModal,
  setModules,
} from "../../features/rolesPermissions/moduleSlice";
import customFetch from "../../utils/customFetch";
import { splitErrors } from "../../utils/showErrors";
import { toast } from "react-toastify";
import { setTotal } from "../../features/common/commonSlice";

const AddEditModule = () => {
  const dispatch = useDispatch();
  const { modules, addModal } = useSelector((store) => store.modules);
  const { total } = useSelector((store) => store.common);

  const handleClose = () => {
    dispatch(hideAddModal());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    try {
      const response = await customFetch.post(
        `/roles-permissions/modules`,
        data
      );

      const newModule = response.data.data.rows[0];
      const newTotal = Number(total) + 1;

      dispatch(setModules([...modules, newModule]));
      dispatch(setTotal(newTotal));
      dispatch(hideAddModal());

      toast.success(`Module added`);
    } catch (error) {
      splitErrors(error?.response?.data?.msg);
      return error;
    }
  };

  return (
    <Modal show={addModal} size="lg" onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add new module</Modal.Title>
      </Modal.Header>
      <form method="post" onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="row row-cards">
            <div className="mb-3 col-md-12 mt-0 pt-0">
              <label className="datagrid-title" htmlFor="name">
                Name :{" "}
              </label>
              <input
                type="text"
                className="form-control"
                name="name"
                id="name"
              />
            </div>
            <div className="mb-3 col-md-12 mt-0 pt-0">
              <label className="datagrid-title" htmlFor="desc">
                Description :{" "}
              </label>
              <textarea
                className="form-control"
                name="desc"
                id="desc"
                cols="30"
                rows="3"
              ></textarea>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button type="submit" className="btn btn-success me-2">
            Add module
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

export default AddEditModule;
