import { Module } from '@nestjs/common';
import { AgreementsService } from './agreements.service';
import { AgreementsController } from './agreements.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [AgreementsController],
  providers: [AgreementsService, PrismaService],
})
export class AgreementsModule {}

