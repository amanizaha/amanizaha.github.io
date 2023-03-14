# Procedural generation user study example

This is the interface I used for conducting a user study as part of my [master's thesis](http://kth.diva-portal.org/smash/record.jsf?pid=diva2%3A1661985&dswid=9843). It implements a 2 alternative forced choice (2AFC) study design to find perceived differences between images generated procedurally. See the method described in detail in section 4 of the thesis.

You may modify and use the code for your own project, without attribution or anything.

## How to use

Fork the repo and make your necessary modifications. Read below for a general explanation of how to use it.

### Intro

The participant will first give their consent to partake, then get general instructions, then get to see some reference images to better understand what to look for and compare against. Of these sections, it is recommended to keep the consent close to the way it is, with details changed. The instructions and reference images should be changed according to your needs.

### Image comparison

Images are compared in pairs as specified in the code. Replace the images and the pair configurations with whatever you need. Potentially look at changing the text in the comparison part to suit your needs. In order for the images to load fast when they need to be displayed, they are all fetched when the site is originally loaded, see the bottom of index.html.

### Demographics

Only collect the data you need from users, both whatever data is necessary to analyze the results and come to your conclusions, but also data needed to make sure that the participants are well distributed within the group you're testing. For instance, I did not use the gender data for analysis, only to make sure the participants were evenly distributed and could represent their group.

### Data collection

In each trial, the data saved consists of the name of the selected image, the name of the non-selected image, and whether the selected image was on the left or right. This data from all the trials is collected in an array in the order the trials were in, and combined with the demographic data in a JS object and serialized into JSON.

The action of the data collection form in index.html links to a Google Apps Script that saves the data into a Google Sheet. See the files google/exampleResults.xlsx and google/exampleScript.gs. [This site](https://www.benlcollins.com/spreadsheets/saving-data-in-google-sheets/) seems to explain it pretty well.
