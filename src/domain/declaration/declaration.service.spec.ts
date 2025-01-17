import { TestingModule } from '@nestjs/testing';
import { DeclarationService } from './declaration.service';
import { createDeclarationTestingModule } from './testConfig/declaration.test.config';

describe('DeclarationService', () => {
  let service: DeclarationService;

  beforeEach(async () => {
    const module: TestingModule = await createDeclarationTestingModule();

    service = module.get<DeclarationService>(DeclarationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
