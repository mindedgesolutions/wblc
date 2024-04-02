import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideRolePermissionModal } from "../../features/rolesPermissions/roleSlice";
import { Modal } from "react-bootstrap";
import SubmitBtn from "../SubmitBtn";
import { nanoid } from "@reduxjs/toolkit";
import Select from "react-select";
import { splitErrors } from "../../utils/showErrors";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import { updateCount } from "../../features/common/commonSlice";

const AssignPermissionToRole = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { roles, rolePermissionModal, selectedRole } = useSelector(
    (store) => store.roles
  );

  const handleClose = () => {
    dispatch(hideRolePermissionModal());
  };

  const [inputRole, setInputRole] = useState("");

  // ----------------------

  const { permissions } = useSelector((store) => store.permissions);

  const editRole = roles.find((i) => i.id === selectedRole);

  const dbPer = [];
  editRole?.permissions?.map((p) => {
    const element = {
      value: p.permission_id || "",
      label: p.permission_name || "",
    };
    dbPer.push(element);
  });

  const [selectedPermissions, setSelectedPermissions] = useState(dbPer || []);

  const pers = [];
  permissions.map((perm) => {
    const element = { value: perm.id, label: perm.name };
    pers.push(element);
  });

  const options = pers;

  const handleChange = async (selected) => {
    setSelectedPermissions(selected);
  };

  useEffect(() => {
    setInputRole(selectedRole);
    setSelectedPermissions(dbPer || []);
  }, [selectedRole]);

  // ----------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    let data = Object.fromEntries(formData);
    data = { ...data, permissions: selectedPermissions };
    try {
      const response = await customFetch.post(
        `/roles-permissions/map-role-permissions`,
        data
      );
      setIsLoading(false);
      dispatch(hideRolePermissionModal());
      dispatch(updateCount());
      toast.success(`Permission(s) asigned`);
    } catch (error) {
      splitErrors(error?.response?.data?.msg);
      setIsLoading(false);
      return error;
    }
  };

  return (
    <Modal show={rolePermissionModal} size="lg" onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Assign permissions to</Modal.Title>
      </Modal.Header>
      <form method="post" autoComplete="off" onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="row row-cards mb-2">
            <div className="mb-3 col-md-6 mt-0 pt-0">
              <label className="datagrid-title" htmlFor="name">
                Role <span className="text-danger">*</span> :{" "}
              </label>
              <select
                className="form-control"
                name="roleId"
                id="roleId"
                value={inputRole}
                onChange={(e) => setInputRole(e.target.value)}
              >
                {roles.map((i) => {
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
                value={selectedPermissions[0]?.value ? selectedPermissions : ""}
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

export default AssignPermissionToRole;
