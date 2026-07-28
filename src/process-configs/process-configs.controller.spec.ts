import { Test, TestingModule } from '@nestjs/testing';
import { ProcessConfigsController } from './process-configs.controller';
import { ProcessConfigsService } from './process-configs.service';

describe('ProcessConfigsController', () => {
  let controller: ProcessConfigsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProcessConfigsController],
      providers: [ProcessConfigsService],
    }).compile();

    controller = module.get<ProcessConfigsController>(ProcessConfigsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
