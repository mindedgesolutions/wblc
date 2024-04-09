import { StatusCodes } from "http-status-codes";
import pool from "../db.js";
import { paginationLogic } from "../utils/pagination.js";

export const getMenus = async (req, res) => {
  const { name, page } = req.query;
  const pagination = paginationLogic(page, null);
  let search = name ? `where um.name ilike '%${name}%'` : ``;

  const data = await pool.query(
    `select um.*,
    json_agg(
      json_build_object(
        'permission_id', up.permission_id,
        'role_name', roles.name
      )
    ) as roles
    from user_master as um
    left join map_user_role mur on mur.user_id = um.id
    left join roles on roles.id = mur.role_id
    ${search} group  by um.id order by um.id desc offset $1 limit $2`,
    [pagination.offset, pagination.pageLimit]
  );

  const records = await pool.query(
    `select * from user_master um ${search}`,
    []
  );
  const totalPages = Math.ceil(records.rowCount / pagination.pageLimit);
  const meta = {
    totalPages: totalPages,
    currentPage: pagination.pageNo,
    totalRecords: records.rowCount,
  };

  res.status(StatusCodes.OK).json({ data, meta });
};
