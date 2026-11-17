import { Agent, fetch as undiciFetch } from 'undici';
import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required.');

const lookup = (hostname, options, callback) => {
  void fetch(`https://dns.google/resolve?name=${encodeURIComponent(hostname)}&type=A`)
    .then((response) => response.json())
    .then((body) => {
      const address = body.Answer?.find((answer) => Number(answer.type) === 1)?.data;
      if (!address) throw new Error(`No IPv4 record found for ${hostname}.`);
      callback(null, options.all ? [{ address, family: 4 }] : address, 4);
    })
    .catch(callback);
};

const dispatcher = new Agent({ connect: { lookup } });
neonConfig.fetchFunction = async (url, init) => {
  try {
    return await fetch(url, init);
  } catch {
    return undiciFetch(url, { ...init, dispatcher });
  }
};

const db = drizzle({ client: neon(connectionString) });
await migrate(db, { migrationsFolder: 'drizzle' });
await dispatcher.close();
console.log('Database migrations applied.');
