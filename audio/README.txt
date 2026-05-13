AUDIO FILES
===========

This folder contains three 1-second silent placeholder MP3s. They 
ensure the hero ambient sound feature initializes cleanly without 
network errors. To enable actual audio on your site, replace the 
three files (keeping the exact same filenames) with your own 
royalty-free tracks.

To enable ambient audio on your site:

1. Source three royalty-free background music tracks. Free options 
   include:
   - https://pixabay.com/music/
   - https://freemusicarchive.org/
   - https://www.bensound.com/

   Make sure the license allows commercial use on a public website.
   "Royalty-free" does not always mean "free to use" — check terms.

2. Convert each track to MP3 at ~96 kbps mono for fast loading. 
   You can do this in Audacity (free) or with ffmpeg:
   
       ffmpeg -i source.mp3 -b:a 96k -ac 1 ambient-1.mp3

3. Save them in this folder with these exact filenames:
   - ambient-1.mp3
   - ambient-2.mp3
   - ambient-3.mp3

4. Refresh your site. The audio toggle in the hero will activate.

To disable the feature entirely, remove the audio toggle button 
from index.html (search for "audioToggle"), and delete the 
initHeroAmbience() function in script.js.