-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'SHELTER');

-- CreateEnum
CREATE TYPE "AnimalStatus" AS ENUM ('AVAILABLE', 'PENDING', 'ADOPTED');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "phone" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shelter" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "foundationDate" TIMESTAMP(3),
    "workingHours" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shelter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShelterImage" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "shelterId" TEXT NOT NULL,

    CONSTRAINT "ShelterImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Animal" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "breed" TEXT,
    "healthStatus" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "AnimalStatus" NOT NULL DEFAULT 'AVAILABLE',
    "shelterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Animal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnimalImage" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "animalId" TEXT NOT NULL,

    CONSTRAINT "AnimalImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdoptionApplication" (
    "id" TEXT NOT NULL,
    "message" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "userId" TEXT NOT NULL,
    "animalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdoptionApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "ShelterImage" ADD CONSTRAINT "ShelterImage_shelterId_fkey" FOREIGN KEY ("shelterId") REFERENCES "Shelter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Animal" ADD CONSTRAINT "Animal_shelterId_fkey" FOREIGN KEY ("shelterId") REFERENCES "Shelter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimalImage" ADD CONSTRAINT "AnimalImage_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdoptionApplication" ADD CONSTRAINT "AdoptionApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdoptionApplication" ADD CONSTRAINT "AdoptionApplication_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
