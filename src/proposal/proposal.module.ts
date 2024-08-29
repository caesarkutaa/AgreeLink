import { Module } from '@nestjs/common';
import { ProposalController } from './proposal.controller';
import { ProposalService } from './proposal.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ProposalController],
  providers: [ProposalService,PrismaService]
})
export class ProposalModule {}
