const STANDARD_TEMP = 15;

let defaultNavlogData = {

    planeType: "cessna172m",

    weight: 2300,

    originICAO: '',
    originTemp: 15,
    originAltim: 29.92,
    originWindDir: 0,
    originWindSpeed: 0,
    originElev: 0,

    originAloftDataAltLowerCustom: 3000,
    originAloftDataAltUpperCustom: 6000,
    // Temps aloft
      // Lower
    originTempAloftLowerUseGround: true,
    originTempAloftLowerCustom: 0,
      // Upper
    originTempAloftUpperCustom: 0,


    originWindDataAloftLowerUseGround: true,
    originWindDataAloftLowerUseFAAData: true,
    // Wind direction aloft
      // Lower
    originWindDirAloftLowerCustom: 0,
      // Upper
    originWindDirAloftUpperCustom: 0,

    // Wind speed aloft
      // Lower
    originWindSpeedAloftLowerCustom: 0,
      // Upper
    originWindSpeedAloftUpperCustom: 0,

    destICAO: '',
    destTemp: 15,
    destAltim: 29.92,
    destWindDir: 0,
    destWindSpeed: 0,
    destElev: 0,

    cruiseAlt: 4500,
    cruiseRPM: 2500,
    cruiseTrueCourse: 0,

    legDistance: 0,
};

