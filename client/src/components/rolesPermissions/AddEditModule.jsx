import React, { useEffect, useState } from "react";
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
  const { modules, addModal, editId } = useSelector((store) => store.modules);
  const { total } = useSelector((store) => store.common);
  const editData = editId && modules.find((i) => i.id === editId);
  const [form, setForm] = useState({ name: "", desc: "" });

  useEffect(() => {
    setForm({ name: editData?.name || "", desc: editData?.description || "" });
  }, [editId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    dispatch(hideAddModal());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    const process = editId ? customFetch.patch : customFetch.post;
    const api = editId
      ? `/roles-permissions/modules/${editId}` // For edit
      : `/roles-permissions/modules`; // For add
    const msg = editId ? `Module details updated` : `Module added`;
    try {
      const response = await process(api, data);

      if (!editId) {
        const newModule = response.data.data.rows[0];
        const newTotal = Number(total) + 1;
        dispatch(setModules([...modules, newModule]));
        dispatch(setTotal(newTotal));
      } else {
        const newObject = response.data.data.rows[0];

        const reducedModules = modules.filter((i) => i.id !== editId);
        const newModules = [...reducedModules, newObject];
        dispatch(setModules(newModules));
      }
      dispatch(hideAddModal());

      toast.success(msg);
    } catch (error) {
      splitErrors(error?.response?.data?.msg);
      return error;
    }
  };

  return (
    <Modal show={addModal} size="lg" onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {editId
            ? `Update details of ${form.name.toUpperCase()}`
            : `Add new module`}
        </Modal.Title>
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
                value={form.name}
                onChange={handleChange}
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
                value={form.desc}
                onChange={handleChange}
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
