import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { AgreementsService } from './agreements.service';
import { Agreements } from '@prisma/client';
import { CreateAgreementDto } from './dto/create-agreement.dto';
import { UpdateAgreementDto } from './dto/update-agreement.dto';

@Controller('agreements')
export class AgreementsController {
  constructor(private readonly agreementsService: AgreementsService) {}

  @Post()
  async createAgreement(@Body() data: CreateAgreementDto): Promise<Agreements> {
    return this.agreementsService.createAgreement(data);
  }

  @Get()
  async getAllAgreements(): Promise<Agreements[]> {
    return this.agreementsService.getAllAgreements();
  }

  @Get(':id')
  async getAgreementById(@Param('id') id: string): Promise<Agreements> {
    return this.agreementsService.getAgreementById(id);
  }

  @Patch(':id')
  async updateAgreement(@Param('id') id: string, @Body() data: UpdateAgreementDto): Promise<Agreements> {
    return this.agreementsService.updateAgreement(id, data);
  }

  @Delete(':id')
  async deleteAgreement(@Param('id') id: string): Promise<{ message: string }> {
    return this.agreementsService.deleteAgreement(id);
  }
}

