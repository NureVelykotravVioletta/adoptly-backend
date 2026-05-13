-- CreateTable
CREATE TABLE "UserLikedAnimal" (
    "userId" TEXT NOT NULL,
    "animalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserLikedAnimal_pkey" PRIMARY KEY ("userId","animalId")
);

-- CreateIndex
CREATE INDEX "UserLikedAnimal_animalId_idx" ON "UserLikedAnimal"("animalId");

-- AddForeignKey
ALTER TABLE "UserLikedAnimal" ADD CONSTRAINT "UserLikedAnimal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLikedAnimal" ADD CONSTRAINT "UserLikedAnimal_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
