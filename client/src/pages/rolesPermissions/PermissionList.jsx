import React, { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { MdModeEdit } from "react-icons/md";
import {
  ActivatePermission,
  AddEditPermission,
  DeletePermission,
  PageHeader,
  PageWrapper,
  PaginationContainer,
  TableLoader,
} from "../../components";
import { IoIosSearch } from "react-icons/io";
import { IoReloadSharp } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";
import { Form, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import customFetch from "../../utils/customFetch";
import { splitErrors } from "../../utils/showErrors";
import { serialNo, shortDesc } from "../../utils/functions";
import { setTotal } from "../../features/common/commonSlice";
import {
  setPermissions,
  showConfirmModal,
  showAddModal,
} from "../../features/rolesPermissions/permissionSlice";

const PermissionList = () => {
  document.title = `List of Permissions | ${import.meta.env.VITE_ADMIN_TITLE}`;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const resetUrl = `/admin/permissions`;

  const { permissions } = useSelector((store) => store.permissions);
  const { total, changeCount } = useSelector((store) => store.common);
  const [isLoading, setIsLoading] = useState(false);
  const [metaData, setMetaData] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  // Fetch all data starts ------
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await customFetch.get(`/roles-permissions/permissions`, {
        params: {
          name: queryParams.get("s") || "",
          page: queryParams.get("page") || "",
        },
      });

      dispatch(setPermissions(response.data.data.rows));
      dispatch(setTotal(response.data.meta.totalRecords));

      setMetaData(response.data.meta);
      setIsLoading(false);
    } catch (error) {
      splitErrors(error?.response?.data?.msg);
      if (error?.response?.status === 401) {
        navigate("/");
      }
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

  // Confirm delete starts ------
  const confirmDelete = (id, name) => {
    const params = {
      id: id,
      title: name,
    };
    dispatch(showConfirmModal(params));
  };
  // Confirm delete ends ------

  useEffect(() => {
    fetchData();
  }, [queryParams.get("s"), queryParams.get("page"), changeCount]);

  return (
    <>
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <PageHeader title={`List of Permissions`} breadCrumb="" />
            <div className="col-auto ms-auto d-print-none">
              <div className="btn-list">
                <span className="d-none d-sm-inline">
                  <button
                    type="submit"
                    className="btn btn-success d-none d-sm-inline-block me-2"
                    onClick={() => dispatch(showAddModal())}
                  >
                    Add new
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PageWrapper>
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              Total {total} permissions found
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
                          placeholder="Search by name..."
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
                      <th className="bg-dark text-white">Module</th>
                      <th className="bg-dark text-white">Description</th>
                      <th className="bg-dark text-white">Status</th>
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
                        {permissions.map((i, index) => {
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
                              <td>{shortDesc(i?.description)}</td>
                              <td>{isActive}</td>
                              <td>
                                {i?.is_active ? (
                                  <>
                                    <button
                                      type="button"
                                      className="btn btn-warning btn-sm me-3"
                                      onClick={() =>
                                        dispatch(showAddModal(i?.id))
                                      }
                                    >
                                      <MdModeEdit size={14} />
                                    </button>

                                    <button
                                      type="button"
                                      className="btn btn-danger btn-sm"
                                      onClick={() =>
                                        confirmDelete(i?.id, i?.name)
                                      }
                                    >
                                      <FaRegTrashAlt size={14} />
                                    </button>
                                  </>
                                ) : (
                                  <ActivatePermission id={i?.id} />
                                )}
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
        <AddEditPermission />
        <DeletePermission />

        <PaginationContainer pageCount={pageCount} currentPage={currentPage} />
      </PageWrapper>
    </>
  );
};

export default PermissionList;
