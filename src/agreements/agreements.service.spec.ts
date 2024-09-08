import { Test, TestingModule } from '@nestjs/testing';
import { AgreementsService } from './agreements.service';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from '@nestjs/common';
import { CreateAgreementDto, STATE } from './dto/create-agreement.dto';
import { UpdateAgreementDto } from './dto/update-agreement.dto';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';


describe('AgreementsService', () => {
  let service: AgreementsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgreementsService,
        {
          provide: PrismaService,
          useValue: {
            agreements: {
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

    service = module.get<AgreementsService>(AgreementsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAgreement', () => {
    it('should create a new agreement', async () => {
      const dto: CreateAgreementDto = {
        proposalId: 'proposal-123',
        clientId: 'client-123',
        serviceProviderId: 'service-provider-123',
        state: STATE.PENDING,
      };
      const createdAgreement = {
        id: 'agreement-123',
        ...dto,
        createdAt: new Date(),
        signedAt: null,
      };

      jest
        .spyOn(prisma.agreements, 'create')
        .mockResolvedValue(createdAgreement);

      const result = await service.createAgreement(dto);

      expect(result).toEqual(createdAgreement);
      expect(prisma.agreements.create).toHaveBeenCalledWith({
        data: {
          state: dto.state,
          proposal: { connect: { id: dto.proposalId } },
          client: { connect: { id: dto.clientId } },
          serviceProvider: { connect: { id: dto.serviceProviderId } },
        },
      });
    });

    it('should throw an InternalServerErrorException if creation fails', async () => {
      const dto: CreateAgreementDto = {
        proposalId: 'proposal-123',
        clientId: 'client-123',
        serviceProviderId: 'service-provider-123',
        state: STATE.PENDING,
      };

      jest
        .spyOn(prisma.agreements, 'create')
        .mockRejectedValue(new Error('Database error'));

      await expect(service.createAgreement(dto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getAllAgreements', () => {
    it('should return an array of agreements', async () => {
      const agreements = [
        {
          id: 'agreement-123',
          proposalId: 'proposal-123',
          clientId: 'client-123',
          serviceProviderId: 'service-provider-123',
          state: STATE.PENDING, // Use the STATE enum
          createdAt: new Date(),
          signedAt: null,
        },
      ];

      jest.spyOn(prisma.agreements, 'findMany').mockResolvedValue(agreements);

      const result = await service.getAllAgreements();

      expect(result).toEqual(agreements);
      expect(prisma.agreements.findMany).toHaveBeenCalled();
    });

    it('should throw an InternalServerErrorException if retrieval fails', async () => {
      jest
        .spyOn(prisma.agreements, 'findMany')
        .mockRejectedValue(new Error('Database error'));

      await expect(service.getAllAgreements()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getAgreementById', () => {
    it('should return a single agreement by id', async () => {
      const agreement = {
        id: 'agreement-123',
        proposalId: 'proposal-123',
        clientId: 'client-123',
        serviceProviderId: 'service-provider-123',
        state: STATE.PENDING, // Use the STATE enum
        createdAt: new Date(),
        signedAt: null,
      };

      jest.spyOn(prisma.agreements, 'findUnique').mockResolvedValue(agreement);

      const result = await service.getAgreementById('agreement-123');

      expect(result).toEqual(agreement);
      expect(prisma.agreements.findUnique).toHaveBeenCalledWith({
        where: { id: 'agreement-123' },
        include: {
          proposal: true,
          client: {
            select: {
              id: true,
              email: true,
              username: true,
            },
          },
          serviceProvider: {
            select: {
              id: true,
              email: true,
              username: true,
            },
          },
        },
      });
    });

    it('should throw a NotFoundException if agreement is not found', async () => {
      jest.spyOn(prisma.agreements, 'findUnique').mockResolvedValue(null);

      await expect(service.getAgreementById('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw an InternalServerErrorException if retrieval fails', async () => {
      jest
        .spyOn(prisma.agreements, 'findUnique')
        .mockRejectedValue(new Error('Database error'));

      await expect(service.getAgreementById('agreement-123')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('updateAgreement', () => {
    it('should update an agreement', async () => {
      const dto: UpdateAgreementDto = {
        proposalId: 'proposal-123',
        clientId: 'client-123',
        serviceProviderId: 'service-provider-123',

        state: STATE.ACTIVE // Use the STATE enum
        

      };
      const updatedAgreement = {
        id: 'agreement-123',
        ...dto,
        createdAt: new Date(),
        signedAt: null,
      };

      jest
        .spyOn(prisma.agreements, 'update')
        .mockResolvedValue(updatedAgreement);

      const result = await service.updateAgreement('agreement-123', dto);

      expect(result).toEqual(updatedAgreement);
      expect(prisma.agreements.update).toHaveBeenCalledWith({
        where: { id: 'agreement-123' },
        data: {
          state: dto.state,
          proposal: dto.proposalId
            ? { connect: { id: dto.proposalId } }
            : undefined,
          client: dto.clientId ? { connect: { id: dto.clientId } } : undefined,
          serviceProvider: dto.serviceProviderId
            ? { connect: { id: dto.serviceProviderId } }
            : undefined,
        },
      });
    });

    it('should throw an InternalServerErrorException if update fails', async () => {
      const dto: UpdateAgreementDto = {
        proposalId: 'proposal-123',
        clientId: 'client-123',
        serviceProviderId: 'service-provider-123',
        state: STATE.ACTIVE, // Use the STATE enum
      };

      jest
        .spyOn(prisma.agreements, 'update')
        .mockRejectedValue(new Error('Database error'));

      await expect(
        service.updateAgreement('agreement-123', dto),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('deleteAgreement', () => {
    it('should delete an agreement', async () => {
      const deletedAgreement = {
        id: 'agreement-123',
        proposalId: 'proposal-123',
        clientId: 'client-123',
        serviceProviderId: 'service-provider-123',
        state: STATE.PENDING, // Use the STATE enum
        createdAt: new Date(),
        signedAt: null,
      };

      jest
        .spyOn(prisma.agreements, 'delete')
        .mockResolvedValue(deletedAgreement);

      const result = await service.deleteAgreement('agreement-123');

      expect(result).toEqual({
        message: 'Agreement has been deleted successfully',
      });
      expect(prisma.agreements.delete).toHaveBeenCalledWith({
        where: { id: 'agreement-123' },
      });
    });

    it('should throw an InternalServerErrorException if deletion fails', async () => {
      jest
        .spyOn(prisma.agreements, 'delete')
        .mockRejectedValue(new Error('Database error'));

      await expect(service.deleteAgreement('agreement-123')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
