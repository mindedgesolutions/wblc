import React from "react";
import { useDispatch, useSelector } from "react-redux";
import customFetch from "../../utils/customFetch";
import { setRoles } from "../../features/rolesPermissions/roleSlice";
import { splitErrors } from "../../utils/showErrors";
import { MdOutlineThumbUp } from "react-icons/md";

const ActivateUser = () => {
  //   const dispatch = useDispatch();
  //   const { roles } = useSelector((store) => store.roles);

  //   const activateRole = async () => {
  //     const changed = roles.find((i) => i.id === id);
  //     const newObject = { ...changed, is_active: true };

  //     const reducedRoles = roles.filter((i) => i.id !== id);
  //     const newRoles = [...reducedRoles, newObject];

  //     try {
  //       await customFetch.patch(`/roles-permissions/activate-role/${id}`);
  //       dispatch(setRoles(newRoles));
  //       toast.success(`Role activated`);
  //     } catch (error) {
  //       splitErrors(error?.response?.data?.msg);
  //       return error;
  //     }
  //   };
  return (
    <button
      type="button"
      className="btn btn-success btn-sm me-3"
      //   onClick={activateRole}
    >
      <MdOutlineThumbUp size={16} />
    </button>
  );
};

export default ActivateUser;
