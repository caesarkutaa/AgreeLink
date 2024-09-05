import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Agreements, STATE } from '@prisma/client';
import { CreateAgreementDto } from './dto/create-agreement.dto';
import { UpdateAgreementDto } from './dto/update-agreement.dto';
import { Logger } from '@nestjs/common';

@Injectable()
export class AgreementsService {
  private readonly logger = new Logger(AgreementsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createAgreement(data: CreateAgreementDto): Promise<Agreements> {
    try {
      this.logger.log(`Creating agreement for proposal ${data.proposalId}`);
      const agreement = await this.prisma.agreements.create({
        data: {   
          state: data.state,   
          proposal: { connect: { id: data.proposalId } },
          client: { connect: { id: data.clientId } },
          serviceProvider: { connect: { id: data.serviceProviderId } },
        },
      });
      this.logger.log(`Agreement created successfully with ID ${agreement.id}`);
      return agreement;
    } catch (error) {
      this.logger.error('Failed to create agreement', error.stack);
      throw new InternalServerErrorException('Failed to create agreement');
    }
  }   

  async getAllAgreements(): Promise<Agreements[]> {
    try {
      this.logger.log('Fetching all agreements');
      const agreements = await this.prisma.agreements.findMany({
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
      this.logger.log(`Fetched ${agreements.length} agreements`);
      return agreements;
    } catch (error) {
      this.logger.error('Failed to fetch agreements', error.stack);
      throw new InternalServerErrorException('Failed to fetch agreements');
    }
  }

  async getAgreementById(id: string): Promise<Agreements> {
    try {
      this.logger.log(`Fetching agreement with ID ${id}`);
      const agreement = await this.prisma.agreements.findUnique({
        where: { id },
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

      if (!agreement) {
        this.logger.warn(`Agreement with ID ${id} not found`);
        throw new NotFoundException(`Agreement with ID ${id} not found`);
      }

      this.logger.log(`Fetched agreement with ID ${id}`);
      return agreement;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to fetch agreement with ID ${id}`, error.stack);
      throw new InternalServerErrorException(`Failed to fetch agreement with ID ${id}`);
    }
  }

  async updateAgreement(id: string, data: UpdateAgreementDto): Promise<Agreements> {
    try {
      this.logger.log(`Updating agreement with ID ${id}`);
      const agreement = await this.prisma.agreements.update({
        where: { id },
        data: {
          state: data.state,
          proposal: data.proposalId ? { connect: { id: data.proposalId } } : undefined,
          client: data.clientId ? { connect: { id: data.clientId } } : undefined,
          serviceProvider: data.serviceProviderId ? { connect: { id: data.serviceProviderId } } : undefined,
        },
      });
      this.logger.log(`Agreement with ID ${id} updated successfully`);
      return agreement;
    } catch (error) {
      this.logger.error(`Failed to update agreement with ID ${id}`, error.stack);
      throw new InternalServerErrorException(`Failed to update agreement with ID ${id}`);
    }
  }

  async deleteAgreement(id: string): Promise<{ message: string }> {
    try {
      this.logger.log(`Deleting agreement with ID ${id}`);
      await this.prisma.agreements.delete({
        where: { id },
      });
      this.logger.log(`Agreement with ID ${id} deleted successfully`);
      return { message: 'Agreement has been deleted successfully' };
    } catch (error) {
      this.logger.error(`Failed to delete agreement with ID ${id}`, error.stack);
      throw new InternalServerErrorException(`Failed to delete agreement with ID ${id}`);
    }
  }
}



