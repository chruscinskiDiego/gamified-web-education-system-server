import { Test, TestingModule } from '@nestjs/testing';
import { UserXpController } from './user-xp.controller';
import { UserXpService } from './user-xp.service';

describe('UserXpController', () => {
  let controller: UserXpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserXpController],
      providers: [UserXpService],
    }).compile();

    controller = module.get<UserXpController>(UserXpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
