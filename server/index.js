const express = reuqire('express');
const cors = require('cors')

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});