import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SubmitBtn from "../SubmitBtn";
import { hideAddModal } from "../../features/users/userSlice";
import { Modal } from "react-bootstrap";
import UserRoles from "./UserRoles";
import { splitErrors } from "../../utils/showErrors";
import customFetch from "../../utils/customFetch";

const AddEditUser = () => {
  const dispatch = useDispatch();
  const { users, addModal, editId, selectedRoles } = useSelector(
    (store) => store.users
  );
  const { total } = useSelector((store) => store.common);
  const editData = editId && users.find((i) => i.id === editId);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    username: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    dispatch(hideAddModal());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let data = Object.fromEntries(formData);
    data = { ...data, roles: selectedRoles };
    try {
      const response = await customFetch.post(`/users/add-user`, data);
      return null;
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
            : `Add new user`}
        </Modal.Title>
      </Modal.Header>
      <form method="post" autoComplete="off" onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="row row-cards">
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
            <div className="mb-3 col-md-6 mt-0 pt-0">
              <label className="datagrid-title" htmlFor="name">
                Username :{" "}
              </label>
              <input
                type="text"
                className="form-control"
                name="username"
                id="username"
                value={form.username}
                disabled={true}
              />
            </div>
            <div className="mb-3 col-md-6 mt-0 pt-0">
              <label className="datagrid-title" htmlFor="email">
                Email <span className="text-danger">*</span> :{" "}
              </label>
              <input
                type="text"
                className="form-control"
                name="email"
                id="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3 col-md-6 mt-0 pt-0">
              <label className="datagrid-title" htmlFor="email">
                Mobile <span className="text-danger">*</span> :{" "}
              </label>
              <input
                type="text"
                className="form-control"
                name="mobile"
                id="mobile"
                value={form.mobile}
                onChange={handleChange}
              />
            </div>

            <UserRoles />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <SubmitBtn
            text={editId ? `Update details` : `Add user`}
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

export default AddEditUser;
