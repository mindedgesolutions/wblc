import { StatusCodes } from "http-status-codes";
import pool from "../db.js";
import { paginationLogic } from "../utils/pagination.js";
import slug from "slug";

export const getAllRoles = async (req, res) => {
  const { name, page } = req.query;
  const pagination = paginationLogic(page, null);
  let search = name ? `where name ilike '%${name}%'` : ``;

  const data = await pool.query(
    `select * from roles ${search} order by id desc offset $1 limit $2`,
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

export const deleteRole = async (req, res) => {
  const { id } = req.query;
  const data = await pool.query(
    `update roles set is_active=false where id=$1`,
    [id]
  );
  res.status(StatusCodes.ACCEPTED).json({ data });
};

export const activateRole = async (req, res) => {
  const { id } = req.params;
  const data = await pool.query(`update roles set is_active=true where id=$1`, [
    id,
  ]);
  res.status(StatusCodes.ACCEPTED).json({ data });
};

export const updateRole = async (req, res) => {
  const { id } = req.params;
  const { name, desc } = req.body;
  const description = desc ? desc.trim() : null;
  const data = await pool.query(
    `update roles set name=$1, description=$2 where id=$3 returning *`,
    [name.trim(), description, id]
  );
  res.status(StatusCodes.ACCEPTED).json({ data });
};