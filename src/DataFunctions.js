const sqlite3 = require("sqlite3").verbose();

// global db object
let db;

// open database in memory
function GetDb() {
  if (!db) {
    db = new sqlite3.Database(
      "../data/discord.db",
      sqlite3.OPEN_READWRITE,
      (err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log("Connected to the discord.db database");
      }
    );
  }
  return db;
}

// initializes tables if they do not already exist
function InitTables(db) {
  db.serialize(() => {
    db.prepare(`CREATE TABLE IF NOT EXISTS channels (ID TEXT PRIMARY KEY)`)
      .run()
      .finalize();
    db.prepare(`CREATE TABLE IF NOT EXISTS dms (ID TEXT PRIMARY KEY)`)
      .run()
      .finalize();
  });
}

function AppendId(db, table, id) {
  const selectSql = `SELECT COUNT(*) AS count FROM ${table} WHERE ID = ?`;
  const insertSql = `INSERT INTO ${table} (ID) VALUES (?)`;

  db.get(selectSql, [id], (err, row) => {
    if (err) {
      console.log(err.message);
    }
    if (row.count == 0) {
      // inserts the id into the table
      db.run(insertSql, [id], (err) => {
        if (err) {
          console.log(err.message);
        }
        console.log(`ID ${id} inserted into ${table}`);
      });
    } else {
      console.log(`ID ${id} already exists in ${table}`);
    }
  });
  return true;
}

function RemoveId(db, table, id) {
  const selectSql = `SELECT COUNT(*) AS count FROM ${table} WHERE ID = ?`;
  const removeSql = `DELETE FROM ${table} WHERE ID = ?`;
  db.get(selectSql, [id], (err, row) => {
    if (err) {
      console.log(err.message);
    }
    // id value exists in the table
    if (row.count == 0) {
      db.run(removeSql, [id], (err) => {
        if (err) {
          console.log(err.message);
        }
        console.log(`ID ${id} removed from ${table}`);
      });
    } else {
      console.log(`ID ${id} does not exist in ${table}`);
    }
  });
}

// returns array of all ids in table
function GetAllIds(db, table) {
  const sql = `SELECT ID FROM ${table}`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.log(err.message);
    }
    // console.log(rows);
    const ids = rows.map((row) => row.id);
    return ids;
  });
}

// close the database connection
function CloseDb(db) {
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Closed the database connection.");
  });
}

module.exports = {
  GetDb,
  InitTables,
  AppendId,
  RemoveId,
  GetAllIds,
  CloseDb,
};
