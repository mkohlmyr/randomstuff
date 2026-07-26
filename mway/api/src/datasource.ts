import { Pool } from "pg";
import { getEnvironmentVariables } from './environment';
import { Vehicle, State } from "./schema";

const state: Record<string, State> = {
  quoted: State.Quoted,
  selling: State.Selling,
  sold: State.Sold,
};

export class PostgresDataSource {
  private pool: Pool;

  constructor() {
    const {
      POSTGRES_USER,
      POSTGRES_HOST,
      POSTGRES_PORT,
      POSTGRES_DATABASE,
      POSTGRES_PASSWORD
    } = getEnvironmentVariables();
    
    this.pool = new Pool({
      user: POSTGRES_USER,
      host: POSTGRES_HOST,
      port: POSTGRES_PORT,
      database: POSTGRES_DATABASE,
      password: POSTGRES_PASSWORD
    });
  }

  async getVehicleStatus(id: number, at: Date): Promise<Vehicle | null> {
    // We'll search primarily on the state_logs table as it 
    // contains the more relevant data for filtering, and 
    // then join from there.
    // 
    const result = await this.pool.query(`
      SELECT 
        v.id, 
        v.make, 
        v.model, 
        s.state 
      FROM state_logs s 
      LEFT JOIN vehicles v ON v.id = s.vehicle_id
      WHERE 
        s.vehicle_id = $1 and s.timestamp <= $2 
      ORDER BY s.timestamp DESC LIMIT 1
    `, [id, at]);
    
    if (result.rowCount) {
      return {
        id: result.rows[0].id,
        make: result.rows[0].make,
        model: result.rows[0].model,
        state: state[result.rows[0].state],
      };
    } else {
      return null;
    }
  }
}