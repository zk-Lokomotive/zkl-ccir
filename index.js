const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const appRoute = require('./routes/app.route.js');

require('dotenv').config()
const PORT = process.env.PORT || 3000;

const logger = (req, res, next) => {
  console.log(
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'
  );
  console.log('----------BODY----------');
  console.log(req.body);
  console.log();
  console.log('----------HEAD----------');
  console.log(req.headers);
  console.log(
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'
  );
  next();
}

const app = express();
app.enable('trust proxy');
app.disable('x-powered-by');
app.use(express.json({ limit: '64mb' } ));
app.use(cors());
app.use(
  morgan(
    '[ :method :url ] ~:status | :date[web] | :total-time[digits] ms | IP :remote-addr | :user-agent'
  )
);
app.use(logger, appRoute);

mongoose.connect(process.env.MONGODB_URI).then(() => { console.info('Database connected'); });

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  try {
    const authRecord = await AuthToken.findOne({ auth_token: token });
    if (!authRecord) return res.sendStatus(403);

    req.address = authRecord.address;
    req.authType = authRecord.type;
    next();
  } catch (error) {
    return res.sendStatus(403);
  }
};

app.get('/api/hello', (req, res) => {
  res.status(200).json({
    message: 'Close the world, .txen eht nepO',
    author: 'Yigid BALABAN <fyb@fybx.dev>',
    authorHomepage: 'https://fybx.dev/'
  })
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
