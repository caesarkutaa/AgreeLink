import { Controller, Get, Post, Body, Param, Patch, Delete, Logger } from '@nestjs/common';
import { AgreementsService } from './agreements.service';
import { Prisma, Agreements, STATE } from '@prisma/client';
import { CreateAgreementDto } from './dto/create-agreement.dto';
import { UpdateAgreementDto } from './dto/update-agreement.dto';

@Controller('agreements')
export class AgreementsController {
  private readonly logger = new Logger(AgreementsController.name);

  constructor(private readonly agreementsService: AgreementsService) {}

  @Post()
  async createAgreement(@Body() data: CreateAgreementDto): Promise<Agreements> {
    this.logger.log('Received request to create a new agreement');
    return this.agreementsService.createAgreement(data);
  }

  @Get()
  async getAllAgreements(): Promise<Agreements[]> {
    this.logger.log('Received request to fetch all agreements');
    return this.agreementsService.getAllAgreements();
  }

  @Get(':id')
  async getAgreementById(@Param('id') id: string): Promise<Agreements> {
    this.logger.log(`Received request to fetch agreement with ID ${id}`);
    return this.agreementsService.getAgreementById(id);
  }

  @Patch(':id')
  async updateAgreement(@Param('id') id: string, @Body() data: UpdateAgreementDto): Promise<Agreements> {
    this.logger.log(`Received request to update agreement with ID ${id}`);
    return this.agreementsService.updateAgreement(id, data);
  }

  @Delete(':id')
  async deleteAgreement(@Param('id') id: string): Promise<{ message: string }> {
    this.logger.log(`Received request to delete agreement with ID ${id}`);
    return this.agreementsService.deleteAgreement(id);
  }
}


