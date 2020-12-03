const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('ONLINE 24/7 \`\`BOIIII\`\`')
});

app.listen(3000, () => {
  console.log('server started');
});