import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPermissions } from "../../features/rolesPermissions/permissionSlice";
import { toast } from "react-toastify";
import customFetch from "../../utils/customFetch";
import { splitErrors } from "../../utils/showErrors";
import { MdOutlineThumbUp } from "react-icons/md";

const ActivatePermission = ({ id }) => {
  const dispatch = useDispatch();
  const { permissions } = useSelector((store) => store.permissions);

  const activatePermission = async () => {
    const changed = permissions.find((i) => i.id === id);
    const newObject = { ...changed, is_active: true };

    const reducedPermissions = permissions.filter((i) => i.id !== id);
    const newPermissions = [...reducedPermissions, newObject];

    try {
      await customFetch.patch(`/roles-permissions/activate-permission/${id}`);
      dispatch(setPermissions(newPermissions));
      toast.success(`Module activated`);
    } catch (error) {
      splitErrors(error?.response?.data?.msg);
      return error;
    }
  };
  return (
    <button
      type="button"
      className="btn btn-success btn-sm me-3"
      onClick={activatePermission}
    >
      <MdOutlineThumbUp size={16} />
    </button>
  );
};

export default ActivatePermission;
