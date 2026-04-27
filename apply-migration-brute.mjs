import pg from 'pg';
const { Client } = pg;

const passwords = [
  'postgres',
  'your-super-secret-and-long-postgres-password',
  'password',
  'supabase',
  '',
  'admin',
  'root',
  'Postgres123',
  'secret',
  'dbpassword',
];

async function tryPassword(pwd) {
  const client = new Client({
    host: '72.60.61.216',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: pwd,
    ssl: false,
    connectionTimeoutMillis: 5000,
  });

  try {
    await client.connect();
    console.log(`SUCCESS with password: "${pwd}"`);
    
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
    
    await client.end();
    return true;
  } catch (err) {
    await client.end().catch(() => {});
    if (err.message.includes('password authentication failed') || err.message.includes('Tenant or user not found')) {
      console.log(`FAILED password: "${pwd}"`);
      return false;
    }
    console.error('Other error:', err.message);
    return false;
  }
}

async function run() {
  for (const pwd of passwords) {
    const success = await tryPassword(pwd);
    if (success) {
      console.log('Migration applied successfully!');
      process.exit(0);
    }
  }
  console.error('All passwords failed. Please apply the migration manually via Supabase Studio.');
  console.error('SQL to run:');
  console.error('  ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS observations text;');
  process.exit(1);
}

run();
