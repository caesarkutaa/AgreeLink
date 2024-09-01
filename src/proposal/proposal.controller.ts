import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { GetUser } from '../auth/decorator';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import { JwtGuard } from '../auth/guard';

@Controller('proposals')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createProposal(
    @GetUser('id') userId: string,
    @Body(new ValidationPipe()) dto: CreateProposalDto,
  ) {
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
