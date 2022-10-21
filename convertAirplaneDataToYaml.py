import os
from airplaneData import airplaneData

outputFilename = "airplaneData.yml"

dirname = os.path.dirname(__file__)
outputFilepath = os.path.join(dirname, outputFilename)

output = ""

def addToOutput(s = "\n"):
    global output
    output += s

def printVals(vals):
    for j, val_line in enumerate(vals.split("\n")):
        val_line = val_line.strip()
        rpm = rpm_vals[j]
        [bhp, ktas, gph] = val_line.split()
        addToOutput(
"""
                %s:
                    bhp: %s
                    ktas: %s
                    gph: %s
""" % (rpm, bhp, ktas, gph))


for planeName, data in airplaneData.items():

    print("Digitizing data for \"%s\"..." % planeName)

    # Plane name
    addToOutput("""
%s:""" % (planeName))



    # Label
    label = data["label"]

    addToOutput("""
    label: \"%s\"""" % (label))



    # Cruise performance
    addToOutput("""
    cruisePerformance:
        # Pressure Altitude""")

    cruiseData = data["cruisePerformance"]

    cols = cruiseData["cols"]
    below_vals = cruiseData["below_vals"]
    standard_vals = cruiseData["standard_vals"]
    above_vals = cruiseData["above_vals"]

    press_alts = list(cols.keys())

    for i, press_alt in enumerate(press_alts):

        addToOutput("""
        %s:
            # Temperature""" % (press_alt))

        rpm_vals = cols[press_alt]

        addToOutput("""
            below:
                # RPM""")
        printVals(below_vals[i])

        addToOutput("""
            standard:
                # RPM""")
        printVals(standard_vals[i])

        addToOutput("""
            above:
                # RPM""")
        printVals(above_vals[i])



    # Airspeed calibration
    addToOutput("""
    airspeedCalibration:
        # Flaps amount (deg)""")
    airspeed_cal_data = data["airspeedCalibration"]

    for flaps_val, cal_data in airspeed_cal_data.items():
        addToOutput("""
        %s:
            # KIAS: KCAS""" % (flaps_val))

        for kias, kcas in cal_data.items():
            addToOutput("""
            %s: %s""" % (kias, kcas))

    # Climb performance
    addToOutput("""
    climbPerformance:
        # Weight (lbs)""")
    climb_performance_data = data["climbPerformance"]

    for weight, climb_alt_data in climb_performance_data.items():
        addToOutput("""
        %s:
            # Press. Altitude""" % (weight))

        for press_alt, climb_data in climb_alt_data.items():
            addToOutput("""
            %s:""" % (press_alt))

            for key, val in climb_data.items():
                addToOutput("""
                %s: %s""" % (key, val))

    # Taxi performance
    addToOutput("""
    taxiPerformance:""")
    taxi_data = data["taxiPerformance"]

    for key, val in taxi_data.items():
        addToOutput("""
        %s: %s""" % (key, val))

    print()

with open(outputFilepath, 'w') as f:
    f.write(output)

print("Finished writing cruise performance data to %s" % (outputFilepath))