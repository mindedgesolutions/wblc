import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import customFetch from "../../utils/customFetch";
import { splitErrors } from "../../utils/showErrors";
import { toast } from "react-toastify";
import { updateCount } from "../../features/common/commonSlice";
import SubmitBtn from "../SubmitBtn";
import { hideAddModal } from "../../features/rolesPermissions/permissionSlice";
import { nanoid } from "nanoid";

const AddEditPermission = () => {
  const dispatch = useDispatch();
  const { permissions, addModal, editId } = useSelector(
    (store) => store.permissions
  );
  const { allModules } = useSelector((store) => store.modules);

  const editData = editId && permissions.find((i) => i.id === editId);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ moduleId: "", name: "", desc: "" });
  const [keepOpen, setKeepOpen] = useState(false);

  useEffect(() => {
    setForm({
      moduleId: editId ? editData?.module_id : "",
      name: editId ? editData?.name : "",
      desc: editId ? editData?.description : "",
    });
  }, [editId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setKeepOpen(false);
    dispatch(hideAddModal());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    const process = editId ? customFetch.patch : customFetch.post;
    const api = editId
      ? `/roles-permissions/permissions/${editId}` // For edit
      : `/roles-permissions/permissions`; // For add
    const msg = editId ? `Permission updated` : `Permission added`;
    try {
      const response = await process(api, data);
      dispatch(updateCount());
      if (!keepOpen) {
        dispatch(hideAddModal());
      }
      setForm({ ...form, name: "", desc: "" });
      toast.success(msg);
      setIsLoading(false);
    } catch (error) {
      splitErrors(error?.response?.data?.msg);
      setIsLoading(false);
      return error;
    }
  };

  return (
    <Modal show={addModal} size="lg" onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {editId
            ? `Update details of ${form.name.toUpperCase()}`
            : `Add new permission`}
        </Modal.Title>
      </Modal.Header>
      <form method="post" onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="row row-cards">
            <div className="mb-3 col-md-6 mt-0 pt-0">
              <label className="datagrid-title" htmlFor="moduleId">
                Module <span className="text-danger">*</span> :{" "}
              </label>
              <select
                className="form-control"
                name="moduleId"
                id="moduleId"
                value={form.moduleId}
                onChange={handleChange}
              >
                <option value="">- Select -</option>
                {allModules?.map((i) => {
                  return (
                    <option key={nanoid()} value={i.id}>
                      {i.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="mb-3 col-md-6 mt-0 pt-0">
              <label className="datagrid-title" htmlFor="name">
                Name <span className="text-danger">*</span> :{" "}
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
                value={form.desc || ""}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="mb-3 col-md-12 mt-0 pt-0">
              <label className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="keepOpen"
                  id="keepOpen"
                  value={keepOpen}
                  onChange={() => setKeepOpen(!keepOpen ? true : false)}
                />
                <span className="datagrid-title">Keep the modal open</span>
              </label>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <SubmitBtn
            text={editId ? `Update details` : `Add module`}
            isLoading={isLoading}
          />
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

export default AddEditPermission;
