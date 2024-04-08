import { StatusCodes } from "http-status-codes";
import pool from "../db.js";
import { paginationLogic } from "../utils/pagination.js";
import slug from "slug";
import { BadRequestError } from "../errors/customErrors.js";

export const getAllRoles = async (req, res) => {
  const { name, page } = req.query;
  const pagination = paginationLogic(page, null);
  let search = name ? `where roles.name ilike '%${name}%'` : ``;

  const data = await pool.query(
    `select roles.*,
    json_agg(
      json_build_object(
        'permission_id', map_role_permission.permission_id,
        'permission_name', permissions.name
      )
    ) as permissions
    from roles
    left join map_role_permission on roles.id = map_role_permission.role_id
    left join permissions on permissions.id = map_role_permission.permission_id
    ${search} group by roles.id order by roles.id desc offset $1 limit $2`,
    [pagination.offset, pagination.pageLimit]
  );

  const records = await pool.query(`select * from roles ${search}`, []);
  const totalPages = Math.ceil(records.rowCount / pagination.pageLimit);
  const meta = {
    totalPages: totalPages,
    currentPage: pagination.pageNo,
    totalRecords: records.rowCount,
  };

  res.status(StatusCodes.OK).json({ data, meta });
};

// ------

export const getRolesWOPagination = async (req, res) => {
  const data = await pool.query(`select * from roles`, []);
  res.status(StatusCodes.OK).json({ data });
};

// ------

export const addNewRole = async (req, res) => {
  const { name, desc } = req.body;
  const nameSlug = slug(name);
  const description = desc ? desc.trim() : null;

  const data = await pool.query(
    `insert into roles(name, description, slug) values($1, $2, $3) returning *`,
    [name.trim(), description, nameSlug]
  );
  res.status(StatusCodes.CREATED).json({ data });
};

// ------

export const deleteRole = async (req, res) => {
  const { id } = req.query;
  const data = await pool.query(
    `update roles set is_active=false where id=$1`,
    [id]
  );
  res.status(StatusCodes.ACCEPTED).json({ data });
};

// ------

export const activateRole = async (req, res) => {
  const { id } = req.params;
  const data = await pool.query(`update roles set is_active=true where id=$1`, [
    id,
  ]);
  res.status(StatusCodes.ACCEPTED).json({ data });
};

// ------

export const updateRole = async (req, res) => {
  const { id } = req.params;
  const { name, desc } = req.body;
  const newSlug = slug(name);
  const description = desc ? desc.trim() : null;
  const data = await pool.query(
    `update roles set name=$1, description=$2, slug=$3 where id=$4 returning *`,
    [name.trim(), description, newSlug, id]
  );
  res.status(StatusCodes.ACCEPTED).json({ data });
};

// Map role and permission starts ------
export const rolePermissions = async (req, res) => {
  const { roleId, permissions } = req.body;

  try {
    await pool.query(`BEGIN`);

    if (permissions.length > 0) {
      const allPermissions = await pool.query(
        `select id, name from permissions where is_active=true`
      );

      await pool.query(`delete from map_role_permission where role_id=$1`, [
        roleId,
      ]);

      let userIds = await pool.query(
        `delete from map_user_permission where role_id=$1 returning user_id`,
        [roleId]
      );
      userIds = [...new Set((userIds = userIds.rows.map((i) => i.user_id)))];

      // For all permissions ------
      if (permissions[0].value === process.env.ALL_PERMISSIONS) {
        for (const permission of allPermissions.rows) {
          await pool.query(
            `insert into map_role_permission(role_id, permission_id) values($1, $2)`,
            [roleId, permission.id]
          );
        }

        for (const user of userIds) {
          for (const permission of allPermissions.rows) {
            await pool.query(
              `insert into map_user_permission(user_id, permission_id, role_id, key) values($1, $2, $3, $4)`,
              [user, permission.id, roleId, roleId + "-" + permission.value]
            );
          }
        }
      } else {
        // For selected permissions ------
        for (const permission of permissions) {
          await pool.query(
            `insert into map_role_permission(role_id, permission_id) values($1, $2)`,
            [roleId, permission.value]
          );
        }

        for (const user of userIds) {
          for (const permission of permissions) {
            await pool.query(
              `insert into map_user_permission(user_id, permission_id, role_id, key) values($1, $2, $3, $4)`,
              [user, permission.value, roleId, roleId + "-" + permission.value]
            );
          }
        }
      }

      await pool.query(`COMMIT`);

      res.status(StatusCodes.OK).json({ data: `success` });
    }
  } catch (error) {
    await pool.query(`ROLLBACK`);
    console.log(error);
    throw new BadRequestError(`Something went wrong! Please try again`);
  }
};
// Map role and permission ends ------
