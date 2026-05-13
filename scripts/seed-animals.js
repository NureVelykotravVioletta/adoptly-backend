import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const UNKNOWN_CITY = "Невідоме місто";

const fallbackShelterImages = {
    Київ: "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?auto=format&fit=crop&w=1200&q=80",
    Львів: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?auto=format&fit=crop&w=1200&q=80",
    Одеса: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1200&q=80",
    default:
        "https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?auto=format&fit=crop&w=1200&q=80",
};

const fallbackAnimalImages = {
    CAT: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=80",
    DOG:
        "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=80",
    default:
        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80",
};

function resolveCity(address) {
    if (!address) {
        return UNKNOWN_CITY;
    }

    const cityByKeyword = {
        Київ: "Київ",
        Львів: "Львів",
        Одеса: "Одеса",
        Харків: "Харків",
        Дніпро: "Дніпро",
        Запоріжжя: "Запоріжжя",
    };

    for (const [keyword, city] of Object.entries(cityByKeyword)) {
        if (address.includes(keyword)) {
            return city;
        }
    }

    return UNKNOWN_CITY;
}

const shelters = [
    {
        name: "Лапки Надії",
        description:
            "Міський притулок для котів і собак, які шукають відповідальних людей та спокійний дім.",
        city: "Київ",
        address: "м. Київ, вул. Добровольча, 12",
        phone: "+380671112233",
        email: "lapky.nadii@example.com",
        foundationDate: new Date("2018-04-12"),
        workingHours: "Пн-Нд 10:00-18:00",
        images: [
            "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1601758064224-c3c153e0f836?auto=format&fit=crop&w=1200&q=80",
        ],
    },
    {
        name: "Другий Дім",
        description:
            "Волонтерський притулок, що опікується тваринами після евакуації, лікування та перетримки.",
        city: "Львів",
        address: "м. Львів, вул. Зелена, 84",
        phone: "+380932224455",
        email: "druhyi.dim@example.com",
        foundationDate: new Date("2020-09-03"),
        workingHours: "Вт-Нд 09:00-17:00",
        images: [
            "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?auto=format&fit=crop&w=1200&q=80",
        ],
    },
    {
        name: "Хвостики Поруч",
        description:
            "Невеликий центр адопції для соціальних тварин, яким потрібна сім'я та стабільний догляд.",
        city: "Одеса",
        address: "м. Одеса, вул. Сонячна, 7",
        phone: "+380501234567",
        email: "hvostyky.poruch@example.com",
        foundationDate: new Date("2019-06-21"),
        workingHours: "Пн-Сб 11:00-19:00",
        images: [
            "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=1200&q=80",
        ],
    },
];

