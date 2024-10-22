import express, { Express, Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import {User, UserRequest} from './types';

const readUsersRouter = () => {
    const router = express.Router();

    let users: User[];


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
