import React from "react";
import { nanoid } from "nanoid";
import { MdModeEdit } from "react-icons/md";
import { PageHeader, PageWrapper, TableLoader } from "../../components";

const ModuleList = () => {
  return (
    <>
      <PageHeader title={`List of Modules`} breadCrumb="" />
      <PageWrapper>
        <div className="col-12">
          <div className="card">
            <div className="card-body p-2">
              <div className="table-responsive">
                <table className="table table-vcenter text-nowrap datatable table-hover table-bordered card-table fs-5">
                  <thead>
                    <tr>
                      <th className="bg-dark text-white">SL. NO.</th>
                      <th className="bg-dark text-white">Module</th>
                      <th className="bg-dark text-white">Description</th>
                      <th className="bg-dark text-white"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={4}>
                        <TableLoader />
                      </td>
                    </tr>
                    <>
                      <tr key={nanoid()}>
                        <td>1.</td>
                        <td></td>
                        <td></td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-warning btn-sm"
                          >
                            <MdModeEdit />
                          </button>
                        </td>
                      </tr>
                    </>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
};

export default ModuleList;
