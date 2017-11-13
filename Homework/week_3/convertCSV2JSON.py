# convertCSV2JSON.py
#
# converts a csv file into a json file
#
# Xander Locsin 10722432
# 13-11-2017
# ------------------------------------------
import csv
import json


# From: https://stackoverflow.com/questions/19697846/python-csv-to-json
csvfile = open('KNMI_20161231_reduced.csv', 'r')
jsonfile = open('Rainsum.json', 'w')

fieldnames = ("Station", "Date", "Rainsum")
reader = csv.DictReader(csvfile, fieldnames)
for row in reader:
    json.dump(row, jsonfile)
    jsonfile.write('\n')
