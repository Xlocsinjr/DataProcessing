# convertCSV2JSON.py
#
# converts a csv file into a json file and averages the rainfall sum in a day
# per month
#
# Xander Locsin 10722432
# 15-11-2017
# ------------------------------------------
import csv
import json

# Opens files
csvfile = open('KNMI_20171112_reduced.csv', 'r')
jsonfile = open('Rainsum.json', 'w')

# Iterate through every row
for row in csvfile:
    dictionary = {}

    # Split row at "," and remove station number
    new_row = row.split(",")
    del new_row[0]

    # Forms a string for the date to put in the dictionary
    date_string = new_row[0][:4] + "-" + new_row[0][4:6] + "-" + new_row[0][6:]
    dictionary["date"] = date_string

    # Calculates rainfall per day in millimeters and adds it to the dictionary
    rain = int(new_row[1].strip()) * 0.1
    dictionary["rainfall"] = round(rain, 1)

    # Dumps the dictionary as a row in the json
    json.dump(dictionary, jsonfile)
    jsonfile.write("\n")
