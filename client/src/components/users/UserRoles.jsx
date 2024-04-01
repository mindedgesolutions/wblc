import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { setSelectedRoles } from "../../features/users/userSlice";

const UserRoles = () => {
  const dispatch = useDispatch();
  const { roles } = useSelector((store) => store.roles);

  const dbSch = [];
  //   userSchemes.data.data.rows.map((scheme) => {
  //     const element = { value: scheme.scheme_id, label: scheme.schemes_name };
  //     dbSch.push(element);
  //   });

  const [selectedSchemes, setSelectedSchemes] = useState([]);

  const ro = [];
  roles.map((role) => {
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
    <div className="mb-3 col-md-6 mt-0 pt-0">
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
