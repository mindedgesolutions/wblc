import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideRolePermissionModal } from "../../features/rolesPermissions/roleSlice";
import { Modal } from "react-bootstrap";
import SubmitBtn from "../SubmitBtn";

const AssignPermissionToRole = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { roles, editId, rolePermissionModal } = useSelector(
    (store) => store.roles
  );

  const handleClose = () => {
    dispatch(hideRolePermissionModal());
  };

  const handleSubmit = async () => {};

  return (
    <Modal show={rolePermissionModal} size="lg" onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Assign permissions to</Modal.Title>
      </Modal.Header>
      <form method="post" autoComplete="off" onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="row row-cards">
            <div className="mb-3 col-md-6 mt-0 pt-0"></div>
            {/* <UserRoles /> */}
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
