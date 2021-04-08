# Fork of Sequences Sunburst, personalized for baseball at-bat pitch sequences

Original Sunburst Sequence:
https://observablehq.com/@kerryrodden/sequences-sunburst@487

//-----------------------------------------------------------------------------//

Front-End Technologies used: JavaScript, HTML5, CSS3, D3.js

Back-end Technologies used: Node.js, GithubPages

About: This is used to display the sequence of pitches in a baseball At-Bat, along with the outcome of the At-Bat. The inner-most ring shows the outcome of the At-Bat (strikeout, single, groundout, etc.). Green arc's represent a positive outcome (when the batter is out), and red arc's represent a negative outcome (when the batter reached base). Moving outwards, the next ring shows the first pitch of the At-Bat, and then the second pitch, third pitch, etc. The different shades of blue represent the different types of pitches the pitcher is throwing.

Hover over an area of the visualization to show what percentage of At-Bat's follow that pitch sequence. Hovering will also show the order of the pitches, and the result of each pitch (ball, strike, foul, in play) in the upper left hand corner. The count (balls and strikes) is also displayed directly under this text sequence.

![Alt Text](https://github.com/Morganhtrotter/PitchSequences/blob/master/files/sunburstHover.gif)

Click the buttons to switch visualize a different data set.

![Alt Text](https://github.com/Morganhtrotter/PitchSequences/blob/master/files/switchDataSequences.gif)

This program utilizes LocalStorage to persist changes in visualizing different data sets across various page loads:

      var mySession = localStorage.getItem('mySession');
      if (mySession) {
          try {
              mySession = JSON.parse(localStorage.getItem('mySession'));
          } catch (e) {
              console.log(e);
              mySession = {};
          }
          restoreSession(mySession);
      } else {
          localStorage.setItem('mySession', '{}');
      }

      $("jimmy").onclick = function() { setSessionItem('foo', true); location.reload(); };
      $("jonny").onclick = function() { setSessionItem('foo', false); location.reload(); };

//-----------------------------------------------------------------------------//

View this notebook in your browser by running a web server in this folder. For
example:

~~~sh
python -m SimpleHTTPServer
~~~

Or, use the [Observable Runtime](https://github.com/observablehq/runtime) to
import this module directly into your application. To npm install:

~~~sh
npm install @observablehq/runtime@4
npm install https://api.observablehq.com/@kerryrodden/sequences-sunburst.tgz?v=3
~~~

Then, import your notebook and the runtime as:

~~~js
import {Runtime, Inspector} from "@observablehq/runtime";
import define from "@kerryrodden/sequences-sunburst";
~~~

To log the value of the cell named “foo”:

~~~js
const runtime = new Runtime();
const main = runtime.module(define);
main.value("foo").then(value => console.log(value));
~~~
