import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

import { IUser } from './user.interface';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  test(): string[] {
    return [];
  }

  findAll(): IUser[] {
    const filePath = path.join(process.cwd(), 'data', 'users.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const users = JSON.parse(fileContent) as unknown as IUser[];

    return users;
  }

  findOne(id: string, fields?: string[]): Partial<IUser> {
    const users = this.findAll();
    let user: IUser | null = null;
    for (let i = 0; i < users.length; i++) {
      if (users[i].id === id) {
        user = users[i];
        break;
      }
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (fields === undefined) {
      return user;
    }

    const filterUser: Partial<IUser> = {};

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];

      if (user[field as keyof IUser] !== undefined) {
        filterUser[field as keyof IUser] = user[field as keyof IUser];
      }
    }

    return filterUser;
  }

  create(dto: CreateUserDto): IUser {
    const users: IUser[] = this.findAll();

    let maxId = 0;
    for (let i = 0; i < users.length; i++) {
      const currentId = parseInt(users[i].id);

      if (currentId > maxId) {
        maxId = currentId;
      }
    }

    const newId = (maxId + 1).toString();
    const newUser: IUser = {
      id: newId,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      username: dto.username,
    };

    users.push(newUser);
    const filePath = path.join(process.cwd(), 'data', 'users.json');
    const jsonText = JSON.stringify(users, null, 2);
    fs.writeFileSync(filePath, jsonText, 'utf-8');

    return newUser;
  }
}
