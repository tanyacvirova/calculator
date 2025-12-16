export const chartParams = {
    step: 5000,
    threshold: 250000
};

export function margin(mini, side) {
    if (mini && side) {
        return {
            top: 10,
            right: 0, 
            left: 30, 
            bottom: 20
        }
    } else if (mini) {
        return {
            top: 10,
            right: 0, 
            left: 5, 
            bottom: 20
        }
    } else {
        return {
            top: 20,
            right: 20, 
            left: 40, 
            bottom: 20
        }
    }
};

export const rosstatData = [
    {key: 1, title: "Не хватает денег даже на еду", value: 0.00878366786275783 },
    {key: 2, title: "Хватает только на еду", value: 10.254993446093 },
    {key: 3, title: "Хватает только на еду и одежду", value: 46.5307564013078 },
    {key: 4, title: "Хватает на еду, одежду и бытовую технику", value: 38.898221268779 },
    {key: 5, title: "Могут позволить себе все", value: 4.27471311276206 },
    {key: 6, title: "Не смогли ответить", value: 0.0325321031953994 }
];

export const promoCards = [
    {
        title: "Неравенство в России растет рекордными темпами.",
        subtitle: "Объясняем, почему от зарплатной гонки выигрывают богатые",
        tag: "Исследование",
        date: "10 июля",
        link: "https://tochno.st/materials/neravenstvo-v-rossii-rastet-rekordnymi-tempami-obieiasniaem-pocemu-ot-zarplatnoi-gonki-vyigryvaiut-bogatye"
    },
    {
        title: "Доля социальных выплат в доходах россиян может доходить до 73%.",
        subtitle: "Хорошая новость — она постепенно снижается",
        tag: "Исследование",
        date: "26 июня",
        link: "https://tochno.st/materials/kazdyi-12-i-municipalitet-v-rossii-ne-prozivet-bez-socvyplat-xorosaia-novost-takix-raionov-stanovitsia-vse-mense"
    },
    {
        title: "На Сахалине на одного жителя тратят в 5 раз больше, чем в Дагестане — и за десять лет разрыв не сократился",
        subtitle: "",
        tag: "Исследование",
        date: "10 июня",
        link: "https://tochno.st/materials/na-saxaline-na-odnogo-zitelia-tratiat-v-5-raz-bolse-cem-v-dagestane-i-za-desiat-let-razryv-ne-sokratilsia"
    }
];