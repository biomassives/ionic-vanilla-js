
![Eco Ops App Image](repository-open-graph-template.png)

# Eco Ops App

Features:

-  Mapping - adding points with map geolocation, associating pictures and waste characterization for locations

-  Accounting for effort - providing a transparent ledger for collectors, processors, transporters, purchasers, and upcycled product producers

  Circular economy supporting nodes 
  ( each node to be shown by use of map icons to emphasize circular economy options )

  :sunrise_over_mountains: * Composting
  :busstop: * Plastics collection facilities ( amounts paid, trade, or requirements met)
  :factory: * Pyrolysis locations
  * Upcycled products - plastics extruding & moulding
  * :fuelpump: plastics to fuel system
  * Eco Ops: Storage, cleaning, sorting & transfer
  * Ocean collection/ beach/ waterway cleanup
  * Activated charcoal from pyrolysis
  * Buyers of compost
  * Participating nurseries/ community gardens
  * Partners organizations
  * Events
  * Learning opportunities


 SDG target 17.3 is to mobilize additional financial resources for developing countries from multiple sources. Eco Ops App aims to do this by developing a climate credit system with a supporting community networking tool that assists in verifying activities that qualify for carbon credits which can be sold on the open market, through partner digital payment processing services, and crypto investments.   

SDG target 17.6 seeks to improve coordination among existing mechanisms in society.  Ec ops app seeks to do this by providing a method that members of schools and churches can log and document activities (photos/ video), while building summary reports of carbon diverted, hours contributed, and expenses incurred.    Our app is designed to have full ledger capabilities with or without internet access.   Data can be exported and shared or uploaded through the app later. 17.7 seeks to promote the development, dissemination, transfer, and diffusion of technology.   17.16  suggests “Global Partnership for Sustainable Development” approach as outlined in the “Addis Ababba Action Agenda” on July 27 2015



# Software

This repository contains an Ionic 6 Vanilla Javascript starter with no framework (no Angular, no React, no Vue...)

## src/ionic.js
This file imports and registers every Ionic component you use in your project.
Most of the components are commented to reduce the bundle size.
So you need to uncomment the components you are going to use in your project.

## src/main.js
This is the entry point. It includes an example of dynamic loading a couple of icons.

## src/Map.js
This is the leaflet entry point.
This implementation stores and reads data from local storage as it loads

## save feature
Designed to connect to  https://supabase.io
Set parameters for url and key in src/Map.js
