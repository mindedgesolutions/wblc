import React from "react";

const PageHeader = ({ preTitle, postTitle, textClass, title, breadCrumb }) => {
  return (
    <div className="page-header d-print-none">
      <div className="container-xl">
        <div className="row g-2 align-items-center">
          <div className="col">
            {/* <!-- Page pre-title --> */}
            {preTitle && <div className="page-pretitle">{preTitle}</div>}
            <h2 className="page-title">{title}</h2>{" "}
            {breadCrumb && (
              <div className="page-pretitle mt-2">{breadCrumb}</div>
            )}
            {postTitle && (
              <div className={`page-pretitle mt-2 ${textClass || ""}`}>
                {postTitle}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
