import { Controller, Get, Post, Body, Param, Patch, Delete, ValidationPipe, UseGuards, UseFilters, Logger } from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { GetUser } from '../auth/decorator';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import { JwtGuard } from '../auth/guard';
import { GlobalExceptionFilter } from '../exceptions/global-exceptions.filters';

@Controller('proposals')
@UseGuards(JwtGuard)
@UseFilters(GlobalExceptionFilter)
export class ProposalController {
  private readonly logger = new Logger(ProposalController.name);

  constructor(private readonly proposalService: ProposalService) {}

  @Post()
  async createProposal(
    @GetUser('id') userId: string,
    @Body(new ValidationPipe()) dto: CreateProposalDto,
  ) {
    this.logger.log(`Received request to create proposal by user: ${userId}`);
    return this.proposalService.createProposal(dto, userId);
  }

  @Get()
  async getAllProposals(@GetUser('id') userId: string) {
    return this.proposalService.getAllProposals(userId);
  }

  @Get(':id')
  async getProposalById(@Param('id') id: string) {
    return this.proposalService.getProposalById(id);
  }

  @Patch(':id')
  async updateProposal(
    @Param('id') id: string,
    @Body() dto: UpdateProposalDto,
  ) {
    return this.proposalService.updateProposal(id, dto);
  }

  @Delete(':id')
  async deleteProposal(@Param('id') id: string): Promise<{ message: string }> {
    return this.proposalService.deleteProposal(id);
  }
}
