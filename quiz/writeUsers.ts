import express, { Express, Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import {User, UserRequest} from './types';
const writeUsersRouter = (dataFile: string) => {
    const router = express.Router();

    let users: User[];

    //Load users when the module initializes
    const loadUsers = () => {
        fs.readFile(path.resolve(dataFile), (err,data) => {
            if(err) throw err;
            users = JSON.parse(data.toString());
        });
    }

    loadUsers();

    //middleware to add users to the request object
    const addUsersToRequest = (req: UserRequest, res: Response, next:Function) => {
        if(users) {
            req.users = users;
            next();
        } else {
            return res.status(404).json({
                error: {message: 'users not found', status:404}
            });
        }
    };

    //use the middleware for all routes under /write
    router.use(addUsersToRequest);

    //POST to add a new user
    router.post('/adduser', (req:UserRequest, res:Response) => {
        const newUser = req.body as User;
        users.push(newUser);
        fs.writeFile(path.resolve(dataFile), JSON.stringify(users), (err) => {
            if (err) {
                console.error('Failed to write');
                return res.status(500).json({ message: 'Failed to save user'});
            } else {
                console.log('User Saved');
                loadUsers();
                res.json({message : 'User added successfully'});
            }
        });
    });

    return router;
};

export default writeUsersRouter;
