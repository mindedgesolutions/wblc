import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import SubmitBtn from "../SubmitBtn";
import { nanoid } from "@reduxjs/toolkit";
import Select from "react-select";
import { splitErrors } from "../../utils/showErrors";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import { updateCount } from "../../features/common/commonSlice";
import { hideUserPermissionModal } from "../../features/rolesPermissions/permissionSlice";

const AssignPermissionToUser = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { allPermissions, userPermissionModal, userId } = useSelector(
    (store) => store.permissions
  );
  const { users } = useSelector((store) => store.users);
  const editUser = users.find((i) => i.id === userId);

  const handleClose = () => {
    dispatch(hideUserPermissionModal());
  };

  const [inputUser, setInputUser] = useState("");

  // ----------------------

  const dbPer = [];
  editUser?.permissions?.map((p) => {
    const element = {
      value: p.permission_id || "",
      label: p.permission_name || "",
    };
    dbPer.push(element);
  });

  const [dbPermissions, setDbPermissions] = useState(dbPer || []);

  const pers = [];
  allPermissions?.map((perm) => {
    const element = { value: perm.id, label: perm.name };
    pers.push(element);
  });

  const options = pers;

  const handleChange = async (selected) => {
    setDbPermissions(selected);
  };

  useEffect(() => {
    setInputUser(userId);
    setDbPermissions(dbPer || []);
  }, [userId]);

  // ----------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    let data = Object.fromEntries(formData);
    data = { ...data, permissions: dbPermissions };
    try {
      await customFetch.post(`/users/update-user-permission`, data);

      dispatch(updateCount());
      dispatch(hideUserPermissionModal());
      setIsLoading(false);
      toast.success(`Permissions updated`);
    } catch (error) {
      setIsLoading(false);
      splitErrors(error?.response?.data?.msg);
      return error;
    }
  };

  return (
    <Modal show={userPermissionModal} size="lg" onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Assign permissions to</Modal.Title>
      </Modal.Header>
      <form method="post" autoComplete="off" onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="row row-cards mb-2">
            <div className="mb-3 col-md-6 mt-0 pt-0">
              <label className="datagrid-title" htmlFor="userId">
                User <span className="text-danger">*</span> :{" "}
              </label>
              <select
                className="form-control"
                name="userId"
                id="userId"
                value={inputUser}
                onChange={(e) => setInputUser(e.target.value)}
              >
                {users?.map((i) => {
                  return (
                    <option key={nanoid()} value={i.id}>
                      {i.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="row row-cards">
            <div className="mb-3 col-md-12 mt-0 pt-0">
              <label className="datagrid-title" htmlFor="permissions">
                Permission/s <span className="text-danger">*</span> :{" "}
              </label>
              <Select
                id="permissions"
                name="permissions"
                options={options}
                onChange={handleChange}
                value={dbPermissions[0]?.value ? dbPermissions : ""}
                isMulti
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <SubmitBtn text={`Update details`} isLoading={isLoading} />
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

export default AssignPermissionToUser;
