import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProposalModule } from './proposal/proposal.module';
import { AgreementsModule } from './agreements/agreements.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // This makes the ConfigModule global
    }),
    AuthModule,
    ProposalModule,
    AgreementsModule, // Add AgreementsModule as it was missing in the "main" branch
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

