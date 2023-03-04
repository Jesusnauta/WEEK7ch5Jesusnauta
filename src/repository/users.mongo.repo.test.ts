import { User } from '../entities/users';
import { UserModel } from './users.mongo.model';
import { UsersMongoRepo } from './users.mongo.repo';

jest.mock('./users.mongo.model');

describe('Given the UserRepo class', () => {
  const repo = UsersMongoRepo.getInstance();
  describe('When it is called', () => {
    test('Then it should be instantiated', () => {
      expect(repo).toBeInstanceOf(UsersMongoRepo);
    });
  });

  describe('When query method is called', () => {
    test('Then it should return a array', async () => {
      const mockUser = [{ user: 'test' }];
      (UserModel.find as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue(mockUser),
      }));

      const result = await repo.query();

      expect(UserModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });

  describe('When i use queryId', () => {
    beforeEach(async () => {
      (UserModel.findById as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue({ id: '1' }),
      }));
    });
    test('Then should return the selected data', async () => {
      const result = await repo.queryId('1');
      expect(UserModel.findById).toHaveBeenCalled();
      expect(result).toEqual({ id: '1' });
    });
    test('Then if the findById method resolve value to undefined, it should throw an Error', async () => {
      (UserModel.findById as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue(null),
      }));
      expect(async () => repo.queryId('3')).rejects.toThrow();
    });
  });

  describe('When search method is called', () => {
    test('Then if the id is found it should return an array', async () => {
      const mockUser = [{ key: 'test', value: '23' }];
      (UserModel.find as jest.Mock).mockResolvedValue(mockUser);

      const result = await repo.search({ key: 'test', value: '23' });

      expect(UserModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
    test('Then the id is NOT found should throw error', async () => {
      (UserModel.find as jest.Mock).mockResolvedValue(null);
      expect(async () =>
        repo.search({ key: 'testno', value: '25' })
      ).rejects.toThrow();
    });
  });

  describe('When i use create', () => {
    test('Then it should create a new User', async () => {
      (UserModel.create as jest.Mock).mockResolvedValue({ name: 'test' });

      const result = await repo.create({ name: 'test' });
      expect(UserModel.create).toHaveBeenCalled();
      expect(result).toEqual({ name: 'test' });
    });
  });

  describe('When the update method is used', () => {
    beforeEach(async () => {
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({ id: '2' });
    });

    test('Then if it has an object to update, it should return the updated object', async () => {
      const mockUser = {
        id: '2',
        name: 'test',
      } as Partial<User>;

      const result = await repo.update(mockUser);
      expect(UserModel.find).toHaveBeenCalled();
      expect(result).toEqual({ id: '2' });
    });
    test('Then if the findByIdAndUpdate method resolve value to undefined, it should throw an Error', async () => {
      const mockUser = {
        id: '2',
        name: 'test',
      } as Partial<User>;
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
      expect(async () => repo.update(mockUser)).rejects.toThrow();
    });
  });

  describe('When the delete method is used', () => {
    beforeEach(async () => {
      (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue({});
    });

    test('Then if it has an object to delete with its ID, the findByIdAndDelete function should be called', async () => {
      await repo.destroy('1');
      expect(UserModel.findByIdAndDelete).toHaveBeenCalled();
    });

    test('Then if the findByIdAndDelete method resolve value to undefined, it should throw an Error', async () => {
      (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
      expect(async () => repo.destroy('')).rejects.toThrow();
    });
  });
});
