const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json());

const policyRouter = require('./routes/policy');
app.use('/api/policy', policyRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
