airplaneData = {
    "cessna172m": {
        "label": "Cessna 172 M",
        "dataSource": "Data from Cessna Model 172M Pilot's Operating Handbook (1976)",
        "airspeedCalibration": {
            # Flaps: (KIAS, KCAS)
            0: {
                40: 49,
                50: 55,
                60: 62,
                70: 70,
                80: 80,
                90: 89,
                100: 99,
                110: 108,
                120: 118,
                130: 128,
                140: 138,
            },

            10: {
                40: 49,
                50: 55,
                60: 62,
                70: 71,
                80: 80,
                85: 85,
            },

            40: {
                40: 47,
                50: 54,
                60: 62,
                70: 71,
                80: 81,
                85: 86,
            },
        },
        "cruisePerformance": {
            # Pressure altitude: RPM
            "cols": {
                2000: [
                    2550,
                    2500,
                    2400,
                    2300,
                    2200,
                ],

                4000: [
                    2600,
                    2500,
                    2400,
                    2300,
                    2200,
                ],

                6000: [
                    2650,
                    2600,
                    2500,
                    2400,
                    2300,
                    2200,
                ],

                8000: [
                    2700,
                    2600,
                    2500,
                    2400,
                    2300,
                    2200,
                ],

                10000: [
                    2700,
                    2600,
                    2500,
                    2400,
                    2300,
                    2200,
                ],

                12000: [
                    2650,
                    2600,
                    2500,
                    2400,
                    2300,
                    2200,
                ],
            },

            # %BHP, KTAS, GPH
            "below_vals": [
                """80 114 8.8
                76 111 8.3
                68 107 7.5
                61 102 6.9
                55 96 6.4""",

                """80 116 8.8
                72 111 7.9
                65 107 7.3
                58 101 6.7
                52 95 6.3""",

                """80 118 8.8
                76 116 8.3
                69 111 7.6
                62 106 7.0
                56 100 6.5
                50 94 6.1""",

                """80 120 8.8
                72 116 8.0
                65 111 7.3
                59 105 6.8
                54 99 6.4
                48 93 6.0""",

                """76 120 8.4
                69 115 7.6
                63 110 7.1
                57 104 6.6
                51 97 6.2
                46 92 5.8""",

                """69 117 7.6
                66 114 7.4
                60 108 6.8
                54 102 6.4
                49 96 6.0
                44 91 5.7"""
            ],

            "standard_vals": [
                """75 113 8.2
                71 111 7.8
                64 107 7.2
                58 101 6.7
                52 95 6.2""",

                """75 116 8.3
                68 111 7.5
                61 106 6.9
                55 100 6.5
                49 93 6.1""",

                """75 118 8.2
                71 116 7.9
                65 110 7.2
                59 104 6.7
                53 98 6.3
                47 92 5.9""",

                """75 120 8.3
                68 115 7.5
                62 109 7.0
                56 103 6.6
                51 97 6.2
                45 91 5.8""",

                """72 120 7.9
                65 114 7.3
                59 108 6.8
                54 102 6.4
                48 96 6.0
                43 90 5.7""",

                """65 116 7.3
                62 113 7.0
                57 106 6.6
                51 100 6.2
                46 95 5.9
                41 89 5.5"""
            ],

            "above_vals": [
                """71 113 7.8
                67 111 7.5
                61 106 6.9
                55 99 6.5
                49 93 6.1""",

                """71 116 7.8
                64 110 7.2
                58 104 6.7
                53 98 6.3
                47 92 5.9""",

                """71 118 7.8
                68 115 7.5
                62 109 7.0
                56 103 6.5
                50 97 6.1
                45 91 5.8""",

                """71 120 7.8
                65 114 7.3
                59 108 6.8
                53 101 6.3
                48 96 6.0
                43 90 5.7""",

                """68 119 7.6
                62 112 7.0
                56 106 6.6
                51 100 6.2
                46 95 5.8
                41 89 5.5""",

                """62 114 7.0
                59 111 6.8
                54 105 6.4
                49 99 6.0
                43 94 5.7
                38 88 5.3"""
            ],
        },
        "taxiPerformance": {
            "taxiTakeoffFuelUsed": 1.1,
        },
        "climbPerformance": {
            2300: {
                0: {
                    "tempC": 15,
                    "climbSpeedKias": 78,
                    "rateOfClimbFpm": 645,
                    "time": 0,
                    "fuelUsedGallons": 0.0,
                    "distanceNm": 0
                },
                1000: {
                    "tempC": 13,
                    "climbSpeedKias": 77,
                    "rateOfClimbFpm": 605,
                    "time": 2,
                    "fuelUsedGallons": 0.3,
                    "distanceNm": 2
                },
                2000: {
                    "tempC": 11,
                    "climbSpeedKias": 76,
                    "rateOfClimbFpm": 560,
                    "time": 3,
                    "fuelUsedGallons": 0.7,
                    "distanceNm": 4
                },
                3000: {
                    "tempC": 9,
                    "climbSpeedKias": 75,
                    "rateOfClimbFpm": 520,
                    "time": 5,
                    "fuelUsedGallons": 1.1,
                    "distanceNm": 7
                },
                4000: {
                    "tempC": 7,
                    "climbSpeedKias": 74,
                    "rateOfClimbFpm": 480,
                    "time": 7,
                    "fuelUsedGallons": 1.5,
                    "distanceNm": 9
                },
                5000: {
                    "tempC": 5,
                    "climbSpeedKias": 73,
                    "rateOfClimbFpm": 435,
                    "time": 9,
                    "fuelUsedGallons": 1.9,
                    "distanceNm": 12
                },
                6000: {
                    "tempC": 3,
                    "climbSpeedKias": 72,
                    "rateOfClimbFpm": 395,
                    "time": 12,
                    "fuelUsedGallons": 2.3,
                    "distanceNm": 16
                },
                7000: {
                    "tempC": 1,
                    "climbSpeedKias": 71,
                    "rateOfClimbFpm": 355,
                    "time": 15,
                    "fuelUsedGallons": 2.8,
                    "distanceNm": 19
                },
                8000: {
                    "tempC": -1,
                    "climbSpeedKias": 70,
                    "rateOfClimbFpm": 315,
                    "time": 18,
                    "fuelUsedGallons": 3.3,
                    "distanceNm": 23
                },
                9000: {
                    "tempC": -3,
                    "climbSpeedKias": 69,
                    "rateOfClimbFpm": 270,
                    "time": 21,
                    "fuelUsedGallons": 3.9,
                    "distanceNm": 28
                },
                10000: {
                    "tempC": -5,
                    "climbSpeedKias": 68,
                    "rateOfClimbFpm": 230,
                    "time": 25,
                    "fuelUsedGallons": 4.5,
                    "distanceNm": 33
                },
                11000: {
                    "tempC": -7,
                    "climbSpeedKias": 67,
                    "rateOfClimbFpm": 185,
                    "time": 30,
                    "fuelUsedGallons": 5.2,
                    "distanceNm": 40
                },
                12000: {
                    "tempC": -9,
                    "climbSpeedKias": 66,
                    "rateOfClimbFpm": 145,
                    "time": 36,
                    "fuelUsedGallons": 6.1,
                    "distanceNm": 48
                }
            }
        }
    }
}