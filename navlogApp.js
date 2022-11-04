const STANDARD_TEMP = 15;

let defaultLeg = {
    distance: 0,
    label: "",
}

let defaultNavlogData = {

    planeType: "cessna172m",

    weight: 2300,

    originICAO: '',
    originCustomTemp: 15,
    originCustomAltim: 29.92,
    originCustomWindDir: 0,
    originCustomWindSpeed: 0,
    originCustomElev: 0,
    originMagVar: 0,

    originTempUseMetar: true,
    originAltimUseMetar: true,
    originWindDirUseMetar: true,
    originWindSpeedUseMetar: true,
    originElevUseMetar: true,

    originAloftDataAltLowerCustom: 3000,
    originAloftDataAltUpperCustom: 6000,
    // Temps aloft
      // Lower
    originTempAloftLowerUseGround: false,
    originTempAloftLowerUseNOAAData: true,
    originTempAloftLowerCustom: 0,
      // Upper
    originTempAloftUpperCustom: 0,


    originWindDataAloftLowerUseGround: false,
    originWindDataAloftLowerUseNOAAData: true,
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

    originAloftDataUpperUseNOAAData: true,

    destICAO: '',
    destTemp: 15,
    destAltim: 29.92,
    destWindDir: 0,
    destWindSpeed: 0,
    destElev: 0,
    destMagVar: 0,

    cruiseAlt: 4500,
    cruiseRPM: 2500,
    cruiseTrueCourse: 0,

    descentRate: 500,

    legDistance: 0,

    legs: [
    ],
};

