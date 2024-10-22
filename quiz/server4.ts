
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import readUsersRouter from './readUsers';
import writeUsersRouter from './writeUsers';
import {User, UserRequest} from './types';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 8000;
const dataFile = '../data/users.json';

//Middleware
app.use(cors({origin: 'http://localhost:3000'}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Mount routers
// app.use('/read', readUsersRouter);
// app.use('/write', writeUsersRouter(dataFile));

const router = express.Router();

//load file
export const loadUsers = (): Promise<User[]> => {
  return new Promise((resolve, reject) => {
      fs.readFile(path.resolve(dataFile), (err,data) => {
          if(err){
              reject(err);
          } 
          const users = JSON.parse(data.toString());
          resolve(users);
      });
  })
}

//Middleware to add users to the request object
const addUsersToRequest = async (req: UserRequest, res:  Response, next: NextFunction) => {
  try{
      req.users = await loadUsers();
      next();
  }catch(error){
      console.error('Failed to load users', error);
      return res.status(500).json({
          error: { message: 'Failed to load users', status: 500 },
      });
  }
};

//Use the middleware for all routes in /read
//Mount the routers
app.use('/read', addUsersToRequest, readUsersRouter());
app.use('/write', addUsersToRequest, writeUsersRouter(dataFile));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
