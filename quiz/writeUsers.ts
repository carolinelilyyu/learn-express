import express, { Express, Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import {User, UserRequest} from './types';
import { loadUsers } from './server4'; // Import loadUsers from server4

const writeUsersRouter = (dataFile: string) => {
    const router = express.Router();


    //POST to add a new user
    router.post('/adduser', async (req:UserRequest, res:Response) => {
        try {
            const users = await loadUsers();

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
        } catch (error) {
            console.error('Error loading users:', error);
            res.status(500).json({ message: 'Failed to load users' });
        }
    });

    return router;
};

export default writeUsersRouter;
