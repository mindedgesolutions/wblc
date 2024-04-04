import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { setSelectedRoles } from "../../features/users/userSlice";

const UserRoles = () => {
  const dispatch = useDispatch();
  const { allRoles } = useSelector((store) => store.roles);
  const { users, editId } = useSelector((store) => store.users);

  const user = users.find((i) => i.id === editId);

  const dbSch = [];
  user?.roles?.map((ro) => {
    const element = { value: ro.role_id, label: ro.role_name };
    dbSch.push(element);
  });

  const [selectedSchemes, setSelectedSchemes] = useState(dbSch || []);

  const ro = [];
  allRoles.map((role) => {
    const element = { value: role.id, label: role.name };
    ro.push(element);
  });

  const options = ro.filter(
    (obj1) => !dbSch.some((obj2) => obj1.label === obj2.label)
  );

  const handleChange = async (selected) => {
    setSelectedSchemes(selected);
    dispatch(setSelectedRoles(selected));
  };

  return (
    <div className="mb-3 col-md-12 mt-0 pt-0">
      <label className="datagrid-title" htmlFor="roles">
        Role/s <span className="text-danger">*</span> :{" "}
      </label>
      <Select
        id="roles"
        name="roles"
        options={options}
        onChange={handleChange}
        value={selectedSchemes}
        isMulti
      />
    </div>
  );
};

export default UserRoles;