export let navlogApp = function(airplaneData, windsAloft, airportLatLong) {
    return {
        data() {
            return {
                navlog: defaultNavlogData,
                airplaneData: {},
                windsAloft: {},
                airplaneDataLoaded: false,
                originMetar: null,
                destMetar: null,
            }
        },
        computed: {
            originPressAlt() {
                return this.convertToPressAlt(this.originElev, this.originAltim);
            },
            originTemp() {
                if (this.navlog.originTempUseMetar) {
                    if (!this.originMetar) return 0;

                    return this.originMetar.temperature.celsius;
                } else {
                    return this.navlog.originCustomTemp;
                }
            },
            originAltim() {
                if (this.navlog.originAltimUseMetar) {
                    if (!this.originMetar) return 0;

                    return this.originMetar.barometer.hg;
                } else {
                    return this.navlog.originCustomAltim;
                }
            },
            originWindDir() {
                if (this.navlog.originWindDirUseMetar) {
                    if (!this.originMetar) return 0;

                    return this.originMetar.wind ? this.originMetar.wind.degrees : 0;
                } else {
                    return this.navlog.originCustomWindDir;
                }
            },
            originWindSpeed() {
                if (this.navlog.originWindSpeedUseMetar) {
                    if (!this.originMetar) return 0;

                    return this.originMetar.wind ? this.originMetar.wind.speed_kts : 0;
                } else {
                    return this.navlog.originCustomWindSpeed;
                }
            },
            originElev() {
                if (this.navlog.originElevUseMetar) {
                    if (!this.originMetar) return 0;

                    return this.originMetar.elevation.feet;
                } else {
                    return this.navlog.originCustomElev;
                }
            },


            destTemp() {
                if (this.navlog.destTempUseMetar) {
                    if (!this.destMetar) return 0;

                    return this.destMetar.temperature.celsius;
                } else {
                    return this.navlog.destCustomTemp;
                }
            },
            destAltim() {
                if (this.navlog.destAltimUseMetar) {
                    if (!this.destMetar) return 0;

                    return this.destMetar.barometer.hg;
                } else {
                    return this.navlog.destCustomAltim;
                }
            },
            destWindDir() {
                if (this.navlog.destWindDirUseMetar) {
                    if (!this.destMetar) return 0;

                    return this.destMetar.wind ? this.destMetar.wind.degrees : 0;
                } else {
                    return this.navlog.destCustomWindDir;
                }
            },
            destWindSpeed() {
                if (this.navlog.destWindSpeedUseMetar) {
                    if (!this.destMetar) return 0;

                    return this.destMetar.wind ? this.destMetar.wind.speed_kts : 0;
                } else {
                    return this.navlog.destCustomWindSpeed;
                }
            },
            destElev() {
                if (this.navlog.destElevUseMetar) {
                    if (!this.destMetar) return 0;

                    return this.destMetar.elevation.feet;
                } else {
                    return this.navlog.destCustomElev;
                }
            },
            destPressAlt() {
                return this.convertToPressAlt(this.destElev, this.destAltim);
            },

            originLatLong() {
                return airportLatLong[this.navlog.originICAO];
            },
            destLatLong() {
                return airportLatLong[this.navlog.destICAO];
            },
            tripDistance() {
                if (!this.originLatLong || !this.destLatLong) {
                    return 0;
                }
                return this.getDistanceFromLatLonInNm(this.originLatLong.lat, this.originLatLong.long, this.destLatLong.lat, this.destLatLong.long)
            },
            tripTrueCourse() {
                if (!this.originLatLong || !this.destLatLong) {
                    return 0;
                }
                const course = this.getCourseFromLatLonInDeg(this.originLatLong.lat, this.originLatLong.long, this.destLatLong.lat, this.destLatLong.long)
                if (course > 0)
                    return course;
                else
                    return 360 + course;
            },

            originWindsAloft() {
                if (this.windsAloft && this.windsAloft.parsedProductText && this.windsAloft.parsedProductText.data["LOU"]) {
                    return this.windsAloft.parsedProductText.data["LOU"];
                }
                return null;
            },

            originTempAloftAltLower() {
                // return this.navlog.originTempAloftLowerUseGround ? this.originElev : this.navlog.originAloftDataAltLowerCustom;
                if (this.navlog.originTempAloftLowerUseGround) {
                    // Use temp reported at airport
                    return this.originElev;
                } else {
                    if (this.navlog.originTempAloftLowerUseNOAAData) {
                        // Use temp data acquired directly from NOAA winds aloft API
                        if (!this.originWindsAloft) return this.originElev;

                        let alt = this.chooseClosestKey(this.navlog.originAloftDataAltLowerCustom, Object.keys(this.originWindsAloft));

                        if (this.originWindsAloft[alt]["tempC"] !== null) {
                            return alt;
                        } else {
                            // If altitude too low, temp may not be reported in winds aloft; use origin airport temp
                            return this.originElev;
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
                    return this.originTemp;
                } else {
                    if (this.navlog.originTempAloftLowerUseNOAAData) {
                        // Use temp data acquired directly from NOAA winds aloft API
                        if (!this.originWindsAloft) return 0;

                        let tempAloftAtAlt = this.chooseClosestValue(this.originTempAloftAltLower, this.originWindsAloft);

                        if (tempAloftAtAlt["tempC"] !== null) {
                            return tempAloftAtAlt["tempC"];
                        } else {
                            // If altitude too low, temp may not be reported in winds aloft; use origin airport temp
                            return this.originTemp;
                        }
                    } else {
                        // Use user-entered temp direction
                        return this.navlog.originTempAloftLowerCustom
                    }
                }
            },

            originWindDataAloftAltLower() {
                // return this.navlog.originWindDataAloftLowerUseGround ? this.originElev : this.navlog.originAloftDataAltLowerCustom;
                if (this.navlog.originWindDataAloftLowerUseGround) {
                    // Use wind direction reported at airport
                    return this.originElev;
                } else {
                    if (this.navlog.originWindDataAloftLowerUseNOAAData) {
                        // Use wind data acquired directly from NOAA winds aloft API
                        if (!this.originWindsAloft) return this.originElev;

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
                    return this.originWindDir;
                } else {
                    if (this.navlog.originWindDataAloftLowerUseNOAAData) {
                        // Use wind data acquired directly from NOAA winds aloft API
                        if (!this.originWindsAloft) return 0;

                        let windDataAtAlt = this.chooseClosestValue(this.originWindDataAloftAltLower, this.originWindsAloft);

                        let windDir = windDataAtAlt["windDirectionDegrees"];

                        if (windDir == 'light and variable') {
                            windDir = 0;
                        }

                        return windDir;
                    } else {
                        // Use user-entered wind direction
                        return this.navlog.originWindDirAloftLowerCustom
                    }
                }
            },
            originWindSpeedAloftLower() {
                if (this.navlog.originWindDataAloftLowerUseGround) {
                    // Use wind direction reported at airport
                    return this.originWindSpeed;
                } else {
                    if (this.navlog.originWindDataAloftLowerUseNOAAData) {
                        // Use wind data acquired directly from NOAA winds aloft API
                        if (!this.originWindsAloft) return 0;

                        let windDataAtAlt = this.chooseClosestValue(this.originWindDataAloftAltLower, this.originWindsAloft);

                        let windSpeed = windDataAtAlt["windSpeedKnots"];

                        if (windSpeed == 'light and variable') {
                            windSpeed = 0;
                        }

                        return windSpeed;
                    } else {
                        // Use user-entered wind direction
                        return this.navlog.originWindSpeedAloftLowerCustom
                    }
                }
            },



            originAloftDataAltUpper() {
                if (this.navlog.originAloftDataUpperUseNOAAData) {
                    // Use wind data acquired directly from NOAA winds aloft API
                    if (!this.originWindsAloft) return this.originElev;

                    let alt = this.chooseClosestKey(this.navlog.originAloftDataAltUpperCustom, Object.keys(this.originWindsAloft));

                    return alt;
                } else {
                    // Use user-entered wind direction
                    return this.navlog.originAloftDataAltUpperCustom
                }
            },
            originWindDirAloftUpper() {
                if (this.navlog.originAloftDataUpperUseNOAAData) {
                    // Use wind data acquired directly from NOAA winds aloft API
                    if (!this.originWindsAloft) return 0;

                    let windDataAtAlt = this.chooseClosestValue(this.navlog.originAloftDataAltUpperCustom, this.originWindsAloft);

                    let windDir = windDataAtAlt["windDirectionDegrees"];

                    if (windDir == 'light and variable') {
                        windDir = 0;
                    }

                    return windDir;
                } else {
                    // Use user-entered wind direction
                    return this.navlog.originWindDirAloftUpperCustom
                }
            },
            originWindSpeedAloftUpper() {
                if (this.navlog.originAloftDataUpperUseNOAAData) {
                    // Use wind data acquired directly from NOAA winds aloft API
                    if (!this.originWindsAloft) return 0;

                    let windDataAtAlt = this.chooseClosestValue(this.navlog.originAloftDataAltUpperCustom, this.originWindsAloft);

                    let windSpeed = windDataAtAlt["windSpeedKnots"];

                    if (windSpeed == 'light and variable') {
                        windSpeed = 0;
                    }

                    return windSpeed;
                } else {
                    // Use user-entered wind direction
                    return this.navlog.originWindSpeedAloftUpperCustom
                }
            },
            originTempAloftUpper() {
                if (this.navlog.originAloftDataUpperUseNOAAData) {
                    // Use temp data acquired directly from NOAA winds aloft API
                    if (!this.originWindsAloft) return 0;

                    let windDataAtAlt = this.chooseClosestValue(this.navlog.originAloftDataAltUpperCustom, this.originWindsAloft);

                    if (windDataAtAlt["tempC"] !== null) {
                        return windDataAtAlt["tempC"];
                    } else {
                        // If altitude too low, temp may not be reported in winds aloft; use origin airport temp
                        return this.originTemp;
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
                    let temp_factor = (1 + (0.1 * (this.originTemp - STANDARD_TEMP) / 10));
                    let diff = this.climbPerformanceData.time * temp_factor - this.originClimbPerformanceData.time * temp_factor;
                    return Math.max(diff, 0);
                }
                return 0;
            },
            climbFuelBurned() {
                if (this.climbPerformanceData) {
                    let temp_factor = (1 + (0.1 * (this.originTemp - STANDARD_TEMP) / 10));
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
            climbKCAS() {
                return this.convertKIAStoKCAS(this.climbKIAS);
            },
            climbKTAS() {
                return this.convertKCAStoKTAS(this.climbKCAS, this.navlog.cruiseAlt, this.cruiseTemp);
            },
            climbDistance() {
                return (this.timeToClimb / 60) * this.climbGroundSpeed;
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
            cruiseInterpWindData() {
                // Returns an array [wind direction, wind speed]
                return this.angleLengthInterpolate(
                    this.navlog.cruiseAlt,
                    this.originWindDataAloftAltLower,
                    this.originAloftDataAltUpper,
                    this.originWindDirAloftLower,
                    this.originWindSpeedAloftLower,
                    this.originWindDirAloftUpper,
                    this.originWindSpeedAloftUpper
                )
            },
            cruiseWindDir() {
                return this.cruiseInterpWindData[0];
            },
            cruiseWindSpeed() {
                return this.cruiseInterpWindData[1];
            },
            cruiseTrueHeading() {
                return this.tripTrueCourse + this.cruiseWindCorrectionAngle;
            },
            climbTrueHeading() {
                return this.tripTrueCourse + this.climbWindCorrectionAngle;
            },
            climbMagneticHeading() {
                return this.climbTrueHeading + this.navlog.originMagVar;
            },
            cruiseMagneticHeading() {
                return this.cruiseTrueHeading + this.avg(this.navlog.originMagVar, this.navlog.destMagVar);
            },
            cruisePressAlt() {
                return this.convertToPressAlt(this.navlog.cruiseAlt, this.avg(this.originAltim, this.destAltim));
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
                return this.generalAirplaneData["airspeedCalibration"];
            },
            cruisePerformanceData() {
                if (this.airplaneDataLoaded) {
                    let alt_lower = this.chooseNextLowestKey(this.cruisePressAlt, Object.keys(this.generalCruisePerformanceData));
                    let temp_performance_lower = this.generalCruisePerformanceData[alt_lower];

                    let temp =
                        this.cruiseTemp < (STANDARD_TEMP - 20) ?
                            "below" :
                            this.cruiseTemp > (STANDARD_TEMP + 20) ?
                                "above" :
                                "standard";

                    let rpm_performance = temp_performance_lower[temp];

                    let rpm_lower = this.chooseNextLowestKey(this.navlog.cruiseRPM, Object.keys(rpm_performance));
                    let rpm_data_lower = rpm_performance[rpm_lower];
                    let rpm_higher = this.chooseNextHighestKey(this.navlog.cruiseRPM, Object.keys(rpm_performance));
                    let rpm_data_higher = rpm_performance[rpm_higher];

                    let interpolated_data_lower = {
                        bhp: this.interpolate(this.navlog.cruiseRPM, rpm_lower, rpm_higher, rpm_data_lower.bhp, rpm_data_higher.bhp),
                        ktas: this.interpolate(this.navlog.cruiseRPM, rpm_lower, rpm_higher, rpm_data_lower.ktas, rpm_data_higher.ktas),
                        gph: this.interpolate(this.navlog.cruiseRPM, rpm_lower, rpm_higher, rpm_data_lower.gph, rpm_data_higher.gph),
                    };

                    // -----

                    let alt_higher = this.chooseNextHighestKey(this.cruisePressAlt, Object.keys(this.generalCruisePerformanceData));
                    let temp_performance_higher = this.generalCruisePerformanceData[alt_higher];

                    rpm_performance = temp_performance_higher[temp];

                    rpm_lower = this.chooseNextLowestKey(this.navlog.cruiseRPM, Object.keys(rpm_performance));
                    rpm_data_lower = rpm_performance[rpm_lower];
                    rpm_higher = this.chooseNextHighestKey(this.navlog.cruiseRPM, Object.keys(rpm_performance));
                    rpm_data_higher = rpm_performance[rpm_higher];

                    let interpolated_data_higher = {
                        bhp: this.interpolate(this.navlog.cruiseRPM, rpm_lower, rpm_higher, rpm_data_lower.bhp, rpm_data_higher.bhp),
                        ktas: this.interpolate(this.navlog.cruiseRPM, rpm_lower, rpm_higher, rpm_data_lower.ktas, rpm_data_higher.ktas),
                        gph: this.interpolate(this.navlog.cruiseRPM, rpm_lower, rpm_higher, rpm_data_lower.gph, rpm_data_higher.gph),
                    };

                    let interpolated_data = {
                        bhp: this.interpolate(this.cruisePressAlt, alt_lower, alt_higher, interpolated_data_lower.bhp, interpolated_data_higher.bhp),
                        ktas: this.interpolate(this.cruisePressAlt, alt_lower, alt_higher, interpolated_data_lower.ktas, interpolated_data_higher.ktas),
                        gph: this.interpolate(this.cruisePressAlt, alt_lower, alt_higher, interpolated_data_lower.gph, interpolated_data_higher.gph),
                    };

                    return interpolated_data;
                } else {
                    return null;
                }
            },
            cruiseKCAS() {
                return this.convertKTAStoKCAS(this.cruisePerformanceData.ktas, this.navlog.cruiseAlt, this.cruiseTemp);
            },
            cruiseKIAS() {
                return this.convertKCAStoKIAS(this.cruiseKCAS);
            },
            climbWindCorrectionAngle() {
                return this.calculateWindCorrectionAngle(this.climbKTAS, this.tripTrueCourse, this.originWindDir, this.originWindSpeed);
            },
            cruiseWindCorrectionAngle() {
                if (this.cruisePerformanceData) {
                    return this.calculateWindCorrectionAngle(this.cruisePerformanceData.ktas, this.tripTrueCourse, this.cruiseWindDir, this.cruiseWindSpeed);
                } else {
                    return 0;
                }
            },
            cruiseGroundSpeed() {
                if (this.cruisePerformanceData) {
                    return this.calculateGroundSpeed(this.cruisePerformanceData.ktas, this.cruiseTrueHeading, this.cruiseWindDir, this.cruiseWindSpeed);
                } else {
                    return 0;
                }
            },
            climbGroundSpeed() {
                if (this.cruisePerformanceData) {
                    return this.calculateGroundSpeed(this.climbKTAS, this.cruiseTrueHeading, this.cruiseWindDir, this.cruiseWindSpeed);
                } else {
                    return 0;
                }
            },

            descentEndAlt() {
                return (this.destElev + 1000);
            },
            descentTime() {
                return (this.navlog.cruiseAlt - this.descentEndAlt) / this.navlog.descentRate;
            },
            descentDistance() {
                return (this.descentTime / 60) * this.cruiseGroundSpeed;
            },

            totalLegsDistance() {
                let total = 0;

                for (let leg of this.navlog.legs) {
                    let leg_distance = this.getLegDistance(leg);
                    let leg_speed = this.getLegGroundSpeed(leg);

                    total += leg_distance;
                }

                return total;
            },
            totalLegsTime() {
                let total = 0;

                for (let leg of this.navlog.legs) {
                    let leg_distance = this.getLegDistance(leg);
                    let leg_speed = this.getLegGroundSpeed(leg);

                    total += this.calculateLegTimeMinutes(leg_distance, leg_speed);
                }

                return total;
            },
            totalLegsFuelBurn() {
                if (!this.cruisePerformanceData) return 0;

                let total = 0;

                for (let leg of this.navlog.legs) {
                    let leg_distance = this.getLegDistance(leg);
                    let leg_speed = this.getLegGroundSpeed(leg);

                    total += this.calculateLegTimeHours(leg_distance, leg_speed) * this.cruisePerformanceData.gph;
                }

                return total;
            },

            finalLegDistance() {
                let total = 0;

                for (let leg of this.navlog.legs) {
                    let leg_distance;

                    switch (leg.label) {
                        case this.navlog.destICAO:
                            leg_distance = 0;
                            break;
                        default:
                            leg_distance = this.getLegDistance(leg);
                    }
                    total += leg_distance;
                }

                let remainingDistance = this.tripDistance - total;
                return remainingDistance;
            },
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

            this.airportLatLong = airportLatLong;
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

            angleLengthInterpolate(val, lower, upper, lower_val_angle, lower_val_length, upper_val_angle, upper_val_length) {
                let lower_val_x = Math.cos(this.deg2rad(lower_val_angle)) * lower_val_length;
                let lower_val_y = Math.sin(this.deg2rad(lower_val_angle)) * lower_val_length;

                let upper_val_x = Math.cos(this.deg2rad(upper_val_angle)) * upper_val_length;
                let upper_val_y = Math.sin(this.deg2rad(upper_val_angle)) * upper_val_length;

                let interp_vec = this.vectorInterpolate(val, lower, upper, lower_val_x, lower_val_y, upper_val_x, upper_val_y);

                // Map output of atan2 to 0-360 degrees
                let interp_angle = (Math.atan2(interp_vec[1], interp_vec[0]) * 180 / Math.PI + 360) % 360;
                let interp_length = Math.sqrt(interp_vec[0] * interp_vec[0] + interp_vec[1] * interp_vec[1]);

                return [interp_angle, interp_length];
            },

            vectorInterpolate(val, lower, upper, lower_val_x, lower_val_y, upper_val_x, upper_val_y) {
                if (upper == lower) return [lower_val_x, lower_val_y];

                let i = (val - lower) / (upper - lower);
                return [
                    this.lerp(lower_val_x, upper_val_x, i),
                    this.lerp(lower_val_y, upper_val_y, i)
                ];
            },

            lerp(a, b, i) {
                return a * (1 - i) + b * i;
            },
            avg(a, b) {
                return (a + b) / 2;
            },
            deg2rad(deg) {
                return deg * (Math.PI/180)
            },
            rad2deg(rad) {
                return rad * (180/Math.PI)
            },
            getDistanceFromLatLonInNm(lat1, lon1, lat2, lon2) {
                const R = 6371; // Radius of the earth in km
                const dLat = this.deg2rad(lat2-lat1);
                const dLon = this.deg2rad(lon2-lon1);
                const a = 
                    Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
                    Math.sin(dLon/2) * Math.sin(dLon/2); 
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
                const dKM = R * c; // Distance in km
                const dNM = dKM / 1.852; // Distance in nm

                return dNM;
            },
            getCourseFromLatLonInDeg(lat1, long1, lat2, long2) {
                const deltaLong = this.deg2rad(long2 - long1);
                const lat1rad = this.deg2rad(lat1);
                const long1rad = this.deg2rad(long1);
                const lat2rad = this.deg2rad(lat2);
                const long2rad = this.deg2rad(long2);

                const X = Math.cos(lat2rad) * Math.sin(deltaLong);
                const Y = Math.cos(lat1rad) * Math.sin(lat2rad) - Math.sin(lat1rad) * Math.cos(lat2rad) * Math.cos(deltaLong);
                const theta = Math.atan2(X, Y);
                const thetaDeg = this.rad2deg(theta);

                return thetaDeg
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

            // Return element from array that is either the exact value or the next lowest value compared to the given value (although if none lower exist, use next highest)
            chooseNextLowestKey(x, vals, skip = true) {
                x = parseFloat(x);

                let nextLowest = null;
                let lowestDist = null;

                for (let v of vals) {
                    let v_float = parseFloat(v);

                    if (v_float == x) return v;
                    if (v_float > x && skip) continue;
                    let dist = x - v_float;

                    if (dist < lowestDist || lowestDist === null) {
                        lowestDist = dist;
                        nextLowest = v;
                    }
                }

                // Check if no values lower than x
                if (nextLowest === null) {
                    // If so, return next highest value
                    return this.chooseNextHighestKey(x, vals, skip = false);
                }

                return nextLowest;
            },

            // Return element from array that is either the exact value or the next highest value compared to the given value (although if none higher exist, use next lowest)
            chooseNextHighestKey(x, vals, skip = true) {
                x = parseFloat(x);

                let nextHighest = null;
                let highestDist = null;

                for (let v of vals) {
                    let v_float = parseFloat(v);

                    if (v_float == x) return v;
                    if (v_float < x && skip) continue;
                    let dist = v_float - x;

                    if (dist < highestDist || highestDist === null) {
                        highestDist = dist;
                        nextHighest = v;
                    }
                }

                // Check if no values higher than x
                if (nextHighest === null) {
                    // If so, return next lowest value
                    return this.chooseNextLowestKey(x, vals, skip = false);
                }

                return nextHighest;
            },

            // Return value from object whose key is numerically the closest to the given value
            chooseClosestValue(x, obj) {
                let keys = Object.keys(obj);

                let key = this.chooseClosestKey(x, keys);

                return obj[key];
            },

            // Return value from object whose key is numerically either exactly or the next lowest to the given value
            chooseNextLowestValue(x, obj) {
                let keys = Object.keys(obj);

                let key = this.chooseNextLowestKey(x, keys);

                return obj[key];
            },

            // Return value from object whose key is numerically either exactly or the next highest to the given value
            chooseNextHighestValue(x, obj) {
                let keys = Object.keys(obj);

                let key = this.chooseNextHighestKey(x, keys);

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

            convertKCAStoKTAS(kcas, altitude, temp) {
                const a0 = 340.29;
                const P0 = 101325;
                const velFactor = 0.514444444;
                const gamma = 1.4;
                const R = 287.053;

                const gMR = 34.163194736310366;

                const unitFactor = 1.94384;

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

                let relPres;
                if (Math.abs(tempGrad) < 1e-10) {
                    relPres = presRels * Math.exp(-1 * gMR * deltaAlt / (1000 * temps));
                }
                else {
                    relPres = presRels * Math.pow(temps / stdTemp, gMR / (tempGrad * 1000));
                }

                const pressureSI = pSL * relPres;

                // --------

                const cas = kcas / unitFactor;

                const qc = P0 * (
                    Math.pow(
                        (
                            1 + 0.2 * Math.pow(cas / a0, 2)
                        ),
                        3.5
                    )
                    - 1
                )

                const mach = Math.pow(
                    5 * (
                        Math.pow(
                            ((qc / pressureSI) + 1),
                            (2 / 7)
                        ) - 1
                    ),
                0.5);

                const tas = mach * sonicSI;

                const ktas = tas / velFactor;

                return ktas;

            },
            calculateWindCorrectionAngle(ktas, trueCourse, windDir, windSpeed) {
                let windAngle = windDir - trueCourse;
                let windAngleRad = windAngle * Math.PI / 180;
                let correctionAngleRad = Math.asin(windSpeed * Math.sin(windAngleRad) / ktas);
                let correctionAngle = correctionAngleRad * 180 / Math.PI;

                return correctionAngle;
            },
            calculateGroundSpeed(ktas, trueHeading, windDir, windSpeed) {
                let angle = (trueHeading - windDir) * Math.PI / 180;
                return Math.sqrt(
                    Math.pow(ktas, 2)
                    + Math.pow(windSpeed, 2)
                    - (2 * ktas * windSpeed * Math.cos(angle))
                );
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

            formatAltimeter(altim) {
                return altim.toFixed(2);
            },
            formatDistance(dist) {
                return parseFloat(dist.toFixed(1));
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
            formatLatOrLong(val) {
                return val.toFixed(7);
            },
            formatTimeMinutes(minutes) {
                let partial_minutes = minutes % 1;
                let seconds = partial_minutes * 60;

                return Math.floor(minutes).toFixed(0) + ":" + seconds.toFixed(0).padStart(2, '0');
            },

            addNewLeg() {
                let newLeg = JSON.parse(JSON.stringify(defaultLeg));
                newLeg.label = "New Leg " + (this.navlog.legs.length + 1);
                this.navlog.legs.push(newLeg);

                this.$nextTick(() => this.$refs.legNameInput[ this.$refs.legNameInput.length - 1 ].focus());
            },

            deleteLeg(label) {
                let index = null;
                for (const [i, leg] of this.navlog.legs.entries()) {
                    if (leg.label == label) {
                        index = i;
                        break;
                    }
                }

                if (index !== null) {
                    this.navlog.legs.splice(index, 1);
                }
            },

            deleteAllLegs() {
                this.navlog.legs = [];
            },

            reverseLegs() {
                this.navlog.legs = this.navlog.legs.reverse();
                for (let leg of this.navlog.legs) {
                    if (leg.label == "TOC") {
                        leg.label = "TOD";
                    } else if (leg.label == "TOD") {
                        leg.label = "TOC";
                    }
                }
            },

            isCalculatedLeg(leg) {
                switch (leg.label) {
                    case this.navlog.originICAO:
                    case "TOC":
                    case "TOD":
                    case this.navlog.destICAO:
                        return true;
                    default:
                        return false;
                }
            },

            getLegDistance(leg) {
                switch (leg.label) {
                    case this.navlog.originICAO:
                        return 0;
                    case "TOC":
                        return this.climbDistance;
                    case "TOD":
                        return this.descentDistance;
                    case this.navlog.destICAO:
                        return this.finalLegDistance;
                    default:
                        return leg.distance;
                }
            },

            getLegGroundSpeed(leg) {
                switch (leg.label) {
                    case "TOC":
                        return this.climbGroundSpeed;
                    default:
                        return this.cruiseGroundSpeed;
                }
            },

            reverseOriginDestination() {
                const prevOriginICAO = this.navlog.originICAO;
                const prevOriginMagVar = this.navlog.originMagVar;
                const prevOriginCustomTemp = this.navlog.originCustomTemp;
                const prevOriginCustomElev = this.navlog.originCustomElev;
                const prevOriginCustomAltim = this.navlog.originCustomAltim;
                const prevOriginCustomWindDir = this.navlog.originCustomWindDir;
                const prevOriginCustomWindSpeed = this.navlog.originCustomWindSpeed;

                this.navlog.originICAO = this.navlog.destICAO;
                this.navlog.originMagVar = this.navlog.destMagVar;
                this.navlog.originCustomTemp = this.navlog.destCustomTemp;
                this.navlog.originCustomElev = this.navlog.destCustomElev;
                this.navlog.originCustomAltim = this.navlog.destCustomAltim;
                this.navlog.originCustomWindDir = this.navlog.destCustomWindDir;
                this.navlog.originCustomWindSpeed = this.navlog.destCustomWindSpeed;

                this.navlog.destICAO = prevOriginICAO;
                this.navlog.destMagVar = prevOriginMagVar;
                this.navlog.destCustomTemp = prevOriginCustomTemp;
                this.navlog.destCustomElev = prevOriginCustomElev;
                this.navlog.destCustomAltim = prevOriginCustomAltim;
                this.navlog.destCustomWindDir = prevOriginCustomWindDir;
                this.navlog.destCustomWindSpeed = prevOriginCustomWindSpeed;

                this.reverseLegs();

            },

            download(filename, text) {
                var element = document.createElement('a');
                element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
                element.setAttribute('download', filename);

                element.style.display = 'none';
                document.body.appendChild(element);

                element.click();

                document.body.removeChild(element);
            },

            downloadData() {
                let filename = `${this.navlog.originICAO}-to-${this.navlog.destICAO}-navlog.json`;
                this.download(filename, JSON.stringify(this.navlog));
            },

            fileDropped(event) {
                event.preventDefault();

                if (event.dataTransfer.files.length) {
                    let file = event.dataTransfer.files[0];

                    let self = this;

                    file.text()
                    .then(function (data) {
                        let json_data;

                        try {
                            json_data = JSON.parse(data);
                        } catch (e) {
                            if (e instanceof SyntaxError) {
                                console.log("Dropped file was not a valid JSON file");
                                return;
                            } else {
                                throw e;
                            }
                        }

                        self.navlog = json_data;
                    });
                }

                this.fileDragEnd(event);
            },

            fileDragStart(event) {
                event.preventDefault();
                event.target.classList.add("dragged-over");
            },

            fileDragEnd(event) {
                event.preventDefault();
                event.target.classList.remove("dragged-over");
            },

            invertKeyValues(obj, floats = false){
                var retobj = {};
                for(var key in obj){
                    let val = floats ? parseFloat(key) : key;
                    retobj[obj[key]] = val;
                }
                return retobj;
            },

            convertKCAStoKIAS(kcas) {
                if (this.airplaneDataLoaded) {
                    const flaps = 0;
                    let IAStoCAS = this.generalAirspeedCalibrationData[flaps];
                    let CAStoIAS = this.invertKeyValues(IAStoCAS, true);
                    let closest_kias = this.chooseClosestValue(kcas, CAStoIAS);
                    return closest_kias;
                } else {
                    return 0;
                }
            },

            convertKIAStoKCAS(kias) {
                if (this.airplaneDataLoaded) {
                    const flaps = 0;
                    let IAStoCAS = this.generalAirspeedCalibrationData[flaps];
                    let closest_kcas = this.chooseClosestValue(kias, IAStoCAS);
                    return closest_kcas;
                } else {
                    return 0;
                }
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
            },
            "navlog.originICAO"(icao) {
                let icao_regex = /^\w{4}$/;
                if (!icao.match(icao_regex)) return;

                this.$el.parentNode.classList.add("loading");
                let self = this;
                $.getJSON('api/metar/' + icao, function(data) {
                    self.originMetar = data;
                })
                .always(function() {
                    self.$el.parentNode.classList.remove("loading");
                });
            },
            "navlog.destICAO"(icao) {
                let icao_regex = /^\w{4}$/;
                if (!icao.match(icao_regex)) return;

                this.$el.parentNode.classList.add("loading");
                let self = this;
                $.getJSON('api/metar/' + icao, function(data) {
                    self.destMetar = data;
                })
                .always(function() {
                    self.$el.parentNode.classList.remove("loading");
                });
            },
        }
    }
};