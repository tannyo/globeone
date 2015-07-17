# GlobeOne Public Website

https://www.globeone.com

## Why This is Here

My personal repository of the GlobeOne website to make sure that everything is backed up. I had to do this because our SVN had become unstable. I got permission from my boss, Alex Sundukovskiy. He agreed since the site is public and anyone can spider the website to get the source since everything is a text file.

## Requirements
This site is designed to run on an Apache server as it uses server side includes and in the footer.html file calculates the copyright year.

To facilitate debugging with a non-Apache server like [http-server](https://github.com/indexzero/http-server), the startup.js file includes code to emulate server side includes using ajax calls. 
