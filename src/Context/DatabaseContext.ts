import { createContext } from "react"
import * as SQLite from "expo-sqlite"
import type { WebSQLDatabase } from "expo-sqlite"

const database = SQLite.openDatabase("YTM.db")

const DatabaseContext = createContext<WebSQLDatabase>(database)

export default DatabaseContext

export {
  database
}
