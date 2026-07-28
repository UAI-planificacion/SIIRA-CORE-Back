import { Test, TestingModule } from '@nestjs/testing';
import { ProcessConfigsService } from './process-configs.service';

describe('ProcessConfigsService', () => {
  let service: ProcessConfigsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProcessConfigsService],
    }).compile();

    service = module.get<ProcessConfigsService>(ProcessConfigsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
