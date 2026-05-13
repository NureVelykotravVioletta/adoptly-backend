CREATE TYPE "AnimalType" AS ENUM ('CAT', 'DOG');
CREATE TYPE "AnimalGender" AS ENUM ('MALE', 'FEMALE');

ALTER TABLE "Animal"
ALTER COLUMN "type" TYPE "AnimalType"
USING (
    CASE
        WHEN lower("type") IN ('cat', 'кіт') THEN 'CAT'
        WHEN lower("type") IN ('dog', 'собака') THEN 'DOG'
        ELSE "type"
    END
)::"AnimalType";

ALTER TABLE "Animal"
ALTER COLUMN "gender" TYPE "AnimalGender"
USING (
    CASE
        WHEN lower("gender") IN ('male', 'хлопчик') THEN 'MALE'
        WHEN lower("gender") IN ('female', 'дівчинка') THEN 'FEMALE'
        ELSE "gender"
    END
)::"AnimalGender";
