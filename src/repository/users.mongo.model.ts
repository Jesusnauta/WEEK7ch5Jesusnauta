import { model, Schema } from 'mongoose';
import { UserStructure } from '../entities/user.js';

const userSchema = new Schema<UserStructure>({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  userName: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],

  enemies: [
    {
      type: Schema.Types.ObjectId,
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
