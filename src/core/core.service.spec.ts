import { Test, TestingModule } from '@nestjs/testing';
import { EmailCoreService } from './emails.core.service';

describe('CoreService', () => {
  let service: EmailCoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailCoreService],
    }).compile();

    service = module.get<EmailCoreService>(EmailCoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
