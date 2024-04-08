import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, useLocation, useNavigate } from "react-router-dom";
import customFetch from "../../utils/customFetch";
import { splitErrors } from "../../utils/showErrors";
import {
  AssignPermissionToUser,
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
import { setTotal } from "../../features/common/commonSlice";
import {
  setAllPermissions,
  showUserPermissionModal,
} from "../../features/rolesPermissions/permissionSlice";
import { setUsers } from "../../features/users/userSlice";

const PermissionUser = () => {
  document.title = `User-wise Permissions | ${
    import.meta.env.VITE_ADMIN_TITLE
  }`;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const resetUrl = `/admin/user-permissions`;

  const { users } = useSelector((store) => store.users);
  const { changeCount } = useSelector((store) => store.common);
  const { allPermissions } = useSelector((store) => store.permissions);
  const [isLoading, setIsLoading] = useState(false);
  const [metaData, setMetaData] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  // Fetch all data starts ------
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await customFetch.get(`/users/list-with-permissions`, {
        params: {
          name: queryParams.get("s") || "",
          page: queryParams.get("page") || "",
        },
      });

      if (allPermissions.length === 0) {
        const permissions = await customFetch.get(
          `/roles-permissions/all-permissions`
        );
        dispatch(setAllPermissions(permissions?.data?.data?.rows));
      }
      dispatch(setUsers(response?.data?.data?.rows));
      dispatch(setTotal(response?.data?.meta?.totalRecords));

      setMetaData(response?.data?.meta);
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
  }, [queryParams?.get("s"), queryParams?.get("page"), changeCount]);

  return (
    <>
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <PageHeader title={`User-wise Permissions`} breadCrumb="" />
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
                <table className="table table-vcenter datatable table-hover table-bordered card-table fs-5">
                  <thead>
                    <tr>
                      <th className="bg-dark text-white">SL. NO.</th>
                      <th className="bg-dark text-white">User</th>
                      <th className="bg-dark text-white">Permissions</th>
                      <th className="bg-dark text-white"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={4}>
                          <TableLoader />
                        </td>
                      </tr>
                    ) : (
                      <>
                        {users?.map((i, index) => {
                          return (
                            <tr key={nanoid()}>
                              <td>
                                {serialNo(queryParams?.get("page")) + index}.
                              </td>
                              <td className="text-nowrap">
                                {i?.name?.toUpperCase()}
                              </td>
                              <td>
                                {i?.permissions?.map((a) => {
                                  return (
                                    <span
                                      key={nanoid()}
                                      className={`badge bg-${randomBadgeBg()}-lt me-1 my-1 fs-6`}
                                    >
                                      {a?.permission_name?.toUpperCase()}
                                    </span>
                                  );
                                })}
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-warning btn-sm me-3"
                                  onClick={() =>
                                    dispatch(showUserPermissionModal(i?.id))
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
        <AssignPermissionToUser />

        <PaginationContainer pageCount={pageCount} currentPage={currentPage} />
      </PageWrapper>
    </>
  );
};

export default PermissionUser;
