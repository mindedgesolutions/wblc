import * as dotenv from "dotenv";
dotenv.config();
import pool from "../db.js";
import { StatusCodes } from "http-status-codes";
import slug from "slug";
import { paginationLogic } from "../utils/pagination.js";

export const getModulesAll = async (req, res) => {
  const { name, page } = req.query;
  const pagination = paginationLogic(page, null);
  let search = name ? `name ilike '%${name}%' and ` : ``;

  const data = await pool.query(
    `select * from modules where ${search} is_active=true order by name offset $1 limit $2`,
    [pagination.offset, pagination.pageLimit]
  );

  const records = await pool.query(
    `select * from modules where ${search} is_active=true`,
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

export const deleteModule = async (req, res) => {};