const animals = [
    {
        shelterName: "Лапки Надії",
        name: "Боня",
        type: "DOG",
        gender: "FEMALE",
        age: 3,
        breed: "Метис лабрадора",
        healthStatus: "Вакцинована, стерилізована, оброблена від паразитів",
        description:
            "Лагідна й дуже орієнтована на людину собака. Любить неквапливі прогулянки, добре ходить на повідку та швидко вчиться за ласощі.",
        images: [
            "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=80",
        ],
    },
    {
        shelterName: "Лапки Надії",
        name: "Марс",
        type: "DOG",
        gender: "MALE",
        age: 2,
        breed: "Метис вівчарки",
        healthStatus: "Вакцинований, здоровий, кастрований",
        description:
            "Активний, розумний і контактний пес для людей, які люблять прогулянки та готові продовжувати базове навчання.",
        images: [
            "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=1200&q=80",
        ],
    },
    {
        shelterName: "Лапки Надії",
        name: "Міла",
        type: "CAT",
        gender: "FEMALE",
        age: 1,
        breed: "Домашня короткошерста",
        healthStatus: "Стерилізована, вакцинована, клінічно здорова",
        description:
            "Ніжна киця, яка спершу придивляється до нових людей, а потім сама приходить по увагу. Добре підходить для спокійної квартири.",
        images: [
            "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=80",
        ],
    },
    {
        shelterName: "Лапки Надії",
        name: "Грім",
        type: "DOG",
        gender: "MALE",
        age: 5,
        breed: "Метис хаскі",
        healthStatus: "Вакцинований, має регулярну профілактику паразитів",
        description:
            "Енергійний красень із сильним характером. Потребує досвідченого власника, активних прогулянок і чітких доброзичливих правил.",
        images: [
            "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?auto=format&fit=crop&w=1200&q=80",
        ],
    },
    {
        shelterName: "Лапки Надії",
        name: "Соня",
        type: "CAT",
        gender: "FEMALE",
        age: 4,
        breed: "Метис",
        healthStatus: "Стерилізована, вакцинована",
        description:
            "Спокійна домашня киця, яка любить м'які лежанки, тишу й людей, що поважають її особистий простір.",
        images: [
            "https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=1200&q=80",
        ],
    },
    {
        shelterName: "Другий Дім",
        name: "Річі",
        type: "DOG",
        gender: "MALE",
        age: 1,
        breed: "Метис тер'єра",
        healthStatus: "Вакцинований, кастрація запланована за віком",
        description:
            "Веселий молодий пес, який швидко прив'язується до людей. Любить іграшки, навчання та короткі активні заняття.",
        images: [
            "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=1200&q=80",
        ],
    },
    {
        shelterName: "Другий Дім",
        name: "Луна",
        type: "CAT",
        gender: "FEMALE",
        age: 2,
        breed: "Триколірна домашня",
        healthStatus: "Стерилізована, вакцинована, оброблена від паразитів",
        description:
            "Комунікабельна киця з м'яким характером. Добре реагує на людей і може жити з іншим спокійним котом після поступового знайомства.",
        images: [
            "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=1200&q=80",
        ],
    },
    {
        shelterName: "Другий Дім",
        name: "Тедді",
        type: "DOG",
        gender: "MALE",
        age: 6,
        breed: "Метис",
        healthStatus: "Здоровий, вакцинований, кастрований",
        description:
            "Спокійний дорослий пес, який цінує передбачуваність. Підійде людям, що шукають врівноваженого друга без цуценячої метушні.",
        images: [
            "https://images.unsplash.com/photo-1525253013412-55c1a69a5738?auto=format&fit=crop&w=1200&q=80",
        ],
    },
    {
        shelterName: "Другий Дім",
        name: "Кекс",
        type: "CAT",
        gender: "MALE",
        age: 3,
        breed: "Рудий домашній",
        healthStatus: "Кастрований, вакцинований",
        description:
            "Доброзичливий рудий кіт, який любить бути поруч, муркоче на руках і швидко звикає до домашнього режиму.",
        images: [
            "https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?auto=format&fit=crop&w=1200&q=80",
        ],
    },
    {
        shelterName: "Другий Дім",
        name: "Ніка",
        type: "DOG",
        gender: "FEMALE",
        age: 4,
        breed: "Метис бордер-колі",
        healthStatus: "Стерилізована, вакцинована, здорова",
        description:
            "Кмітлива й уважна собака, якій подобаються завдання та контакт із людиною. Найкраще почуватиметься в активній родині.",
        images: [
            "https://images.unsplash.com/photo-1554692918-08fa0fdc9db3?auto=format&fit=crop&w=1200&q=80",
        ],
    },
    {
        shelterName: "Хвостики Поруч",
        name: "Персик",
        type: "CAT",
        gender: "MALE",
        age: 1,
        breed: "Домашній короткошерстий",
        healthStatus: "Кастрований, вакцинований",
        description:
            "Молодий грайливий кіт, який любить вудочки, тунелі та спостерігати у вікно. Після гри охоче відпочиває поруч із людиною.",
        images: [
            "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=1200&q=80",
        ],
    },
    {
        shelterName: "Хвостики Поруч",
        name: "Джек",
        type: "DOG",
        gender: "MALE",
        age: 7,
        breed: "Метис",
        healthStatus: "Вакцинований, кастрований, потребує контролю ваги",
        description:
            "Добрий старший пес із великим серцем. Любить повільні прогулянки, увагу та м'яке місце для сну.",
        images: [
            "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80",
        ],
    },
    {
        shelterName: "Хвостики Поруч",
        name: "Злата",
        type: "DOG",
        gender: "FEMALE",
        age: 2,
        breed: "Метис ретривера",
        healthStatus: "Стерилізована, вакцинована, здорова",
        description:
            "Сонячна й лагідна собака, яка добре контактує з людьми. Любить прогулянки, спокійні ігри та похвалу.",
        images: [
            "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=1200&q=80",
        ],
    },
    {
        shelterName: "Хвостики Поруч",
        name: "Бусинка",
        type: "CAT",
        gender: "FEMALE",
        age: 5,
        breed: "Домашня довгошерста",
        healthStatus: "Стерилізована, вакцинована, потребує регулярного вичісування",
        description:
            "Пухнаста спокійна киця, яка любить рутину та ніжне ставлення. Підійде для дому без зайвого шуму.",
        images: [
            "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=1200&q=80",
        ],
    },
    {
        shelterName: "Хвостики Поруч",
        name: "Арчі",
        type: "DOG",
        gender: "MALE",
        age: 3,
        breed: "Метис спанієля",
        healthStatus: "Вакцинований, кастрований",
        description:
            "Дружній пес середнього розміру, який любить людей і добре реагує на спокійне навчання. Шукає родину для стабільного життя.",
        images: [
            "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1200&q=80",
        ],
    },
];