export let navlogApp = function(airplaneData, windsAloft) {
    return {
        data() {
            return {
                navlog: defaultNavlogData,
                airplaneData: {},
                windsAloft: {},
                airplaneDataLoaded: false,
            }
        },
        computed: {
            originPressAlt() {
                return this.convertToPressAlt(this.navlog.originElev, this.navlog.originAltim);
            },
            destPressAlt() {
                return this.convertToPressAlt(this.navlog.destElev, this.navlog.destAltim);
            },

            originWindsAloft() {
                if (this.windsAloft && this.windsAloft.parsedProductText && this.windsAloft.parsedProductText.data["LOU"]) {
                    return this.windsAloft.parsedProductText.data["LOU"];
                }
                return null;
            },

            originTempAloftAltLower() {
                // return this.navlog.originTempAloftLowerUseGround ? this.navlog.originElev : this.navlog.originAloftDataAltLowerCustom;
                if (this.navlog.originTempAloftLowerUseGround) {
                    // Use temp reported at airport
                    return this.navlog.originElev;
                } else {
                    if (this.navlog.originTempAloftLowerUseFAAData) {
                        // Use temp data acquired directly from FAA winds aloft API
                        if (!this.originWindsAloft) return this.navlog.originElev;

                        let alt = this.chooseClosestKey(this.navlog.originAloftDataAltLowerCustom, Object.keys(this.originWindsAloft));

                        if (this.originWindsAloft[alt]["tempC"] !== null) {
                            return alt;
                        } else {
                            // If altitude too low, temp may not be reported in winds aloft; use origin airport temp
                            return this.navlog.originElev;
                        }
                    } else {
                        // Use user-entered temp direction
                        return this.navlog.originAloftDataAltLowerCustom
                    }
                }
            },
            originTempAloftLower() {
                if (this.navlog.originTempAloftLowerUseGround) {
                    // Use temp reported at airport
                    return this.navlog.originTemp;
                } else {
                    if (this.navlog.originTempAloftLowerUseFAAData) {
                        // Use temp data acquired directly from FAA winds aloft API
                        if (!this.originWindsAloft) return 0;

                        let alt = this.chooseClosestKey(this.originTempAloftAltLower, Object.keys(this.originWindsAloft));

                        if (this.originWindsAloft[alt]["tempC"] !== null) {
                            return this.originWindsAloft[alt]["tempC"];
                        } else {
                            // If altitude too low, temp may not be reported in winds aloft; use origin airport temp
                            return this.navlog.originTemp;
                        }
                    } else {
                        // Use user-entered temp direction
                        return this.navlog.originTempAloftLowerCustom
                    }
                }
            },

            originWindDataAloftAltLower() {
                // return this.navlog.originWindDataAloftLowerUseGround ? this.navlog.originElev : this.navlog.originAloftDataAltLowerCustom;
                if (this.navlog.originWindDataAloftLowerUseGround) {
                    // Use wind direction reported at airport
                    return this.navlog.originElev;
                } else {
                    if (this.navlog.originWindDataAloftLowerUseFAAData) {
                        // Use wind data acquired directly from FAA winds aloft API
                        if (!this.originWindsAloft) return this.navlog.originElev;

                        let alt = this.chooseClosestKey(this.navlog.originAloftDataAltLowerCustom, Object.keys(this.originWindsAloft));

                        return alt;
                    } else {
                        // Use user-entered wind direction
                        return this.navlog.originAloftDataAltLowerCustom
                    }
                }
            },
            originWindDirAloftLower() {
                if (this.navlog.originWindDataAloftLowerUseGround) {
                    // Use wind direction reported at airport
                    return this.navlog.originWindDir;
                } else {
                    if (this.navlog.originWindDataAloftLowerUseFAAData) {
                        // Use wind data acquired directly from FAA winds aloft API
                        if (!this.originWindsAloft) return 0;

                        let alt = this.chooseClosestKey(this.originWindDataAloftAltLower, Object.keys(this.originWindsAloft));

                        return this.originWindsAloft[alt]["windDirectionDegrees"];
                    } else {
                        // Use user-entered wind direction
                        return this.navlog.originWindDirAloftLowerCustom
                    }
                }
            },
            originWindSpeedAloftLower() {
                if (this.navlog.originWindDataAloftLowerUseGround) {
                    // Use wind direction reported at airport
                    return this.navlog.originWindSpeed;
                } else {
                    if (this.navlog.originWindDataAloftLowerUseFAAData) {
                        // Use wind data acquired directly from FAA winds aloft API
                        if (!this.originWindsAloft) return 0;

                        let alt = this.chooseClosestKey(this.originWindDataAloftAltLower, Object.keys(this.originWindsAloft));

                        return this.originWindsAloft[alt]["windSpeedKnots"];
                    } else {
                        // Use user-entered wind direction
                        return this.navlog.originWindSpeedAloftLowerCustom
                    }
                }
            },



            originAloftDataAltUpper() {
                if (this.navlog.originAloftDataUpperUseFAAData) {
                    // Use wind data acquired directly from FAA winds aloft API
                    if (!this.originWindsAloft) return this.navlog.originElev;

                    let alt = this.chooseClosestKey(this.navlog.originAloftDataAltUpperCustom, Object.keys(this.originWindsAloft));

                    return alt;
                } else {
                    // Use user-entered wind direction
                    return this.navlog.originAloftDataAltUpperCustom
                }
            },
            originWindDirAloftUpper() {
                if (this.navlog.originAloftDataUpperUseFAAData) {
                    // Use wind data acquired directly from FAA winds aloft API
                    if (!this.originWindsAloft) return 0;

                    let alt = this.chooseClosestKey(this.navlog.originAloftDataAltUpperCustom, Object.keys(this.originWindsAloft));

                    return this.originWindsAloft[alt]["windDirectionDegrees"];
                } else {
                    // Use user-entered wind direction
                    return this.navlog.originWindDirAloftUpperCustom
                }
            },
            originWindSpeedAloftUpper() {
                if (this.navlog.originAloftDataUpperUseFAAData) {
                    // Use wind data acquired directly from FAA winds aloft API
                    if (!this.originWindsAloft) return 0;

                    let alt = this.chooseClosestKey(this.navlog.originAloftDataAltUpperCustom, Object.keys(this.originWindsAloft));

                    return this.originWindsAloft[alt]["windSpeedKnots"];
                } else {
                    // Use user-entered wind direction
                    return this.navlog.originWindSpeedAloftUpperCustom
                }
            },
            originTempAloftUpper() {
                if (this.navlog.originAloftDataUpperUseFAAData) {
                    // Use temp data acquired directly from FAA winds aloft API
                    if (!this.originWindsAloft) return 0;

                    let alt = this.chooseClosestKey(this.navlog.originAloftDataAltUpperCustom, Object.keys(this.originWindsAloft));

                    if (this.originWindsAloft[alt]["tempC"] !== null) {
                        return this.originWindsAloft[alt]["tempC"];
                    } else {
                        // If altitude too low, temp may not be reported in winds aloft; use origin airport temp
                        return this.navlog.originTemp;
                    }
                } else {
                    // Use user-entered temp direction
                    return this.navlog.originTempAloftUpperCustom
                }
            },

            climbPerformanceData() {
                if (this.airplaneDataLoaded) {
                    let weight_data = this.chooseClosestValue(this.navlog.weight, this.generalAirplaneData["climbPerformance"]);
                    let alt_data = this.chooseClosestValue(this.cruisePressAlt, weight_data);
                    return alt_data;
                } else {
                    return null;
                }
            },
            originClimbPerformanceData() {
                if (this.airplaneDataLoaded) {
                    let weight_data = this.chooseClosestValue(this.navlog.weight, this.generalAirplaneData["climbPerformance"]);
                    let alt_data = this.chooseClosestValue(this.originPressAlt, weight_data);
                    return alt_data;
                } else {
                    return null;
                }
            },
            timeToClimb() {
                if (this.climbPerformanceData) {
                    let temp_factor = (1 + (0.1 * (this.navlog.originTemp - STANDARD_TEMP) / 10));
                    let diff = this.climbPerformanceData.time * temp_factor - this.originClimbPerformanceData.time * temp_factor;
                    return Math.max(diff, 0);
                }
                return 0;
            },
            climbFuelBurned() {
                if (this.climbPerformanceData) {
                    let temp_factor = (1 + (0.1 * (this.navlog.originTemp - STANDARD_TEMP) / 10));
                    let diff = this.climbPerformanceData.fuelUsedGallons * temp_factor - this.originClimbPerformanceData.fuelUsedGallons * temp_factor;
                    return Math.max(diff, 0);
                }
                return 0;
            },
            climbKIAS() {
                if (this.climbPerformanceData)
                    return this.climbPerformanceData.climbSpeedKias;
                return 0;
            },

            taxiPerformanceData() {
                if (this.airplaneDataLoaded) {
                    return this.generalAirplaneData["taxiPerformance"];
                } else {
                    return null;
                }
            },
            taxiTakeoffFuelUsed() {
                if (this.taxiPerformanceData)
                    return this.taxiPerformanceData.taxiTakeoffFuelUsed;
                return 0;
            },

            cruiseTemp() {
                return this.interpolate(
                    this.navlog.cruiseAlt,
                    this.originTempAloftAltLower,
                    this.originAloftDataAltUpper,
                    this.originTempAloftLower,
                    this.originTempAloftUpper
                )
            },
            cruiseWindDir() {
                return this.interpolate(
                    this.navlog.cruiseAlt,
                    this.originWindDataAloftAltLower,
                    this.originAloftDataAltUpper,
                    this.originWindDirAloftLower,
                    this.originWindDirAloftUpper
                )
            },
            cruiseWindSpeed() {
                return this.interpolate(
                    this.navlog.cruiseAlt,
                    this.originWindDataAloftAltLower,
                    this.originAloftDataAltUpper,
                    this.originWindSpeedAloftLower,
                    this.originWindSpeedAloftUpper
                )
            },
            cruisePressAlt() {
                return this.convertToPressAlt(this.navlog.cruiseAlt, this.avg(this.navlog.originAltim, this.navlog.destAltim));
            },

            airplaneTypes() {
                if (this.airplaneDataLoaded) {
                    return Object.keys(this.airplaneData);
                } else {
                    return [];
                }
            },
            generalAirplaneData() {
                let plane_type = this.navlog.planeType;
                return this.airplaneData[plane_type];
            },
            generalCruisePerformanceData() {
                return this.generalAirplaneData["cruisePerformance"];
            },
            generalAirspeedCalibrationData() {
                return this.generalAirplaneData["cruisePerformance"];
            },
            cruisePerformanceData() {
                if (this.airplaneDataLoaded) {
                    let press_alts = Object.keys(this.generalCruisePerformanceData);
                    let press_alt = this.chooseClosestKey(this.cruisePressAlt, press_alts);

                    let temp_performance = this.generalCruisePerformanceData[press_alt];

                    let temp =
                        this.cruiseTemp < (STANDARD_TEMP - 20) ?
                            "below" :
                            this.cruiseTemp > (STANDARD_TEMP + 20) ?
                                "above" :
                                "standard";

                    let rpm_performance = temp_performance[temp];

                    let rpms = Object.keys(rpm_performance);
                    let rpm = this.chooseClosestKey(this.navlog.cruiseRPM, rpms);

                    return rpm_performance[rpm];
                } else {
                    return null;
                }
            },
            cruiseKCAS() {
                return this.convertKTAStoKCAS(this.cruisePerformanceData.ktas, this.navlog.cruiseAlt, this.cruiseTemp);
            },
            windCorrectionAngle() {
                if (this.cruisePerformanceData) {
                    let windAngle = this.cruiseWindDir - this.navlog.cruiseTrueCourse;
                    let windAngleRad = windAngle * Math.PI / 180;
                    let correctionAngleRad = Math.asin(this.cruiseWindSpeed * Math.sin(windAngleRad) / this.cruisePerformanceData.ktas);
                    let correctionAngle = correctionAngleRad * 180 / Math.PI;

                    return correctionAngle;
                } else {
                    return 0;
                }
            },
            groundSpeed() {
                if (this.cruisePerformanceData) {
                    let angle = (this.navlog.cruiseTrueCourse
                            - this.cruiseWindDir
                            + this.windCorrectionAngle) * Math.PI / 180;
                    return Math.sqrt(
                        Math.pow(this.cruisePerformanceData.ktas, 2)
                        + Math.pow(this.cruiseWindSpeed, 2)
                        - (2 * this.cruisePerformanceData.ktas * this.cruiseWindSpeed * Math.cos(angle))
                    );
                } else {
                    return 0;
                }
            }
        },
        mounted() {
            if (localStorage.getItem('navlog')) {
                try {
                    this.navlog = JSON.parse(localStorage.getItem('navlog'));
                } catch(e) {
                    localStorage.removeItem('navlog');
                }
            }

            this.airplaneData = airplaneData;
            this.airplaneDataLoaded = true;

            this.windsAloft = windsAloft;

            this.$el.parentNode.classList.remove("loading");
        },
        methods: {
            resetData() {
                this.navlog = defaultNavlogData;
            },

            interpolate(val, lower, upper, lower_val, upper_val) {
                if (upper == lower) return lower_val;
                let i = (val - lower) / (upper - lower);
                return this.lerp(lower_val, upper_val, i);
            },

            lerp(a, b, i) {
                return a * (1 - i) + b * i;
            },
            avg(a, b) {
                return (a + b) / 2;
            },

            // Return element from array that is numerically the closest to the given value
            chooseClosestKey(x, vals) {
                x = parseFloat(x);

                let closest = null;
                let closestDist = null;

                for (let v of vals) {
                    let v_float = parseFloat(v);

                    if (x == v_float) return x;
                    let dist = Math.abs(v_float - x);

                    if (dist < closestDist || closestDist === null) {
                        closestDist = dist;
                        closest = v;
                    }
                }

                return closest;
            },

            // Return value from object whose key is numerically the closest to the given value
            chooseClosestValue(x, obj) {
                let keys = Object.keys(obj);

                let key = this.chooseClosestKey(x, keys);

                return obj[key];
            },

            CtoF(celsius) {
                return celsius * 9/5 + 32;
            },
            FtoC(fahrenheit) {
                return (fahrenheit - 32) * 5/9;
            },

            convertKTAStoKCAS(ktas, altitude, temp) {
                const a0 = 340.29;
                const P0 = 101325;
                const velFactor = 0.514444444;
                const gamma = 1.4;
                const R = 287.053;

                const gMR = 34.163194736310366;

                const unitFactor = 1.94384;

                const tas = velFactor * ktas;
                const altSI = altitude * 0.3048;

                const pSL = 101325;

                const altitudeArray = [
                    0,
                    11000,
                    20000,
                    32000,
                    47000,
                    51000,
                    71000,
                    84852
                ];

                const presRelsArray = [
                    1,
                    2.23361105092158e-1,
                    5.403295010784876e-2,
                    8.566678359291667e-3,
                    1.0945601337771144e-3,
                    6.606353132858367e-4,
                    3.904683373343926e-5,
                    3.6850095235747942e-6
                ];

                const tempsArray = [
                    288.15,
                    216.65,
                    216.65,
                    228.65,
                    270.65,
                    270.65,
                    214.65,
                    186.946
                ];

                const tempGradArray = [
                    -6.5,
                    0,
                    1,
                    2.8,
                    0,
                    -2.8,
                    -2,
                    0
                ];

                // -----------------------

                // Choose index of altitude thats the next lowest value under altSI
                let i = 0;
                while (altSI > altitudeArray[i+1]) {
                  i = i + 1;
                }

                const alts = altitudeArray[i];
                const presRels = presRelsArray[i];
                const temps = tempsArray[i];
                const tempGrad = tempGradArray[i] / 1000;

                const deltaAlt = altSI - alts; 
                const stdTemp = temps + (deltaAlt * tempGrad); // this is the standard temperature at STP

                const tempRaw = (temp + 273.15) - stdTemp;
                const tempSI = stdTemp + tempRaw;

                const sonicSI = Math.sqrt(gamma * R * tempSI);

                const mach = tas / sonicSI;

                let relPres;
                if (Math.abs(tempGrad) < 1e-10) {
                    relPres = presRels * Math.exp(-1 * gMR * deltaAlt / (1000 * temps));
                }
                else {
                    relPres = presRels * Math.pow(temps / stdTemp, gMR / (tempGrad * 1000));
                }

                const pressureSI = pSL * relPres;

                const qc = pressureSI * (
                    Math.pow(
                        (1 + 0.2 * Math.pow(mach, 2) ),
                        (7 / 2)
                    ) - 1
                );

                const cas = a0 * (
                    Math.pow(
                        5 * (
                            Math.pow(
                                ((qc / P0) + 1),
                                (2 / 7)
                            ) - 1
                        ),
                    0.5)
                );

                const outputCAS = cas * unitFactor;

                return outputCAS;
            },

            convertToPressAlt(true_altitude, altimeter) {
                return true_altitude + (altimeter - 29.92) * -1000;
            },

            calculateLegTimeHours(legDistance, legSpeed) {
                return legDistance / legSpeed;
            },

            calculateLegTimeMinutes(legDistance, legSpeed) {
                return this.calculateLegTimeHours(legDistance, legSpeed) * 60;
            },

            formatPressAlt(press_alt) {
                return press_alt.toFixed(0);
            },
            formatTemp(temp) {
                return temp.toFixed(0);
            },
            formatFuelBurn(fuel_burn) {
                return parseFloat(fuel_burn.toFixed(2));
            },
            formatAirspeed(airspeed) {
                return airspeed.toFixed(0);
            },
            formatPower(power) {
                return power.toFixed(0);
            },
            formatDirection(dir) {
                return dir.toFixed(0);
            },
            formatTimeMinutes(minutes) {
                let partial_minutes = minutes % 1;
                let seconds = partial_minutes * 60;

                return Math.floor(minutes).toFixed(0) + ":" + seconds.toFixed(0).padStart(2, '0');
            },

            // convertKTAStoKCAS(ktas) {
            //     if (this.airplaneDataLoaded) {
            //         const flaps = 0;
            //         let kias_vals = Object.keys(this.generalAirspeedCalibrationData[flaps]);
            //         let closest_kias = this.chooseClosestKey(this.cruisePerformanceData.ktas, )
            //     } else {
            //         return null;
            //     }

            // }

            // convertKIAStoKCAS(kias) {
                // if (this.airplaneDataLoaded) {
                //     const flaps = 0;
                //     let kias_vals = Object.keys(this.generalAirspeedCalibrationData[flaps]);
                //     let closest_kias = this.chooseClosestKey(this.cruisePerformanceData.ktas, )
                // } else {
                //     return null;
                // }
            // }
        },
        watch: {
            navlog: {
                handler(newData) {
                    localStorage.navlog = JSON.stringify(newData);
                },
                deep: true,
            }
        }
    }
};