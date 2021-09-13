import { Module } from '@nestjs/common';
import { UserAdminController } from './userAdmin.controller';
import { UserAdminService } from './userAdmin.service';

@Module({
  controllers: [UserAdminController],
  providers: [UserAdminService],
})
export class UserAdminModule {}
