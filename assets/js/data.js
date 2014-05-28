var DataCenter = {
    drugs: [
        {
            "name": "Acid",
            "minimum_price": 1000,
            "maximum_price": 4400,
            "cheap": {
                "announce": "The black market is saturated with acid.",
                "minimum_price": 400,
                "maximum_price": 1100,
            },
            "expensive": {
                "announce": "Cops have recently arrested acid dealers here. Prices are boosted...",
                "minimum_price": 5000,
                "maximum_price": 8000,
            }
        },
        {
            "name": "Cocaine",
            "minimum_price": 15000,
            "maximum_price": 29000,
            "expensive": {
                "announce": "Addicts will buy cocaine at crazy prices !",
                "minimum_price": 40000,
                "maximum_price": 70000,
            }
        },
        {
            "name": "Hash",
            "minimum_price": 480,
            "maximum_price": 1280,
            "cheap": {
                "announce": "Hash is on sale for a limited time !",
                "minimum_price": 130,
                "maximum_price": 400,
            }
        },
        {
            "name": "Heroin",
            "minimum_price": 5500,
            "maximum_price": 13000,
            "expensive": {
                "announce": "Addicts will buy heroin at crazy prices !",
                "minimum_price": 12000,
                "maximum_price": 19000,
            }
        },
        {
            "name": "Glue",
            "minimum_price": 11,
            "maximum_price": 75,
            "cheap": {
                "announce": "Some pushers have stolen a hardware store's stock of glue.",
                "minimum_price": 2,
                "maximum_price": 15,
            }
        },
        {
            "name": "Ecstasy",
            "minimum_price": 1500,
            "maximum_price": 4400
        },
        {
            "name": "Opium",
            "minimum_price": 540,
            "maximum_price": 1250,
            "expensive": {
                "announce": "The opium market is unbelievably expensive !",
                "minimum_price": 34000,
                "maximum_price": 68000,
            }
        },
        {
            "name": "PCP",
            "minimum_price": 1000,
            "maximum_price": 2500
        },
        {
            "name": "Mush",
            "minimum_price": 630,
            "maximum_price": 1300
        },
        {
            "name": "Speed",
            "minimum_price": 90,
            "maximum_price": 250,
            "expensive": {
                "announce": "Speed is pretty expensive here...",
                "minimum_price": 2000,
                "maximum_price": 5000,
            }
        },
        {
            "name": "Marijuana",
            "minimum_price": 315,
            "maximum_price": 890,
            "cheap": {
                "announce": "Happy 4/20 ! Cheap weed for everyone !",
                "minimum_price": 60,
                "maximum_price": 220,
            }
        },
    ],
    cities: [
        {
            "name": "Laval",
            "cops": 10,
            "min_drugs": 5,
            "max_drugs": 10
        },
        {
            "name": "Mont-Royal",
            "cops": 5,
            "min_drugs": 7
        },
        {
            "name": "Lafontaine Park",
            "cops": 15,
            "min_drugs": 6
        },
        {
            "name": "Berry-UQAM Metro",
            "cops": 80,
            "min_drugs": 4
        },
        {
            "name": "Sainte-Hélène Island",
            "cops": 30,
            "min_drugs": 6
        },
        {
            "name": "Vieux-Port",
            "cops": 70,
            "min_drugs": 4,
            "max_drugs": 10
        },
        {
            "name": "Westmount",
            "cops": 70,
            "min_drugs": 6
        },
        {
            "name": "Notre-Dame-de-Grâce",
            "cops": 20,
            "min_drugs": 5
        },
    ],
    messages: {
        "100000000": "Com'on... you clearly cheated on that one.",
        "1000000": "You clearly are the best dealer in the universe !",
        "400000": "That's just way too much money for me.",
        "300000": "Perfect !",
        "200000": "Excellent !",
        "100000": "Wow...",
        "50000": "Quite good !",
        "10000": "Not bad...",
        "5000": "Almost an acceptable score...",
        "1000": "Why don't you try making some money for once ?",
        "0": "What a bad dealer...",
        "-4050": "Why do you even try ?",
        "-10000": "You know, people used to make money with this job.",
        "-99999": "You must be the worst drug dealer ever. In the universe. Of all time.",
        "-100000": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    }
};
