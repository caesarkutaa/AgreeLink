import { Test, TestingModule } from '@nestjs/testing';
import { ProposalService } from './proposal.service';
import { PrismaService } from '../prisma/prisma.service';
import { Logger, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { STATUS } from './dto/create-proposal.dto';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

describe('ProposalService', () => {
  let service: ProposalService;
  let prismaService: PrismaService;
  let logger: Logger;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProposalService,
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
            proposal: {
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
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockToken'),
            verify: jest.fn().mockReturnValue({ userId: 'mockUserId' }),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mockValue'),
          },
        },
      ],
    }).compile();

    service = module.get<ProposalService>(ProposalService);
    prismaService = module.get<PrismaService>(PrismaService);
    authService = module.get<AuthService>(AuthService);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProposal', () => {
    it('should create a proposal successfully', async () => {
      
      const userId = 'created-by-id';
      
      const createProposalDto = {
        title: 'Test Proposal',
        description: 'Test Description',
        duration: 90,
        paymentTerms: 'Upon Completion',
        status: STATUS.PENDING,
        client: userId,
        serviceProvider: 'service-provider-id',
      };
    

      (prismaService.user.findUnique as jest.Mock) // For client
        .mockResolvedValue({ id: 'service-provider-id' }) // For service provider
        .mockResolvedValue({ id: 'created-by-id' });

      // Mock proposal creation
      const mockProposal = { id: 'proposal-id', ...createProposalDto };
      (prismaService.proposal.create as jest.Mock).mockResolvedValue(mockProposal);

      const result = await service.createProposal(createProposalDto, userId);

      expect(result).toEqual(mockProposal);
      expect(prismaService.proposal.create).toHaveBeenCalledWith({
        data: {
          ...createProposalDto,
          client: { connect: { id: userId } },
          serviceProvider: { connect: { id: createProposalDto.serviceProvider } },
          createdBy: { connect: { id: userId } },
        },
      });
    });

    // it('should throw NotFoundException if any of the users do not exist', async () => {
    //   const dto = {
    //     title: 'New Proposal',
    //     description: 'Proposal description',
    //     duration: 30,
    //     paymentTerms: 'Monthly',
    //     status: STATUS.PENDING,
    //     client: 'clientId',
    //     serviceProvider: 'serviceProviderId',
    //   };

    //   // Mock user retrieval to simulate client not existing
    //   (prismaService.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

    //   await expect(service.createProposal(dto, 'userId')).rejects.toThrow(NotFoundException);
    // });


    it('should log an error and throw HttpException on failure', async () => {
      const dto = {
        title: 'New Proposal',
        description: 'Proposal description',
        duration: 30,
        paymentTerms: 'Monthly',
        status: STATUS.PENDING,
        client: 'clientId',
        serviceProvider: 'serviceProviderId',
      };
      (prismaService.user.findUnique as jest.Mock).mockResolvedValueOnce({ id: 'userId' });
      (prismaService.proposal.create as jest.Mock).mockRejectedValueOnce(new Error('Error'));

      await expect(service.createProposal(dto, 'userId')).rejects.toThrow(HttpException);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('getAllProposals', () => {
    it('should return all proposals for a user', async () => {
      const userId = 'userId';
      const proposals = [{ id: '1' }, { id: '2' }];

      // Mock proposal retrieval
      (prismaService.proposal.findMany as jest.Mock).mockResolvedValueOnce(proposals);

      const result = await service.getAllProposals(userId);

      expect(result).toEqual({ proposals, count: proposals.length });
      expect(prismaService.proposal.findMany).toHaveBeenCalledWith({ where: { createdById: userId } });
    });



    // it('should throw NotFoundException if no proposals are found', async () => {
    //   (prismaService.proposal.findMany as jest.Mock).mockResolvedValueOnce([]);

    //   await expect(service.getAllProposals('userId')).rejects.toThrow(NotFoundException);
    // });

    it('should log an error and throw HttpException on failure', async () => {
      (prismaService.proposal.findMany as jest.Mock).mockRejectedValueOnce(new Error('Error'));

      await expect(service.getAllProposals('userId')).rejects.toThrow(HttpException);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('getProposalById', () => {
    it('should return a proposal by ID', async () => {
      const id = 'proposalId';
      const proposal = { id, title: 'Proposal' };

      (prismaService.proposal.findUnique as jest.Mock).mockResolvedValueOnce(proposal);

      const result = await service.getProposalById(id);

      expect(result).toEqual(proposal);
      expect(prismaService.proposal.findUnique).toHaveBeenCalledWith({ where: { id } });
    });

    // it('should throw NotFoundException if proposal not found', async () => {
    //   (prismaService.proposal.findUnique as jest.Mock).mockResolvedValueOnce(null);

    //   await expect(service.getProposalById('proposalId')).rejects.toThrow(NotFoundException);
    // });

    it('should log an error and throw HttpException on failure', async () => {
      (prismaService.proposal.findUnique as jest.Mock).mockRejectedValueOnce(new Error('Error'));

      await expect(service.getProposalById('proposalId')).rejects.toThrow(HttpException);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('updateProposal', () => {
    it('should update a proposal successfully', async () => {
      const id = 'proposalId';
      const dto = { title: 'Updated Title' };
      const updatedProposal = { id, ...dto };

      (prismaService.proposal.update as jest.Mock).mockResolvedValueOnce(updatedProposal);

      const result = await service.updateProposal(id, dto);

      expect(result).toEqual({ message: `Proposal with ID ${id} has been updated`, proposal: updatedProposal });
      expect(prismaService.proposal.update).toHaveBeenCalledWith({ where: { id }, data: dto });
    });


    // it('should log an error and throw HttpException on failure', async () => {
    //   (prismaService.proposal.update as jest.Mock).mockRejectedValueOnce(new Error('Error'));

    //   await expect(service.updateProposal('proposalId', {})).rejects.toThrow(HttpException);
    //   expect(logger.error).toHaveBeenCalled();
    // });
  });

  describe('deleteProposal', () => {
    it('should delete a proposal successfully', async () => {
      const id = 'proposalId';

      (prismaService.proposal.delete as jest.Mock).mockResolvedValueOnce({ id });

      const result = await service.deleteProposal(id);

      expect(result).toEqual({ message: `Proposal with ID ${id} has been deleted` });
      expect(prismaService.proposal.delete).toHaveBeenCalledWith({ where: { id } });
    });

    // it('should log an error and throw HttpException on failure', async () => {
    //   (prismaService.proposal.delete as jest.Mock).mockRejectedValueOnce(new Error('Error'));

    //   await expect(service.deleteProposal('proposalId')).rejects.toThrow(HttpException);
    //   expect(logger.error).toHaveBeenCalled();
    // });
  });
});
