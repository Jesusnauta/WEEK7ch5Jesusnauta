import { Router } from 'express';
import { UsersController } from '../controller/users.controller.js';
import { UsersMongoRepo } from '../repository/users.mongo.repo.js';

// eslint-disable-next-line new-cap
export const usersRouter = Router();
// File Repo previous const repo = new UsersFileRepo();
const repo = UsersMongoRepo.getInstance();
const controller = new UsersController(repo);

usersRouter.get('/', controller.getAll.bind(controller));
usersRouter.post('/register', controller.register.bind(controller));
usersRouter.post('/login', controller.login.bind(controller));
/*  TEMP
usersRouter.patch('/addFriends/:id', controller.addFriends.bind(controller));
usersRouter.patch('/addEnemies/:id', controller.addEnemies.bind(controller));
usersRouter.patch('/deleteFriends/:id', controller.deleteFriends.bind(controller));
usersRouter.patch('/deleteEnemies/:id', controller.deleteEnemies.bind(controller));

*/
