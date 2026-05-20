ALTER TABLE "Animal" ADD COLUMN "adoptedById" TEXT;

CREATE INDEX "Animal_adoptedById_idx" ON "Animal"("adoptedById");

ALTER TABLE "Animal" ADD CONSTRAINT "Animal_adoptedById_fkey" FOREIGN KEY ("adoptedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