async function upsertShelter(shelter) {
    const { images, ...shelterData } = shelter;

    const existingShelter = await prisma.shelter.findFirst({
        where: {
            name: shelterData.name,
        },
        include: {
            images: true,
        },
    });

    if (existingShelter) {
        const updatedShelter = await prisma.shelter.update({
            where: {
                id: existingShelter.id,
            },
            data: shelterData,
            include: {
                images: true,
            },
        });

        return addMissingShelterImages(updatedShelter, images);
    }

    const createdShelter = await prisma.shelter.create({
        data: {
            ...shelterData,
            images: {
                create: images.map((imageUrl) => ({ imageUrl })),
            },
        },
        include: {
            images: true,
        },
    });

    return {
        shelter: createdShelter,
        createdImagesCount: images.length,
    };
}

async function upsertAnimal(animal, shelter) {
    const { images, shelterName, ...animalData } = animal;

    const existingAnimal = await prisma.animal.findFirst({
        where: {
            name: animalData.name,
            shelterId: shelter.id,
        },
        include: {
            images: true,
        },
    });

    if (existingAnimal) {
        const updatedAnimal = await prisma.animal.update({
            where: {
                id: existingAnimal.id,
            },
            data: {
                ...animalData,
                city: shelter.city,
                shelterId: shelter.id,
            },
            include: {
                images: true,
            },
        });

        return addMissingImages(updatedAnimal, images);
    }

    const createdAnimal = await prisma.animal.create({
        data: {
            ...animalData,
            city: shelter.city,
            shelterId: shelter.id,
            images: {
                create: images.map((imageUrl) => ({ imageUrl })),
            },
        },
        include: {
            images: true,
        },
    });

    return {
        animal: createdAnimal,
        createdImagesCount: images.length,
    };
}

async function addMissingShelterImages(shelter, images) {
    const existingUrls = new Set(shelter.images.map((image) => image.imageUrl));
    const imagesToCreate = images.filter((imageUrl) => !existingUrls.has(imageUrl));

    if (imagesToCreate.length > 0) {
        await prisma.shelterImage.createMany({
            data: imagesToCreate.map((imageUrl) => ({
                shelterId: shelter.id,
                imageUrl,
            })),
        });
    }

    return {
        shelter,
        createdImagesCount: imagesToCreate.length,
    };
}

