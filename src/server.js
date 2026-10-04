const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// فحص جاهزية السيرفر (Health Check)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
