##!/usr/bin/env python
# Name: Xander Locsin
# Student number: 10722432
'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''
import csv

from pattern.web import URL, DOM

# To subvert unicode error
import sys
reload(sys)
sys.setdefaultencoding("utf8")

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    '''
    Extract a list of highest rated TV series from DOM (of IMDB page).

    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    '''

    tv = []

    # Iterates over the series by looking for the div.lister-item-content tag.
    for series in dom.by_tag('div.lister-item-content'):
        serie = []

        # Finds information by looking for specific tags
        title = series.by_tag('a')[0].content
        rating = series.by_tag('strong')[0].content
        genre = series.by_class('genre')[0].content
        runtime = series.by_class('runtime')[0].content

        # Generates a comma separated string of actors.
        actor = ""
        for i in range(len(series.by_tag('p')[2].by_tag('a'))):
            if i > 0:
                actor += ", "
            actor += series.by_tag('p')[2].by_tag('a')[i].content

        # Appends the information to the serie list.
        serie.append(title)
        serie.append(rating)
        serie.append(genre.strip())
        serie.append(actor)
        serie.append(runtime)

        # Appends the serie to the tv list.
        tv.append(serie)

    return tv


def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest rated TV-series.
    '''
    writer = csv.writer(f)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    for i in range(len(tvseries)):
        writer.writerow(tvseries[i])

    # ADD SOME CODE OF YOURSELF HERE TO WRITE THE TV-SERIES TO DISK

if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)
