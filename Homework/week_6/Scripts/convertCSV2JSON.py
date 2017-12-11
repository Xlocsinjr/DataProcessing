# convertCSV2JSON.py
#
# converts a csv file into a json file
#
# Xander Locsin 10722432
# ------------------------------------------
import csv
import json
import os

scriptDir = os.path.dirname(os.path.dirname(__file__))
dataDir = os.path.join(scriptDir, "Data")

def main():
    converter("Data/DeBilt.csv", "Data/DeBilt.json")
    converter("Data/Eindhoven.csv", "Data/Eindhoven.json")
    converter("Data/Leeuwarden.csv", "Data/Leeuwarden.json")
    converter("Data/Schiphol.csv", "Data/Schiphol.json")
    converter("Data/Vlissingen.csv", "Data/Vlissingen.json")


def converter(csvFileName, jsonFileName):
    csvFilePath = os.path.join(scriptDir, csvFileName)
    csvFile = open(csvFilePath, "r")

    # Starts jsonfile with opening bracket, then iterate through every row in csv
    jsonFilePath = os.path.join(scriptDir, jsonFileName)
    jsonFile = open(jsonFilePath, "w+")
    jsonFile.write("[")

    firstRow = True
    for row in csvFile:
        dictionary = {}
        new_row = row.split(",")

        # Forms a string for the date to put in the dictionary
        #new_row[1][:4] + "-" + new_row[1][4:6] + "-" + new_row[1][6:]
        date_string = new_row[1]
        dictionary["date"] = date_string

        # Formats average, minimum and maximum temperature per day
        T_av = int(new_row[2].strip()) * 0.1
        dictionary["average"] = round(T_av, 1)

        T_min = int(new_row[3].strip()) * 0.1
        dictionary["minimum"] = round(T_min, 1)

        T_max = int(new_row[4].strip()) * 0.1
        dictionary["maximum"] = round(T_max, 1)

        # Dumps the dictionary as a row in the json
        if not firstRow:
            jsonFile.write(",")

        json.dump(dictionary, jsonFile)
        firstRow = False

    # Overwrites last "," with a closing bracket
    jsonFile.write("]")

if __name__ == '__main__':
    main()
