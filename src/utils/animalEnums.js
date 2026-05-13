export const animalTypeValues = ["CAT", "DOG"];
export const animalGenderValues = ["MALE", "FEMALE"];

const animalTypeAliases = {
    CAT: "CAT",
    cat: "CAT",
    Кіт: "CAT",
    кіт: "CAT",
    DOG: "DOG",
    dog: "DOG",
    Собака: "DOG",
    собака: "DOG",
};

const animalGenderAliases = {
    MALE: "MALE",
    male: "MALE",
    Хлопчик: "MALE",
    хлопчик: "MALE",
    FEMALE: "FEMALE",
    female: "FEMALE",
    Дівчинка: "FEMALE",
    дівчинка: "FEMALE",
};

const normalizeEnumValue = (value, aliases) => {
    if (typeof value !== "string") {
        return value;
    }

    return aliases[value.trim()] ?? value;
};

export const normalizeAnimalType = (value) =>
    normalizeEnumValue(value, animalTypeAliases);

export const normalizeAnimalGender = (value) =>
    normalizeEnumValue(value, animalGenderAliases);
