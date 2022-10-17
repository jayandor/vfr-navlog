airplaneData = {
    "cessna172m": {
        "label": "Cessna 172 M",
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
        }
    }
}