import { Test, TestingModule } from '@nestjs/testing';
import { AgreementsController } from './agreements.controller';
import { AgreementsService } from './agreements.service';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from '@nestjs/common';

describe('AgreementsController', () => {
  let controller: AgreementsController;
  let service: AgreementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgreementsController],
      providers: [
        AgreementsService,
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            register: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
            agreement: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AgreementsController>(AgreementsController);
    service = module.get<AgreementsService>(AgreementsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
