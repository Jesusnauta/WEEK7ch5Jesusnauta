import { NextFunction, Request, Response } from 'express';
import { Repo } from '../repository/repo.interface';
import { UsersController } from './users.controller';
import { Auth } from '../services/auth.js';
import { UserStructure } from '../entities/user.js';

jest.mock('../services/auth.js');

jest.mock('../config.js', () => ({
  _dirname: 'test',
  config: {
    secret: 'test',
  },
}));

describe('Given the UsersController', () => {
  const mockRepo = {
    query: jest.fn(),
    queryId: jest.fn(),
    create: jest.fn(),
    search: jest.fn(),
    update: jest.fn(),
  } as unknown as Repo<UserStructure>;

  const controller = new UsersController(mockRepo);

  const resp = {
    status: jest.fn(),
    json: jest.fn(),
  } as unknown as Response;
  const next = jest.fn() as unknown as NextFunction;

  describe('When Register method is called', () => {
    test('Then if the user information is completed, it should return the resp.satus and resp.json', async () => {
      const req = {
        body: {
          userName: 'test',
          password: 'test',
        },
      } as unknown as Request;

      await controller.register(req, resp, next);
      expect(mockRepo.create).toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then user data in the body, is not username, should be cath error');

    describe('When there are NOT password in th body', () => {
      const req = {
        body: {
          email: 'test',
        },
      } as Request;
      test('Then next should been called', async () => {
        await controller.register(req, resp, next);
        expect(next).toHaveBeenCalled();
      });
    });

    describe('When there are NOT email in th body', () => {
      const req = {
        body: {
          passwd: 'test',
        },
      } as Request;
      test('Then next should been called', async () => {
        await controller.register(req, resp, next);
        expect(next).toHaveBeenCalled();
      });
    });

    describe('When there are NOT email and NOT passwd in th body', () => {
      const req = {
        body: {},
      } as Request;
      test('Then next should been called', async () => {
        await controller.register(req, resp, next);
        expect(next).toHaveBeenCalled();
      });
    });

    describe('When all is OK ', () => {
      const req = {
        body: {
          email: 'test',
          passwd: 'test',
        },
      } as Request;
      test('Then json should been called', async () => {
        await controller.register(req, resp, next);
        expect(resp.json).toHaveBeenCalled();
      });
    });
  });

  describe('Given login method from UsersController', () => {
    const mockRepo = {
      create: jest.fn(),
      search: jest.fn(),
    } as unknown as Repo<UserStructure>;

    const controller = new UsersController(mockRepo);

    const resp = {
      status: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;

    const req = {
      body: {
        email: 'test',
        passwd: 'test',
      },
    } as Request;

    const next = jest.fn();

    Auth.compare = jest.fn().mockResolvedValue(true);

    describe('When ALL is OK', () => {
      (mockRepo.search as jest.Mock).mockResolvedValue(['test']);
      test('Then json should be called', async () => {
        await controller.login(req, resp, next);
        expect(resp.json).toHaveBeenCalled();
      });
    });
  });
});
