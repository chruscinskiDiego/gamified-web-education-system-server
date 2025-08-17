import { Test, TestingModule } from '@nestjs/testing';
import { UserXpService } from './user-xp.service';

describe('UserXpService', () => {
  let service: UserXpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserXpService],
    }).compile();

    service = module.get<UserXpService>(UserXpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
