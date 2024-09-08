import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProposalModule } from './proposal/proposal.module';
import { AgreementsModule } from './agreements/agreements.module';
import { SignatureModule } from './signature/signature.module';

@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true, 
  }),     
  AuthModule,     
  ProposalModule,     
  AgreementsModule,
  SignatureModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
