import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setTotal } from "../../features/common/commonSlice";
import {
  setRoles,
  hideAddModal,
} from "../../features/rolesPermissions/roleSlice";
import customFetch from "../../utils/customFetch";
import { splitErrors } from "../../utils/showErrors";
import SubmitBtn from "../SubmitBtn";

const AddEditRole = () => {
  const dispatch = useDispatch();
  const { roles, addModal, editId } = useSelector((store) => store.roles);
  const { total } = useSelector((store) => store.common);
  const [form, setForm] = useState({ name: "", desc: "" });
  const editData = editId && roles.find((i) => i.id === editId);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setForm({
      name: editId ? editData?.name : "",
      desc: editId ? editData?.description : "",
    });
  }, [editId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    dispatch(hideAddModal());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    const process = editId ? customFetch.patch : customFetch.post;
    const api = editId
      ? `/roles-permissions/roles/${editId}` // For edit
      : `/roles-permissions/roles`; // For add
    const msg = editId ? `Role details updated` : `Role added`;
    try {
      const response = await process(api, data);

      if (!editId) {
        const newRole = response.data.data.rows[0];
        const newTotal = Number(total) + 1;
        dispatch(setRoles([...roles, newRole]));
        dispatch(setTotal(newTotal));
      } else {
        const newObject = response.data.data.rows[0];

        const reducedRoles = roles.filter((i) => i.id !== editId);
        const newRoles = [...reducedRoles, newObject];
        dispatch(setRoles(newRoles));
      }
      dispatch(hideAddModal());
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
            : `Add new role`}
        </Modal.Title>
      </Modal.Header>
      <form method="post" autoComplete="off" onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="row row-cards">
            <div className="mb-3 col-md-12 mt-0 pt-0">
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
          </div>
        </Modal.Body>
        <Modal.Footer>
          <SubmitBtn
            text={editId ? `Update details` : `Add role`}
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

export default AddEditRole;
