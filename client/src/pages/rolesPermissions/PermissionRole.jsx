import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, useLocation, useNavigate } from "react-router-dom";
import customFetch from "../../utils/customFetch";
import { splitErrors } from "../../utils/showErrors";
import {
  AssignPermissionToRole,
  PageHeader,
  PageWrapper,
  PaginationContainer,
  TableLoader,
} from "../../components";
import { IoIosSearch } from "react-icons/io";
import { IoReloadSharp } from "react-icons/io5";
import { nanoid } from "nanoid";
import { randomBadgeBg, serialNo } from "../../utils/functions";
import { MdModeEdit } from "react-icons/md";
import {
  setRoles,
  showRolePermissionModal,
} from "../../features/rolesPermissions/roleSlice";
import { setTotal } from "../../features/common/commonSlice";
import { setPermissions } from "../../features/rolesPermissions/permissionSlice";

const PermissionRole = () => {
  document.title = `Role-wise Permissions | ${
    import.meta.env.VITE_ADMIN_TITLE
  }`;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const resetUrl = `/admin/role-permissions`;

  const { roles, changeCount } = useSelector((store) => store.roles);
  const { permissions } = useSelector((store) => store.permissions);
  const { total } = useSelector((store) => store.common);
  const [isLoading, setIsLoading] = useState(false);
  const [metaData, setMetaData] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  // Fetch all data starts ------
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await customFetch.get(`/roles-permissions/roles`, {
        params: {
          name: queryParams.get("s") || "",
          page: queryParams.get("page") || "",
        },
      });

      if (permissions.length === 0) {
        const permissions = await customFetch.get(
          `/roles-permissions/all-permissions`
        );
        dispatch(setPermissions(permissions.data.data.rows));
      }

      dispatch(setRoles(response.data.data.rows));
      dispatch(setTotal(response.data.meta.totalRecords));

      setMetaData(response.data.meta);
      setIsLoading(false);
    } catch (error) {
      splitErrors(error?.response?.data?.msg);
      setIsLoading(false);
      return error;
    }
  };
  // Fetch all data ends ------

  const pageCount = metaData?.totalPages;
  const currentPage = metaData?.currentPage;

  const resetSearch = () => {
    setSearchInput("");
    navigate(resetUrl);
  };

  useEffect(() => {
    fetchData();
  }, [queryParams.get("s"), queryParams.get("page"), total, changeCount]);

  return (
    <>
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <PageHeader title={`Role-wise Permissions`} breadCrumb="" />
          </div>
        </div>
      </div>
      <PageWrapper>
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <div className="col-auto ms-auto d-print-none">
                <Form method="GET">
                  <div className="btn-list">
                    <span className="d-none d-sm-inline">
                      <div className="input-icon">
                        <input
                          type="text"
                          name="s"
                          value={searchInput}
                          className="form-control"
                          placeholder="Search by role..."
                          onChange={(e) => setSearchInput(e.target.value)}
                        />
                      </div>
                    </span>
                    <span className="d-none d-sm-inline">
                      <button
                        type="submit"
                        className="btn btn-primary d-none d-sm-inline-block me-2"
                      >
                        <IoIosSearch className="fs-3" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-default d-none d-sm-inline-block"
                        onClick={resetSearch}
                      >
                        <IoReloadSharp className="fs-3" />
                      </button>
                    </span>
                  </div>
                </Form>
              </div>
            </div>

            <div className="card-body p-2">
              <div className="table-responsive">
                <table className="table table-vcenter text-nowrap datatable table-hover table-bordered card-table fs-5">
                  <thead>
                    <tr>
                      <th className="bg-dark text-white">SL. NO.</th>
                      <th className="bg-dark text-white">Roles</th>
                      <th className="bg-dark text-white">Permissions</th>
                      <th className="bg-dark text-white">Role Status</th>
                      <th className="bg-dark text-white"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={5}>
                          <TableLoader />
                        </td>
                      </tr>
                    ) : (
                      <>
                        {roles.map((i, index) => {
                          const isActive = i?.is_active ? (
                            <span className="badge bg-success-lt p-1">
                              Active
                            </span>
                          ) : (
                            <span className="badge bg-danger-lt p-1">
                              Inactive
                            </span>
                          );

                          return (
                            <tr key={nanoid()}>
                              <td>
                                {serialNo(queryParams.get("page")) + index}.
                              </td>
                              <td>{i?.name?.toUpperCase()}</td>
                              <td>
                                {i?.permissions[0]?.permission_id &&
                                  i?.permissions?.map((a) => {
                                    return (
                                      <span
                                        key={nanoid()}
                                        className={`badge bg-${randomBadgeBg()}-lt me-1 fs-6`}
                                      >
                                        {a?.permission_name?.toUpperCase()}
                                      </span>
                                    );
                                  })}
                              </td>
                              <td>{isActive}</td>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-warning btn-sm me-3"
                                  onClick={() =>
                                    dispatch(showRolePermissionModal(i?.id))
                                  }
                                >
                                  <MdModeEdit size={14} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <AssignPermissionToRole />

        <PaginationContainer pageCount={pageCount} currentPage={currentPage} />
      </PageWrapper>
    </>
  );
};

export default PermissionRole;
