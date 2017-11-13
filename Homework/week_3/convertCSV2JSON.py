import csv
import json


# From: https://stackoverflow.com/questions/19697846/python-csv-to-json
csvfile = open('KNMI_20161231_reduced.csv', 'r')
jsonfile = open('Rainsum.json', 'w')

fieldnames = ("Station", "Date", "Rainfall sum in 0.1mm")
reader = csv.DictReader( csvfile, fieldnames)
for row in reader:
    json.dump(row, jsonfile)
    jsonfile.write('\n')
