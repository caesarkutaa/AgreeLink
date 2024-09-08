import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Put,
  Logger,
  Req,
  Param,
} from '@nestjs/common';
import { SignatureService } from './signature.service';
import { CreateSignatureDto } from './dto/create-signatureDto';
import { UpdateSignatureDto } from './dto/update-signatureDto';

@Controller('signatures')
export class SignatureController {
  private readonly logger = new Logger(SignatureController.name);

  constructor(private readonly signatureService: SignatureService) {}

  @Post()
  async createSignature(@Body() createSignatureDto: CreateSignatureDto) {
    const { userId, agreementId } = createSignatureDto;

    this.logger.log(
      `Creating signature with agreement ID: ${agreementId} and user ID: ${userId}`,
    );
    return this.signatureService.createSignature(
      createSignatureDto,
      agreementId,
      userId,
    );
  }

  @Get()
  async getAllSignatures() {
    this.logger.log('Fetching all signatures via GET request');
    return this.signatureService.getAllSignatures();
  }

  @Get(':id')
  async getSignatureById(@Param('id') id: string) {
    this.logger.log(`Fetching signature by ID: ${id} via GET request`);
    return this.signatureService.getSignatureById(id);
  }

  @Put(':id')
  async updateSignature(
    @Param('id') id: string,
    @Body() updateSignatureDto: UpdateSignatureDto,
  ) {
    this.logger.log(`Updating signature with ID: ${id} via PUT request`);
    return this.signatureService.updateSignature(id, updateSignatureDto);
  }

  @Delete(':id')
  async deleteSignature(@Param('id') id: string) {
    this.logger.log(`Deleting signature with ID: ${id} via DELETE request`);
    return this.signatureService.deleteSignature(id);
  }
}
