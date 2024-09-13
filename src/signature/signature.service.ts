import {
  Injectable,
  // Logger,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSignatureDto } from './dto/create-signatureDto';
import { UpdateSignatureDto } from './dto/update-signatureDto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SignatureService {
  // private readonly logger = new Logger(SignatureService.name);

  constructor(private prisma: PrismaService) {}

  async createSignature(
    createSignatureDto: CreateSignatureDto,
    agreementId: string,
    userId: string,
  ) {
    try {
      // this.logger.log('Creating new signature...');

      // Step 1: Check if the agreement exists
      //  this.logger.log(`Checking for agreement with ID: ${agreementId}`);
      const agreement = await this.prisma.agreements.findUnique({
        where: { id: agreementId },
      });

      if (!agreement) {
        //  this.logger.error(`Agreement with ID: ${agreementId} not found`);
        throw new NotFoundException('Agreement not found');
      }

      // Step 2: Check if the user already signed this agreement
      const existingSignature = await this.prisma.signature.findFirst({
        where: {
          agreementId,
          userId,
        },
      });

      if (existingSignature) {
        //  this.logger.warn(
        //   `Signature already exists for agreement ID: ${agreementId} and user ID: ${userId}`,
        // );
        throw new ConflictException(
          'Signature already exists for this agreement',
        );
      }

      // Step 3: Extract the Base64-encoded signature from the DTO
      const { signature } = createSignatureDto;

      // Optional: Validate Base64 signature format (basic check)
      const base64Regex = /^data:image\/png;base64,/;
      if (!base64Regex.test(signature)) {
        //  this.logger.error('Invalid Base64 signature format');
        throw new InternalServerErrorException(
          'Invalid Base64 signature format',
        );
      }

      // Step 4: Save the Base64 signature as an image file
      const uploadDir = path.join(__dirname, '../../uploads/signatures');
      const fileName = `signature_${userId}_${Date.now()}.png`;
      const filePath = path.join(uploadDir, fileName);

      // Ensure the directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Write the image file
      try {
        fs.writeFileSync(
          filePath,
          signature.replace(base64Regex, ''),
          'base64',
        );
        // this.logger.log(`Signature image saved at: ${filePath}`);
      } catch (err) {
        // this.logger.error('Error saving signature image', err.stack);
        throw new InternalServerErrorException('Error saving signature image');
      }

      // Step 5: Save the signature details in the database
      const newSignature = await this.prisma.signature.create({
        data: {
          ...createSignatureDto,
          signedAt: new Date(),
          imagePath: filePath, // Store the image path in the DB
          agreementId,
          userId,
        },
      });

      // this.logger.log(
      //   `Signature created successfully with ID: ${newSignature.id}`,
      // );
      return newSignature;
    } catch (error) {
      // this.logger.error('Error creating signature', error.stack);
      throw new InternalServerErrorException('Error creating signature');
    }
  }

  async getAllSignatures() {
    try {
      //   this.logger.log('Fetching all signatures...');
      return await this.prisma.signature.findMany();
    } catch (error) {
      //  this.logger.error('Error fetching signatures', error.stack);
      throw new InternalServerErrorException('Error fetching signatures');
    }
  }

  async getSignatureById(id: string) {
    try {
      //  this.logger.log(`Fetching signature with ID: ${id}`);
      const signature = await this.prisma.signature.findUnique({
        where: { id },
      });

      if (!signature) {
        //  this.logger.warn(`Signature with ID: ${id} not found`);
        throw new NotFoundException('Signature not found');
      }

      return signature;
    } catch (error) {
      //  this.logger.error('Error fetching signature', error.stack);
      throw new InternalServerErrorException('Error fetching signature');
    }
  }

  async updateSignature(id: string, updateSignatureDto: UpdateSignatureDto) {
    try {
      // this.logger.log(`Updating signature with ID: ${id}`);

      // Optional: Fetch the existing signature to manage file cleanup
      const existingSignature = await this.prisma.signature.findUnique({
        where: { id },
      });

      if (!existingSignature) {
        throw new NotFoundException('Signature not found');
      }

      const updatedSignature = await this.prisma.signature.update({
        where: { id },
        data: { ...updateSignatureDto },
      });

      // Optional: Clean up old signature file if necessary

      // this.logger.log(`Signature updated successfully with ID: ${id}`);
      return updatedSignature;
    } catch (error) {
      //  this.logger.error(`Error updating signature with ID: ${id}`, error.stack);
      throw new InternalServerErrorException('Error updating signature');
    }
  }

  async deleteSignature(id: string) {
    try {
      //  this.logger.log(`Deleting signature with ID: ${id}`);

      // Fetch the existing signature to remove the associated file
      const signature = await this.prisma.signature.findUnique({
        where: { id },
      });

      if (!signature) {
        throw new NotFoundException('Signature not found');
      }

      // Delete the image file associated with the signature
      if (fs.existsSync(signature.imagePath)) {
        fs.unlinkSync(signature.imagePath);
        //  this.logger.log(`Signature image deleted: ${signature.imagePath}`);
      }

      // Delete the signature from the database
      await this.prisma.signature.delete({
        where: { id },
      });

      //  this.logger.log(`Signature deleted successfully with ID: ${id}`);
      return { message: 'Signature deleted successfully' };
    } catch (error) {
      // this.logger.error(`Error deleting signature with ID: ${id}`, error.stack);
      throw new InternalServerErrorException('Error deleting signature');
    }
  }
}
