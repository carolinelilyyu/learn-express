
import express, { Express } from 'express';
import cors from 'cors';
import readUsersRouter from './readUsers';
import writeUsersRouter from './writeUsers';


const app = express();
const port = 8000;
const dataFile = '../data/users.json';

//Middleware
app.use(cors({origin: 'http://localhost:3000'}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Mount routers
app.use('/read', readUsersRouter(dataFile));
app.use('/write', writeUsersRouter(dataFile));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
