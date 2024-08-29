import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Agreements } from '@prisma/client';
import { CreateAgreementDto } from './dto/create-agreement.dto';
import { UpdateAgreementDto } from './dto/update-agreement.dto';

@Injectable()
export class AgreementsService {
  constructor(private readonly prisma: PrismaService) {}
  async createAgreement(data: CreateAgreementDto): Promise<Agreements> {
    return this.prisma.agreements.create({
      data: {
        state: data.state, 
        proposal: { connect: { id: data.proposalId } },
        client: { connect: { id: data.clientId } },
        serviceProvider: { connect: { id: data.serviceProviderId } },
      },
    });
  }
  

  async getAllAgreements(): Promise<Agreements[]> {
    return this.prisma.agreements.findMany({
      include: {
        proposal: true,
        client:{
          select: {
            id: true,
            email: true,
            password: false, // Exclude password
            username: true,
          },
        },
        serviceProvider:  {
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

  async getAgreementById(id: string): Promise<Agreements> {
    const agreement = await this.prisma.agreements.findUnique({
      where: { id },
      include: {
        proposal: true,
        client:  {
          select: {
            id: true,
            email: true,
            password: false, // Exclude password
            username: true,
          },
        },
        serviceProvider:  {
          select: {
            id: true,
            email: true,
            password: false, // Exclude password
            username: true,
          },
        },
      },
    });

    if (!agreement) {
      throw new NotFoundException(`Agreement with ID ${id} not found`);
    }

    return agreement;
  }

  async updateAgreement(id: string, data: UpdateAgreementDto): Promise<Agreements> {
    return this.prisma.agreements.update({
      where: { id },
      data: {
        state: data.state, // Other agreement data fields
        proposal: data.proposalId ? { connect: { id: data.proposalId } } : undefined,
        client: data.clientId ? { connect: { id: data.clientId } } : undefined,
        serviceProvider: data.serviceProviderId ? { connect: { id: data.serviceProviderId } } : undefined,
      },
    });
  }

  async deleteAgreement(id: string): Promise<{ message: string }> {
    await this.prisma.agreements.delete({
      where: { id },
    });

    return { message: 'Agreement has been deleted successfully' };
  }
}


