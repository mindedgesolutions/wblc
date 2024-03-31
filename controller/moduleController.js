import * as dotenv from "dotenv";
dotenv.config();
import pool from "../db.js";
import { StatusCodes } from "http-status-codes";
import slug from "slug";
import { paginationLogic } from "../utils/pagination.js";

export const getModulesAll = async (req, res) => {
  const { name, page } = req.query;
  const pagination = paginationLogic(page, null);
  let search = name ? `where name ilike '%${name}%'` : ``;

  const data = await pool.query(
    `select * from modules ${search} order by id desc offset $1 limit $2`,
    [pagination.offset, pagination.pageLimit]
  );

  const records = await pool.query(`select * from modules ${search}`, []);
  const totalPages = Math.ceil(records.rowCount / pagination.pageLimit);
  const meta = {
    totalPages: totalPages,
    currentPage: pagination.pageNo,
    totalRecords: records.rowCount,
  };

  res.status(StatusCodes.OK).json({ data, meta });
};

export const addNewModule = async (req, res) => {
  const { name, desc } = req.body;
  const nameSlug = slug(name);
  const description = desc ? desc.trim() : null;

  const data = await pool.query(
    `insert into modules(name, description, slug) values($1, $2, $3) returning *`,
    [name.trim(), description, nameSlug]
  );
  res.status(StatusCodes.CREATED).json({ data });
};

export const deleteModule = async (req, res) => {
  const { id, tables } = req.query;

  let data;
  for (const table of tables) {
    data = await pool.query(
      `update ${table} set is_active=false where id=$1 returning id`,
      [id]
    );
  }
  res.status(StatusCodes.ACCEPTED).json({ data });
};

export const activateModule = async (req, res) => {
  const { id } = req.params;
  const data = await pool.query(
    `update modules set is_active=true where id=$1`,
    [id]
  );
  res.status(StatusCodes.ACCEPTED).json({ data });
};

export const updateModule = async (req, res) => {
  const { id } = req.params;
  const { name, desc } = req.body;
  const description = desc ? desc.trim() : null;
  const data = await pool.query(
    `update modules set name=$1, description=$2 where id=$3 returning *`,
    [name.trim(), description, id]
  );
  res.status(StatusCodes.ACCEPTED).json({ data });
};
