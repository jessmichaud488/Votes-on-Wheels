<h1>V O T E S on W H E E L S</h1>

![Landing Page](https://github.com/jessmichaud488/Votes-on-Wheels/blob/master/public/images/Homepage.png?raw=true)

![User Registration Page](https://github.com/jessmichaud488/Votes-on-Wheels/blob/master/public/images/UserRegistration.png?raw=true)

![User Dashboard](https://github.com/jessmichaud488/Votes-on-Wheels/blob/master/public/images/UserDashboard.png?raw=true)

![How It Works](https://github.com/jessmichaud488/Votes-on-Wheels/blob/master/public/images/HowItWorks.png?raw=true)

![Contact Us](https://github.com/jessmichaud488/Votes-on-Wheels/blob/master/public/images/ContactUs.png?raw=true)

<h2>USE CASE</h2>
<p>Inspired by the events in Jefferson County, GA in 2018, this app is designed to be a ride share app that connects voting individuals with transportation limitations with volunteers in their area who are willing to give them a ride to their local polling station.</p>

<h2>HOW IT WORKS</h2>
<h3>For Voters</h3>
<p>Potential voters can create an account in the app, select the date of their election and a time at which they would like a ride to vote. They will then see a list of potential drivers in their area and selected timeframe. The ride is intended to be to the polling station and back to the voter’s point of origin.</p>

<h3>For Drivers</h3>
<p>Potential volunteer drivers can create an account in the app and set up their availability on the election day. They will then see a list of voters in their area and timeframe who need rides to their polling station. The ride is intended to be to the polling station and back to the voter’s point of origin.</p>

<h2>FUNCTIONALITY</h2>
<p>This app's functionality includes:</p>
<ul>
	<li>Access to demo accounts to try the app out before signing up</li>
	<li>Signing up as a voter or as a driver</li>
	<li>Logging in as a voter or as a driver</li>
	<li>Ability to save account details</li>
	<li>As a voter, the ability to set the date and time for a ride</li>
	<li>As a driver, the ability to set the date and time available to drive</li>
	<li>Ability to see potential drivers or voters in the area in the selected      timeframe</li> 
</ul>


<H2>APPLICATION WEBSITE</h2>
<p>A working prototype of this app can be viewed at <a href="https://jessmichaud488.github.io/https-jessmichaud488.github.io-Votes-on-Wheels-/">https://jessmichaud488.github.io/https-jessmichaud488.github.io-Votes-on-Wheels-/</a></p>


<h2>RESPONSIVE DESIGN</h2>
<p>This app is built to be responsive across mobile, tablet, laptop, and desktop screens.</p>

<h2>SECURITY</h2>
<p>User passwords are encrypted using bcrypt.js</p>

<h2>TECHNOLOGY</h2>
<h3>Front End</h3>
<ul>
	<li>HTML</li>
	<li>CSS</li>
	<li>JavaScript</li>
	<li>jQuery</li>
	<li>Moment.js</li>
	<li>Animate.css</li>
	<li>FontAwesome</li>
	<li>AJAX JSON calls to the app's API</li>
</ul>

<h3>Back End</h3>
<ul>
	<li>Node.js</li>
	<li>Express</li>
	<li>Mocha</li>
	<li>Chai</li>
	<li>MongoDB</li>
	<li>Mongoose</li>
	<li>bcryptjs</li>
	<li>Passport</li>
</ul>

<h3>Programs</h3>
<ul>
	<li>Heroku</li>
	<li>TravisCI</li>
</ul>

<h2>API Documentation</h2>
<p>API endpoints for the back end include:</p>
<ul>ADMIN
	<li>GET to '/' to view multiple admin profiles whether with queries or none</li>
	<li>GET to '/driververify' to view all drivers waiting for verification</li>
	<li>GET to '/voterverify' to view all voters waiting for verification</li>
	<li>POST to '/' to create a single admin account/profile</li>
	<li>PUT to '/:id' update a specific admin account/profile by ID</li>
	<li>PUT to '/driververify/:id' to update a driver profile/account verified property by ID</li>
	<li>PUT to '/voterverify/:id' to update an voter profile/account verified property by ID</li>
	<li>DELETE to '/:id' to disable a specific admin profile/account by setting isActive to false by ID</li>
</ul>

<ul>DRIVER
	<li>GET to '/' to view multiple driver profiles whether with queries or none</li>
	<li>GET to '/:id' to view a single driver account/profile by ID</li>
	<li>GET to '/:id/schedules' to view a single driver's schedule</li>
	<li>POST to '/' to create a new driver profile/account</li>
	<li>POST to '/:id/schedules' to post a driver schedule by ID</li>
	<li>PUT to '/:id' to update a specific driver account/profile by ID</li>
	<li>PUT to '/:id/schedules' to update the schedule settings of a driver by ID</li>
	<li>DELETE to '/:id' to disable a specific driver profile/account by setting isActive to false by ID</li>
</ul>

<ul>VOTER
	<li>GET to '/' to view voter profiles whether with queries or none</li>
	<li>GET to '/:id' to view a single voter account/profile by ID</li>
	<li>GET to '/:id/schedules' to view a single voter schedules</li>
	<li>POST to '/' to create a new voter profile/account</li>
	<li>POST to '/:id/schedules' to post a schedule request for a ride by ID</li>
	<li>PUT to '/:id' to update a specific voter account/profile by ID</li>
	<li>PUT to '/:id/schedules' to update the schedule settings of a voter by ID</li>
	<li>DELETE to '/:id' to disable a specific voter profile/account by setting isActive to false by ID</li>
</ul>

<ul>SCHEDULES
	<li>GET to '/' to view multiple schedules whether there is query or not</li>
	<li>GET to '/:id' to get the schedule of a specific driver by ID</li>
	<li>PUT to '/:schedId' to book an available date from a driver schedule</li>
</ul>

<h2>DEVELOPMENT</h2>
<p>Future updates for V2 are expected to include:</p>
<ul>
	<li>View of drivers/voters in area (set up for)</li>
	<li>Search for polling station</li>
	<li>Message system for voters and drivers<li>
</ul>
