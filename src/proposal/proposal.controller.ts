import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { Proposal, STATUS } from '@prisma/client';

@Controller('proposals')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @Post()
  async createProposal(
    @Body() data: { clientId: string; serviceProviderId: string; status: STATUS; title: string; description: string; duration: number; paymentTerms: string }
  ): Promise<Proposal> {
    const { clientId, serviceProviderId, status, ...otherData } = data;

    return this.proposalService.createProposal({
      ...otherData,
      status,
      clientId,
      serviceProviderId,
    });
  }

  @Get()
  async getAllProposals(): Promise<{ proposals: Proposal[]; count: number }> {
    return this.proposalService.getAllProposals();
  }

  @Get(':id')
  async getProposalById(@Param('id') id: string): Promise<Proposal> {
    return this.proposalService.getProposalById(id);
  }

  @Patch(':id')
  async updateProposal(
    @Param('id') id: string,
    @Body() data: Partial<Omit<Proposal, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<{ message: string; proposal: Proposal }> {
    const { status, ...otherData } = data;
    return this.proposalService.updateProposal(id, {
      ...otherData,
      status: status as STATUS, // Use STATUS enum directly
    });
  }

  @Delete(':id')
  async deleteProposal(@Param('id') id: string): Promise<{ message: string }> {
    return this.proposalService.deleteProposal(id);
  }
}








