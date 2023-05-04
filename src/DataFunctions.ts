// const sqlite3 = require("sqlite3").verbose();
import * as sqlite3 from "sqlite3";

// global database object
export const database = new sqlite3.Database(
  "./data/discord.db",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE
);

// initializes tables if they do not already exist
export const InitTables = () => {
  database.serialize(() => {
    database
      .prepare(`CREATE TABLE IF NOT EXISTS channels (ID TEXT PRIMARY KEY)`)
      .run()
      .finalize();
    database
      .prepare(`CREATE TABLE IF NOT EXISTS dms (ID TEXT PRIMARY KEY)`)
      .run()
      .finalize();
  });
  console.log("Initialized Database");
};

export const AppendId = (table: string, id: string) => {
  const selectSql = `SELECT COUNT(*) AS count FROM ${table} WHERE ID = ?`;
  const insertSql = `INSERT INTO ${table} (ID) VALUES (?)`;
  return new Promise((resolve) => {
    database.get(selectSql, [id.toString()], (err: Error, row: any) => {
      if (err) {
        console.log(err.message);
      }
      if (row.count == 0) {
        // inserts the id into the table
        database.run(insertSql, [id], (err: Error) => {
          if (err) {
            console.log(err.message);
          }
          console.log(`ID ${id} inserted into ${table}`);
        });
        // return true if added correctly
        resolve(true);
      } else {
        console.log(`ID ${id} already exists in ${table}`);
        // return false if error
        resolve(false);
      }
    });
  });
};

export const RemoveId = (table: string, id: string) => {
  const selectSql = `SELECT COUNT(*) AS count FROM ${table} WHERE ID = ?`;
  const removeSql = `DELETE FROM ${table} WHERE ID = ?`;
  return new Promise((resolve) => {
    database.get(selectSql, [id], (err: Error, row: any) => {
      if (err) {
        console.log(err.message);
      }
      // id value exists in the table
      if (row.count != 0) {
        database.run(removeSql, [id], (err: Error) => {
          if (err) {
            console.log(err.message);
          }
          console.log(`ID ${id} removed from ${table}`);
        });
        // return true if removed correctly
        resolve(true);
      } else {
        console.log(`ID ${id} does not exist in ${table}`);
        // return false if error
        resolve(false);
      }
    });
  });
};

// returns array of all ids in table
export const GetAllIds = async (
  table: "dms" | "channels"
): Promise<string[]> => {
  return new Promise((resolve) => {
    let IDS = [];
    database.all(`SELECT ID FROM ${table}`, (err: Error, rows: any) => {
      if (err) {
        console.log(err.message);
      }
      IDS = rows.map((row: any) => row.ID);
      resolve(IDS);
    });
  });
};

// close the database connection
export const CloseDb = () => {
  database.close((err: Error | null) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Closed the database connection.");
  });
};
