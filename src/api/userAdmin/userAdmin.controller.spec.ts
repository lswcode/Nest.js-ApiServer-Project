import { Test, TestingModule } from '@nestjs/testing';
import { UserAdminController } from './userAdmin.controller';

describe('UserAdminController', () => {
  let controller: UserAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserAdminController],
    }).compile();

    controller = module.get<UserAdminController>(UserAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
