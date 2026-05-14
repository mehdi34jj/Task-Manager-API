const pool = require("./config/db");

async function testDB() {
  try {
    const [rows] = await pool.query("SELECT 1");

    console.log("Database connected!");
    console.log(rows);

  } catch (error) {
    console.log(error);
  }
}

testDB();

