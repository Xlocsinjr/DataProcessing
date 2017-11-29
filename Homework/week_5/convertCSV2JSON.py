# convertCSV2JSON.py
#
# converts a csv file into a json file
#
# Xander Locsin 10722432
# ------------------------------------------
import csv
import json

# Opens files
csvfile = open('KNMI_20171031_reduced.csv', 'r')

# Starts jsonfile with opening bracket, then iterate through every row in csv
jsonfile1 = open('temperatures240.json', 'w')
jsonfile2 = open('temperatures344.json', 'w')
jsonfile3 = open('temperatures370.json', 'w')
jsonfile1.write("[")
jsonfile2.write("[")
jsonfile3.write("[")

for row in csvfile:
    dictionary = {}

    # Split row at ","
    new_row = row.split(",")

    # Forms a string for the date to put in the dictionary
    date_string = new_row[1][:4] + "-" + new_row[1][4:6] + "-" + new_row[1][6:]
    dictionary["date"] = date_string

    # Formats average, minimum and maximum temperature per day
    T_av = int(new_row[2].strip()) * 0.1
    dictionary["average"] = round(T_av, 1)

    T_min = int(new_row[3].strip()) * 0.1
    dictionary["minimum"] = round(T_min, 1)

    T_max = int(new_row[4].strip()) * 0.1
    dictionary["maximum"] = round(T_max, 1)


    # Dumps the dictionary as a row in the json
    if new_row[0].strip() == '240':
        json.dump(dictionary, jsonfile1)
        jsonfile1.write(",")
    if new_row[0].strip() == '344':
        json.dump(dictionary, jsonfile2)
        jsonfile2.write(",")
    if new_row[0].strip() == '370':
        json.dump(dictionary, jsonfile3)
        jsonfile3.write(",")

# Overwrites last "," with a closing bracket
jsonfile1.seek(-1, 1)
jsonfile1.write("]")
jsonfile2.seek(-1, 1)
jsonfile2.write("]")
jsonfile3.seek(-1, 1)
jsonfile3.write("]")
