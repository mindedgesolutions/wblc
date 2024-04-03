import { StatusCodes } from "http-status-codes";
import pool from "../db.js";
import { paginationLogic } from "../utils/pagination.js";
import { BadRequestError } from "../errors/customErrors.js";
import { v4 as uuidv4 } from "uuid";
import { hashPassword } from "../utils/passwordUtils.js";
import { createUsername, currentDate } from "../utils/functions.js";

export const getAllUsers = async (req, res) => {
  const { name, page } = req.query;
  const pagination = paginationLogic(page, null);
  let search = name ? `where um.name ilike '%${name}%'` : ``;

  const data = await pool.query(
    `select um.*,
    json_agg(
      json_build_object(
        'role_id', mur.role_id,
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

// ------

export const getAllUserPermissions = async (req, res) => {
  const { name, page } = req.query;
  const pagination = paginationLogic(page, null);
  let search = name ? `where um.name ilike '%${name}%'` : ``;
};

// ------

export const addNewUser = async (req, res) => {
  const { name, email, mobile, roles } = req.body;
  const uuid = uuidv4();
  const password = await hashPassword("welcome123");
  const username = await createUsername(name);
  const dateTime = currentDate();

  try {
    // await pool.query("BEGIN");

    const data = await pool.query(
      `insert into user_master(name, email, mobile, username, password, uuid, created_at, updated_at) values($1, $2, $3, $4, $5, $6, $7, $8) returning id`,
      [name, email, mobile, username, password, uuid, dateTime, dateTime]
    );

    if (data.rows[0].id) {
      const allRolePermissions = await pool.query(
        `select role_id, permission_id from map_role_permission`
      );

      for (const role of roles) {
        const userRoles = await pool.query(
          `insert into map_user_role(user_id, role_id) values($1, $2)`,
          [Number(data.rows[0].id), Number(role.value)]
        );

        const element = allRolePermissions.rows.filter(
          (i) => i.role_id === role.value
        );
        element?.map(async (e) => {
          const userPermissions = await pool.query(
            `insert into map_user_permission(user_id, permission_id) values($1, $2)`,
            [Number(data.rows[0].id), e.permission_id]
          );
        });
      }
    }

    // await pool.query("COMMIT");

    res.status(StatusCodes.CREATED).json({ data });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.log(error);
    throw new BadRequestError(`Something went wrong! Please try again later`);
  }
};

// ------

export const editUser = async (req, res) => {
  const { id } = req.query;
  const { name, email, mobile, roles } = req.body;
  const dateTime = currentDate();

  try {
    // await pool.query("BEGIN");

    const data = await pool.query(
      `update user_master set name=$1, email=$2, mobile=$3, updated_at=$4 where id=$5`,
      [name, email, mobile, dateTime, id]
    );

    if (id) {
      const allRolePermissions = await pool.query(
        `select role_id, permission_id from map_role_permission`
      );

      await pool.query(`delete from map_user_role where user_id=$1`, [id]);

      await pool.query(`delete from map_user_permission where user_id`, [id]);

      for (const role of roles) {
        const userRoles = await pool.query(
          `insert into map_user_role(user_id, role_id) values($1, $2)`,
          [Number(id), Number(role.value)]
        );

        const element = allRolePermissions.rows.filter(
          (i) => i.role_id === role.value
        );
        element?.map(async (e) => {
          const userPermissions = await pool.query(
            `insert into map_user_permission(user_id, permission_id) values($1, $2)`,
            [Number(id), e.permission_id]
          );
        });
      }
    }

    // await pool.query("COMMIT");

    res.status(StatusCodes.CREATED).json({ data });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.log(error);
    throw new BadRequestError(`Something went wrong! Please try again later`);
  }
};
