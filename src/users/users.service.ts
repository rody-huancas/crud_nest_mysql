import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(user: CreateUserDto) {
    const userFound = await this.userRepository.findOne({
      where: { username: user.username }
    });

    if(userFound) return new HttpException('User already exists', HttpStatus.CONFLICT);

    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  getUsers() {
    return this.userRepository.find({})
  }

  async getUser(id: number) {
    const userFound = this.userRepository.findOne({
      where: { id }
    });
    
    if( !userFound ) return new HttpException('User not found', HttpStatus.NOT_FOUND);

    return userFound;
  }

  async deleteUser(id: number){
    const result = await this.userRepository.delete({ id });

    if( result.affected ) return new HttpException('User not found', HttpStatus.NOT_FOUND);

    return result;
  }

  updateUser(id: number, user: UpdateUserDto) {
    const userFound = this.userRepository.findOne({ where: { id } })
    if( !userFound ) return new HttpException('User not found', HttpStatus.NOT_FOUND);

    const updatedUser = Object.assign(userFound, user);
    return this.userRepository.save( updatedUser );
  }
}
