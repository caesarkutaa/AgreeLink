-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('PENDING', 'ACSEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "STATE" AS ENUM ('PENDING', 'ACTIVE', 'COMPLETED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "paymentTerms" TEXT NOT NULL,
    "status" "STATUS" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL,
    "serviceProviderId" TEXT NOT NULL,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agreements" (
    "id" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "serviceProviderId" TEXT NOT NULL,
    "state" "STATE" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "signedAt" TIMESTAMP(3),

    CONSTRAINT "Agreements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Signature" (
    "id" TEXT NOT NULL,
    "agreementId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "signedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Signature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "agreementId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_serviceProviderId_fkey" FOREIGN KEY ("serviceProviderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agreements" ADD CONSTRAINT "Agreements_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agreements" ADD CONSTRAINT "Agreements_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agreements" ADD CONSTRAINT "Agreements_serviceProviderId_fkey" FOREIGN KEY ("serviceProviderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signature" ADD CONSTRAINT "Signature_agreementId_fkey" FOREIGN KEY ("agreementId") REFERENCES "Agreements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signature" ADD CONSTRAINT "Signature_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_agreementId_fkey" FOREIGN KEY ("agreementId") REFERENCES "Agreements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
