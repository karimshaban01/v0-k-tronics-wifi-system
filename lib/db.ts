import mysql from "mysql2/promise"

let pool: mysql.Pool | null = null

export function getDbPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      port: Number.parseInt(process.env.DB_PORT || "3306"),
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "ktronics_wifi",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    })
  }
  return pool
}

export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  const connection = await getDbPool().getConnection()
  try {
    const [rows] = await connection.execute(sql, params)
    return rows as T[]
  } finally {
    connection.release()
  }
}

export async function queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
  const results = await query<T>(sql, params)
  return results.length > 0 ? results[0] : null
}
