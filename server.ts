// server.ts - Entry point that properly loads environment variables
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables first
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Then import and start the actual server
import('./server/index.ts');