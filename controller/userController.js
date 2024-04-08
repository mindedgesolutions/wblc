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

  const data = await pool.query(
    `select um.*,
    json_agg(
      json_build_object(
        'permission_id', mup.permission_id,
        'permission_name', permissions.name
      )
    ) as permissions
    from user_master as um
    left join map_user_permission mup on mup.user_id = um.id
    left join permissions on permissions.id = mup.permission_id
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

export const getUserDetails = async (req, res) => {
  const { uuid } = req.uuid;
  const user = await pool.query(
    `select id, name, email, mobile from user_master where uuid='${uuid}'`,
    []
  );

  let roles, permissions;

  if (user.rows[0].id) {
    roles = await pool.query(
      `select mur.role_id, roles.name from map_user_role mur left join roles on mur.role_id = roles.id where mur.user_id=$1`,
      [user.rows[0].id]
    );

    permissions = await pool.query(
      `select mup.permission_id, permissions.name from map_user_permission mup left join permissions on mup.permission_id = permissions.id where mup.user_id=$1`,
      [user.rows[0].id]
    );
  }
  res
    .status(StatusCodes.OK)
    .json({ user: user, roles: roles, permissions: permissions });
};

// ------

export const addNewUser = async (req, res, callback) => {
  const { name, email, mobile, roles } = req.body;
  const uuid = uuidv4();
  const password = await hashPassword("welcome123");
  const username = await createUsername(name);
  const dateTime = currentDate();

  try {
    await pool.query("BEGIN");

    const data = await pool.query(
      `insert into user_master(name, email, mobile, username, password, uuid, created_at, updated_at) values($1, $2, $3, $4, $5, $6, $7, $8) returning id`,
      [name, email, mobile, username, password, uuid, dateTime, dateTime]
    );
    const userId = data.rows[0].id;

    // ------

    const allRolePermissions = await pool.query(
      `select role_id, permission_id from map_role_permission`
    );
    let allPermissions = [];

    for (const role of roles) {
      await pool.query(
        `insert into map_user_role(user_id, role_id) values($1, $2)`,
        [Number(userId), Number(role.value)]
      );

      let element = allRolePermissions.rows.filter(
        (i) => i.role_id === role.value
      );
      allPermissions.push(element);
    }

    // ------

    for (const permission of allPermissions) {
      for (const i of permission) {
        await pool.query(
          `insert into map_user_permission(user_id, permission_id, role_id, key) values($1, $2, $3, $4)`,
          [
            Number(userId),
            Number(i.permission_id),
            Number(i.role_id),
            i.role_id + "-" + i.permission_id,
          ]
        );
      }
    }

    await pool.query("COMMIT");

    res.status(StatusCodes.CREATED).json({ data: `success` });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.log(error);
    throw new BadRequestError(`Something went wrong! Please try again later`);
  }
};

// ------

export const editUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, mobile, roles } = req.body;
  const dateTime = currentDate();

  try {
    await pool.query("BEGIN");

    const data = await pool.query(
      `update user_master set name=$1, email=$2, mobile=$3, updated_at=$4 where id=$5 returning id`,
      [name, email, mobile, dateTime, id]
    );

    if (roles.length > 0) {
      await pool.query(`delete from map_user_role where user_id=$1`, [id]);
      await pool.query(`delete from map_user_permission where user_id=$1`, [
        id,
      ]);

      const allRolePermissions = await pool.query(
        `select role_id, permission_id from map_role_permission`
      );
      let allPermissions = [];

      for (const role of roles) {
        await pool.query(
          `insert into map_user_role(user_id, role_id) values($1, $2)`,
          [id, Number(role.value)]
        );

        let element = allRolePermissions.rows.filter(
          (i) => i.role_id === role.value
        );
        allPermissions.push(element);
      }

      for (const permission of allPermissions) {
        for (const i of permission) {
          await pool.query(
            `insert into map_user_permission(user_id, permission_id, role_id, key) values($1, $2, $3, $4)`,
            [
              id,
              Number(i.permission_id),
              Number(i.role_id),
              i.role_id + "-" + i.permission_id,
            ]
          );
        }
      }
    }

    await pool.query("COMMIT");

    res.status(StatusCodes.CREATED).json({ data });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.log(error);
    throw new BadRequestError(`Something went wrong! Please try again later`);
  }
};

// ------

export const updateUserPermission = async (req, res) => {
  const { userId, permissions } = req.body;
  if (permissions.length > 0) {
    try {
      await pool.query(`BEGIN`);

      await pool.query(`delete from map_user_permission where user_id=$1`, [
        userId,
      ]);

      for (const i of permissions) {
        const roleIds = await pool.query(
          `select role_id from map_role_permission where permission_id=$1`,
          [i.value]
        );
        await pool.query(
          `insert into map_user_permission(user_id, permission_id, role_id, key) values($1, $2, $3, $4)`,
          [
            userId,
            i.value,
            roleIds.rows[0].role_id,
            roleIds.rows[0].role_id + "-" + i.value,
          ]
        );
      }
      await pool.query(`COMMIT`);

      res.status(StatusCodes.OK).json({ data: `success` });
    } catch (error) {
      await pool.query(`ROLLBACK`);
      console.log(error);
      throw new BadRequestError(`Something went wrong!`);
    }
  }
};
