const fs = require('fs');

fs.writeFileSync(
  './.env',
  `PRODUCTS_API_URL=${process.env.PRODUCTS_API_URL}\n`,
);
