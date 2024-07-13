import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import { CreateUserDto } from './dto/CreateUser.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  //methods to interact with database
  createUser(createUserDto: CreateUserDto) {
    //Dto: Data Transfer Object
    const newUser = new this.userModel(createUserDto);
    return newUser.save(); //save user to db
  }

  getUser() {
    return this.userModel.find();
  }
}
