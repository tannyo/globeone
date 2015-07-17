# GlobeOne Public Website

https://www.globeone.com

## Why This is Here

My personal repository of the GlobeOne website to make sure that everything is backed up. I had to do this because our SVN had become unstable. I got permission from my boss, Alex Sundukovskiy. He agreed since the site is public and anyone can spider the website to get the source since everything is a text file.

## Requirements
This site is designed to run on an Apache server as it uses server side includes and in the footer.html file calculates the copyright year.

To facilitate debugging with a non-Apache server like [http-server](https://github.com/indexzero/http-server), the startup.js file includes code to emulate server side includes using ajax calls which is never intended to run on a production site.

## Performance

Every opportunity is taken to lazy load resources so the user can see the website as soon as possible.

When I last updated this site it scored in the top 6% for load times at http://webpagetest.org. This despite having a number of full width images on each page. 

The site uses bootstrap and custom CSS to make it responsive.

With the exception of javascript files every file is cached and all files that can be use gzip compression.

Picture images are saved as small as possible and use the progressive flag so the image appears slightly blurry then sharpens as it loads instead of painting top to bottom.

Icons default to SVG images and fallback to PNG for browsers that don't support SVG.

The HTML is kept as small as possible despite using bootstrap. Forms are custom HTML to decrease size and are dynamically loaded as needed.

The video on the home page is loaded on demand when the user clicks or taps the play button. This improves performance by not loading the video iframe when the page is loaded.

Script files are loaded asynchronously after jQuery is loaded.

The pages use the Helvetica Nueue font, but the font is only loaded if the device does not have the font.

Language is automatically detected and the page is directed to their language choice if supported. Eight languages are supported with a ninth waiting for approval.

## SEO

I worked very hard with the director of marketing, Michael Wolper to reduce the size of content, speak directly, and to delete marketing speak.

I made use of a sitemap.xml file and the herflang link attribute.

For a small bump in SEO we used https to display the website.

After a few weeks we went from the 9th page on a Google search for GlobeOne to the top 3 of the 1st page.

Good content is always the best SEO.

## Tracking 
Each page reports to Google Analytics.

The video state as to whether a user clicked, stopped, skipped, or finished viewing the video was tracked to Google Analytics.

## Design Considerations

We made use of large font sizes to make the content easier to read.

Content was carefully aligned with images for proper art direction on any width screen.

Form element font size was set to 16px to prevent auto zoom of input elements on mobile devices, giving maximum readability.

## Legal 

At the time this site was public some content was undergoing legal review and certain items had to be changed. When we got a new COO, he decided that we were not going to do any in house programming so while the site was up for many months, changes for legal purposes were never made. Since they got rid of all their internal programmers they no longer had staff to change the website. I believe this is the reason the marketing department changed to a WordPress site with far fewer features and much slower performance. I also noticed that the language menu disappears after displaying on mobile devices.