async function addMissingImages(animal, images) {
    const existingUrls = new Set(animal.images.map((image) => image.imageUrl));
    const imagesToCreate = images.filter((imageUrl) => !existingUrls.has(imageUrl));

    if (imagesToCreate.length > 0) {
        await prisma.animalImage.createMany({
            data: imagesToCreate.map((imageUrl) => ({
                animalId: animal.id,
                imageUrl,
            })),
        });
    }

    return {
        animal,
        createdImagesCount: imagesToCreate.length,
    };
}

async function normalizeExistingRecords() {
    const sheltersToNormalize = await prisma.shelter.findMany({
        include: {
            images: true,
        },
    });

    let updatedSheltersCount = 0;
    let addedShelterImagesCount = 0;

    for (const shelter of sheltersToNormalize) {
        const city =
            shelter.city === UNKNOWN_CITY
                ? resolveCity(shelter.address)
                : shelter.city;

        if (city !== shelter.city) {
            await prisma.shelter.update({
                where: { id: shelter.id },
                data: { city },
            });

            updatedSheltersCount += 1;
        }

        await prisma.animal.updateMany({
            where: { shelterId: shelter.id },
            data: { city },
        });

        if (shelter.images.length === 0) {
            await prisma.shelterImage.create({
                data: {
                    shelterId: shelter.id,
                    imageUrl:
                        fallbackShelterImages[city] ??
                        fallbackShelterImages.default,
                },
            });

            addedShelterImagesCount += 1;
        }
    }

    const animalsWithoutImages = await prisma.animal.findMany({
        where: {
            images: {
                none: {},
            },
        },
    });

    if (animalsWithoutImages.length > 0) {
        await prisma.animalImage.createMany({
            data: animalsWithoutImages.map((animal) => ({
                animalId: animal.id,
                imageUrl:
                    fallbackAnimalImages[animal.type] ??
                    fallbackAnimalImages.default,
            })),
        });
    }

    return {
        updatedSheltersCount,
        addedShelterImagesCount,
        addedAnimalImagesCount: animalsWithoutImages.length,
    };
}

async function main() {
    const shelterByName = new Map();
    let createdShelterImagesCount = 0;

    for (const shelter of shelters) {
        const result = await upsertShelter(shelter);
        shelterByName.set(result.shelter.name, result.shelter);
        createdShelterImagesCount += result.createdImagesCount;
    }

    let createdAnimalsCount = 0;
    let updatedAnimalsCount = 0;
    let createdImagesCount = 0;

    for (const animal of animals) {
        const shelter = shelterByName.get(animal.shelterName);

        if (!shelter) {
            throw new Error(`Shelter not found for animal: ${animal.name}`);
        }

        const existingAnimal = await prisma.animal.findFirst({
            where: {
                name: animal.name,
                shelterId: shelter.id,
            },
            select: {
                id: true,
            },
        });

        const result = await upsertAnimal(animal, shelter);

        if (existingAnimal) {
            updatedAnimalsCount += 1;
        } else {
            createdAnimalsCount += 1;
        }

        createdImagesCount += result.createdImagesCount;
    }

    const normalized = await normalizeExistingRecords();

    console.log(
        `Seeded ${shelterByName.size} shelters. Added ${createdShelterImagesCount} shelter images. Created ${createdAnimalsCount} animals. Updated ${updatedAnimalsCount} animals. Added ${createdImagesCount} animal images. Normalized ${normalized.updatedSheltersCount} shelters. Added ${normalized.addedShelterImagesCount} fallback shelter images. Added ${normalized.addedAnimalImagesCount} fallback animal images.`
    );
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
