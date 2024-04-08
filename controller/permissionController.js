import { StatusCodes } from "http-status-codes";
import pool from "../db.js";
import { paginationLogic } from "../utils/pagination.js";
import slug from "slug";
import { BadRequestError } from "../errors/customErrors.js";

export const getAllPermissions = async (req, res) => {
  const { name, page } = req.query;
  const pagination = paginationLogic(page, null);
  let search = name
    ? `where permissions.name ilike '%${name}%' or modules.name ilike '%${name}%'`
    : ``;

  const data = await pool.query(
    `select permissions.*, modules.name as m_name from permissions join modules on permissions.module_id = modules.id ${search} order by modules.name, permissions.name desc offset $1 limit $2`,
    [pagination.offset, pagination.pageLimit]
  );

  const records = await pool.query(
    `select permissions.* from permissions join modules on permissions.module_id = modules.id ${search}`,
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

export const getPermissionsWOPagination = async (req, res) => {
  const data = await pool.query(`select * from permissions`, []);
  res.status(StatusCodes.OK).json({ data });
};

// ------

export const addNewPermission = async (req, res) => {
  const { moduleId, name, desc } = req.body;
  const nameSlug = slug(name);
  const description = desc ? desc.trim() : null;

  const data = await pool.query(
    `insert into permissions(name, description, slug, module_id) values($1, $2, $3, $4) returning *`,
    [name.trim(), description, nameSlug, moduleId]
  );
  res.status(StatusCodes.CREATED).json({ data });
};

// ------

export const deletePermission = async (req, res) => {
  const { id } = req.query;

  const checkRole = await pool.query(
    `select count(permission_id) from map_role_permission where permission_id=$1`,
    [Number(id)]
  );
  if (checkRole.rows[0].count > 0)
    throw new BadRequestError(`Permission is mapped with a role`);

  // ------
  const checkUser = await pool.query(
    `select count(permission_id) from map_user_permission where permission_id=$1`,
    [Number(id)]
  );
  if (checkUser.rows[0].count > 0)
    throw new BadRequestError(`Permission is mapped with a user`);

  // ------
  const data = await pool.query(
    `update permissions set is_active=false where id=$1 returning id`,
    [Number(id)]
  );
  res.status(StatusCodes.ACCEPTED).json({ data });
};

// ------

export const activatePermission = async (req, res) => {
  const { id } = req.params;
  const data = await pool.query(
    `update permissions set is_active=true where id=$1`,
    [id]
  );
  res.status(StatusCodes.ACCEPTED).json({ data });
};

// ------

export const updatePermission = async (req, res) => {
  const { id } = req.params;
  const { name, desc } = req.body;
  const newSlug = slug(name);
  const description = desc ? desc.trim() : null;
  const data = await pool.query(
    `update permissions set name=$1, description=$2, slug=$3 where id=$4 returning *`,
    [name.trim(), description, newSlug, id]
  );
  res.status(StatusCodes.ACCEPTED).json({ data });
};
