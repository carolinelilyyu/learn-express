import express, { Express, Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import {User, UserRequest} from './types';

const readUsersRouter = (dataFile: string) => {
    const router = express.Router();

    let users: User[];

    //load file
    const loadUsers = (): Promise<User[]> => {
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
    router.use(addUsersToRequest);

    //GET all usernames
    router.get('/usernames', (req: UserRequest, res:Response) => {
        const usernames = req.users?.map((user) => ({
            id: user.id,
            username: user.username,
        }));
        res.json(usernames);
    });

    //GET specific user by ID
    router.get('/:id', (req: UserRequest, res:Response) => {
        const userId = parseInt(req.params.id, 10);
        const user = req.users?.find((u) => u.id === userId);
        if(user){
            res.json(user);
        } else {
            res.status(404).json({
                error: {message: 'User not found', status: 404},
            });
        }
    });
    return router;
};

export default readUsersRouter;
