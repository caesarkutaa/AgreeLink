import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Proposal } from '@prisma/client';

@Injectable()
export class ProposalService {
  constructor(private readonly prisma: PrismaService) {}

  async createProposal(
    data: Omit<Prisma.ProposalCreateInput, 'client' | 'serviceProvider'> & { clientId: string; serviceProviderId: string }
  ): Promise<Proposal> {
    const { clientId, serviceProviderId, ...otherData } = data;

    if (!clientId || !serviceProviderId) {
      throw new Error('Both clientId and serviceProviderId must be provided');
    }

    return this.prisma.proposal.create({
      data: {
        ...otherData,
        client: {
          connect: { id: clientId },
        },
        serviceProvider: {
          connect: { id: serviceProviderId },
        },
      },
      include: {
        client: {
          select: {
            id: true,
            email: true,
            password: false, // Exclude password
            username: true,
          },
        },
        serviceProvider: {
          select: {
            id: true,
            email: true,
            password: false, // Exclude password
            username: true,
          },
        },
      },
    });
  }

  async getAllProposals(): Promise<{ proposals: Proposal[]; count: number }> {
    const proposals = await this.prisma.proposal.findMany({
      include: {
        client: {
          select: {
            id: true,
            email: true,
            password: false, // Exclude password
          },
        },
        serviceProvider: {
          select: {
            id: true,
            email: true,
            password: false, // Exclude password
            username: true,
          },
        },
      },
    });

    const count = proposals.length;

    return { proposals, count };
  }

  async getProposalById(id: string): Promise<Proposal> {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            email: true,
            password: false, // Exclude password
            username: true,
          },
        },
        serviceProvider: {
          select: {
            id: true,
            email: true,
            password: false, // Exclude password
            username: true,
          },
        },
      },
    });

    if (!proposal) {
      throw new NotFoundException(`Proposal with ID ${id} not found`);
    }

    return proposal;
  }

  async updateProposal(id: string, data: Prisma.ProposalUpdateInput): Promise<{ message: string; proposal: Proposal }> {
    const proposal = await this.prisma.proposal.update({
      where: { id },
      data,
      include: {
        client: {
          select: {
            id: true,
            email: true,
            password: false, // Exclude password
            username: true,
          },
        },
        serviceProvider: {
          select: {
            id: true,
            email: true,
            password: false, // Exclude password
            username: true,
          },
        },
      },
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
