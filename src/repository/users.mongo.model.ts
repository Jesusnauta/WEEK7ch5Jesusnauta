import { Schema, model, SchemaTypes } from 'mongoose';
import { User } from '../entities/users';

const userSchema = new Schema<User>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  friends: [
    {
      type: SchemaTypes.ObjectId,
      ref: 'User',
    },
  ],
  enemies: [
    {
      type: SchemaTypes.ObjectId,
      ref: 'User',
    },
  ],
});

userSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
    delete returnedObject.password;
  },
});

export const UserModel = model('User', userSchema, 'users');
