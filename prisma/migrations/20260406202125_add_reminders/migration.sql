-- CreateEnum
CREATE TYPE "ReminderStatus" AS ENUM ('PENDING', 'DONE');

-- CreateTable
CREATE TABLE "CareReminder" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "reminderDate" TIMESTAMP(3) NOT NULL,
    "status" "ReminderStatus" NOT NULL DEFAULT 'PENDING',
    "userId" TEXT NOT NULL,
    "animalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CareReminder_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CareReminder" ADD CONSTRAINT "CareReminder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareReminder" ADD CONSTRAINT "CareReminder_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
