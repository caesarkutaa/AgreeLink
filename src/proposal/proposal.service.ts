import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';

@Injectable()
export class ProposalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: Logger,
  ) {}

  async createProposal(dto: CreateProposalDto, userId: string) {
    this.logger.log(`Attempt To Create A Proposal: ${userId}`);
    try {
      if (!userId) {
        this.logger.warn(`User not found for email: ${userId}`);
        throw new NotFoundException('User not found');
      }

      const clientExists = await this.prisma.user.findUnique({
        where: { id: dto.client },
      });

      const serviceProviderExists = await this.prisma.user.findUnique({
        where: { id: dto.serviceProvider },
      });

      const createdByExists = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!clientExists || !serviceProviderExists || !createdByExists) {
        throw new Error('One or more users not found');
      }

      this.logger.log(`User Proposal created successfully - ID:${userId}`);
      return await this.prisma.proposal.create({
        data: {
          title: dto.title,
          description: dto.description,
          duration: dto.duration,
          paymentTerms: dto.paymentTerms,
          status: dto.status,
          client: { connect: { id: dto.client } },
          serviceProvider: { connect: { id: dto.serviceProvider } },
          createdBy: { connect: { id: userId } },
        },
      });
    } catch (error) {
      this.logger.error(`Proposal error - userid: ${userId}`, error.stack);
      throw new HttpException(
        'Error creating Proposal',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllProposals(userId: string) {
    this.logger.log(`Attempt To fetch All User Proposal: ${userId}`);
    try {
      if (!userId) {
        this.logger.warn(`User not found for email: ${userId}`);
        throw new NotFoundException('User not found');
      }

      const proposals = await this.prisma.proposal.findMany({
        where: { createdById: userId },
      });
      if (!proposals) {
        this.logger.warn(`Proposals not found`);
        throw new NotFoundException(`Proposals not found`);
      }

      const count = proposals.length;
      this.logger.log(
        `Attempt To fetch All User Proposal Sucessfull: ${userId}`,
      );

      return { proposals, count };
    } catch (error) {
      this.logger.error(`Proposal error - userid: ${userId}`, error.stack);
      throw new HttpException(
        'Error Fetching Proposal',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProposalById(id: string) {
    this.logger.log(`Attempt To fetch  Proposal: ${id}`);
    try {
      const proposal = await this.prisma.proposal.findUnique({
        where: { id },
      });

      if (!proposal) {
        this.logger.warn(`Proposal with ID ${id} not found`);
        throw new NotFoundException(`Proposal with ID ${id} not found`);
      }
      this.logger.log(`Attempt To fetch  Proposal Sucessfull: ${id}`);
      return proposal;
    } catch (error) {
      this.logger.error(`Proposal error - id: ${id}`, error.stack);
      throw new HttpException(
        'Error Fetching Proposal',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateProposal(id: string, dto: UpdateProposalDto) {
    this.logger.log(`Attempt To update  Proposal: ${id}`);
    try {
      if (!id) {
        this.logger.warn(`ID ${id} not found`);
        throw new NotFoundException(`ID ${id} not found`);
      }
      const proposal = await this.prisma.proposal.update({
        where: { id },
        data: dto,
      });

      if (!proposal) {
        this.logger.warn(`Proposal with ID ${id} not updated`);
        throw new HttpException(
          'Error updating Proposal',
          HttpStatus.BAD_REQUEST,
        );
      }
      this.logger.log(`Attempt To update Proposal Sucessfull: ${id}`);
      return { message: `Proposal with ID ${id} has been updated`, proposal };
    } catch (error) {
      this.logger.error(`Proposal error - userid: ${id}`, error.stack);
      throw new HttpException(
        'Error Fetching Proposal',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteProposal(id: string) {
    this.logger.log(`Attempt To delete  Proposal: ${id}`);
    try {
      if (!id) {
        this.logger.warn(`ID ${id} not found`);
        throw new NotFoundException(`ID ${id} not found`);
      }

      await this.prisma.proposal.delete({
        where: { id },
      });
      this.logger.log(`Attempt To delete Proposal Sucessfull: ${id}`);
      return { message: `Proposal with ID ${id} has been deleted` };
    } catch (error) {}
  }
}
