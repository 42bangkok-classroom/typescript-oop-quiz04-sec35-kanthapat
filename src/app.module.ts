import { Module } from '@nestjs/common';
import { UserController } from 'src/user/user.controller'
import { UserService } from 'src/user/user.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
