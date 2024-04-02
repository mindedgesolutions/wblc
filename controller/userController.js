import { StatusCodes } from "http-status-codes";
import pool from "../db.js";
import { paginationLogic } from "../utils/pagination.js";
import { BadRequestError } from "../errors/customErrors.js";
import { v4 as uuidv4 } from "uuid";
import { hashPassword } from "../utils/passwordUtils.js";
import { createUsername } from "../utils/functions.js";

export const getAllUsers = async (req, res) => {
  const { name, page } = req.query;
  const pagination = paginationLogic(page, null);
  let search = name ? `where name ilike '%${name}%'` : ``;

  const data = await pool.query(
    `select * from user_master ${search} order by id desc offset $1 limit $2`,
    [pagination.offset, pagination.pageLimit]
  );

  const records = await pool.query(`select * from user_master ${search}`, []);
  const totalPages = Math.ceil(records.rowCount / pagination.pageLimit);
  const meta = {
    totalPages: totalPages,
    currentPage: pagination.pageNo,
    totalRecords: records.rowCount,
  };

  res.status(StatusCodes.OK).json({ data, meta });
};

export const addNewUser = async (req, res) => {
  const { name, email, mobile, roles } = req.body;
  const uuid = uuidv4();
  const password = await hashPassword("welcome123");
  const username = await createUsername(name);

  try {
    await pool.query("BEGIN");

    // const data = await pool.query(
    //   `insert into user_master(name, email, mobile, username, password, uuid) values($1, $2, $3, $4, $5, $6) returning id`,
    //   [name, email, mobile, username, password, uuid]
    // );
    // const userId = data.rows[0].id;

    // const allRolePermissions = await pool.query(
    //   `select role_id, permission_id from map_role_permission`
    // );

    // for (const role of roles) {
    //   const userRoles = await pool.query(
    //     `insert into map_user_role(user_id, role_id) values($1, $2)`,
    //     [Number(userId), Number(role.value)]
    //   );

    //   const element = allRolePermissions.rows.filter(
    //     (i) => i.role_id === role.value
    //   );
    //   element?.map(async (e) => {
    //     const userPermissions = await pool.query(
    //       `insert into map_user_permission(user_id, permission_id) values($1, $2)`,
    //       [Number(userId), e.permission_id]
    //     );
    //   });
    // }

    await updateUserRoles(12);

    await pool.query("COMMIT");

    res.status(StatusCodes.CREATED).json({ data });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.log(error);
    throw new BadRequestError(`Something went wrong! Please try again later`);
  }
};

export const updateUserRoles = async (req, res) => {
  console.log(req.id);
};
