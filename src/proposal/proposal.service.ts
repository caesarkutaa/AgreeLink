import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';

@Injectable()
export class ProposalService {
  constructor(private readonly prisma: PrismaService) {}

  async createProposal(dto: CreateProposalDto, userId: string) {
    try {
      console.log(userId)
      if (!userId) {
        throw new Error('User ID must be provided');
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
    

      return await this.prisma.proposal.create({
        data: {
          title: dto.title,
          description: dto.description,
          duration: dto.duration,
          paymentTerms: dto.paymentTerms,
          status: dto.status,
          client: { connect: { id: dto.client } },
          serviceProvider: { connect: { id: dto.serviceProvider } },
          createdBy: { connect: { id: userId } }
        }
      });
    } catch (error) {
      console.error(error);
      throw new Error('Unable to create proposal'); // Customize error handling as needed
    }
  }

  async getAllProposals(userId: string) {
    const proposals = await this.prisma.proposal.findMany({
      where: { createdById: userId }
    });

    const count = proposals.length;

    return { proposals, count };
  }

  async getProposalById(id: string) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id },
    });

    if (!proposal) {
      throw new NotFoundException(`Proposal with ID ${id} not found`);
    }

    return proposal;
  }

  async updateProposal(id: string, dto: UpdateProposalDto) {
    const proposal = await this.prisma.proposal.update({
      where: { id },
      data: dto,
    });

    return { message: `Proposal with ID ${id} has been updated`, proposal };
  }

  async deleteProposal(id: string): Promise<{ message: string }> {
    await this.prisma.proposal.delete({
      where: { id },
    });

    return { message: `Proposal with ID ${id} has been deleted` };
  }
}
