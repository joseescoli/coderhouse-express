import { dirname } from 'path';
import { fileURLToPath } from 'url';
export const __dirname = dirname(fileURLToPath(import.meta.url));   //"C:\\Users\\ADMIN\\Documents\\GITHUB\\coderhouse-backend-express-test\\src\"
// export const __dirname = dirname(import.meta.url); //"file:///C:/Users/ADMIN/Documents/GITHUB/coderhouse-backend-express-test/src"