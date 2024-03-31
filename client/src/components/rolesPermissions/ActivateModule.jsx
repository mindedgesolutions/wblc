import React from "react";
import { MdOutlineThumbUp } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setModules } from "../../features/rolesPermissions/moduleSlice";
import customFetch from "../../utils/customFetch";
import { splitErrors } from "../../utils/showErrors";
import { toast } from "react-toastify";

const ActivateModule = ({ id }) => {
  const dispatch = useDispatch();
  const { modules } = useSelector((store) => store.modules);

  const activateModule = async () => {
    const changed = modules.find((i) => i.id === id);
    const newObject = { ...changed, is_active: true };

    const reducedModules = modules.filter((i) => i.id !== id);
    const newModules = [...reducedModules, newObject];

    try {
      await customFetch.patch(`/roles-permissions/activate-module/${id}`);
      dispatch(setModules(newModules));
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
      onClick={activateModule}
    >
      <MdOutlineThumbUp size={16} />
    </button>
  );
};

export default ActivateModule;
