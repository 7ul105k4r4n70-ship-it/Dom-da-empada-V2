import pg from 'pg';
const { Client } = pg;

async function run() {
  const client = new Client({
    host: '72.60.61.216',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'postgres',
    ssl: false,
  });

  try {
    await client.connect();
    console.log('Connected to Postgres');
    
    const result = await client.query(`
      ALTER TABLE public.orders
      ADD COLUMN IF NOT EXISTS observations text;
    `);
    console.log('Migration applied:', result.command);
    
    const check = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'orders' AND column_name = 'observations'
    `);
    console.log('Column check:', check.rows);
    
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
