const express = require('express');
const app = express();

app.get('/ping', (req, res) => {
  res.send('pong');
});

if (require.main === module) {
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
