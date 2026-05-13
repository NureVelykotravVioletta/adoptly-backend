ALTER TABLE "Shelter" ADD COLUMN "city" TEXT NOT NULL DEFAULT 'Невідоме місто';
ALTER TABLE "Animal" ADD COLUMN "city" TEXT NOT NULL DEFAULT 'Невідоме місто';

UPDATE "Shelter"
SET "city" = CASE
    WHEN "address" ILIKE 'м. Київ%' THEN 'Київ'
    WHEN "address" ILIKE 'м. Львів%' THEN 'Львів'
    WHEN "address" ILIKE 'м. Одеса%' THEN 'Одеса'
    WHEN "address" ILIKE 'м. Харків%' THEN 'Харків'
    WHEN "address" ILIKE 'м. Дніпро%' THEN 'Дніпро'
    WHEN "address" ILIKE 'м. Запоріжжя%' THEN 'Запоріжжя'
    ELSE "city"
END;

UPDATE "Animal"
SET "city" = "Shelter"."city"
FROM "Shelter"
WHERE "Animal"."shelterId" = "Shelter"."id";
