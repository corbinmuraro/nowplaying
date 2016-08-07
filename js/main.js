$(function() {
	ajaxCall();
});

var timeoutLength = 20000;

var loggedArtist = "", loggedSong = "", loggedAlbumArt = "",
	newArist, recentSong, recentAlbum, recentAlbumArt,
	message;

function ajaxCall() {
	$.ajax({
		type: 'GET',
		url: 'http://ws.audioscrobbler.com/2.0/',
		data: {
			method: 'user.getrecenttracks',
			user: 'corbinmuraro',
			api_key: '1a0f06cdf3adf092204f7fc8a33b09a0',
			format: 'json'
		},
		success: function(tracks) {
			var trackObject = tracks.recenttracks.track[0];

			recentArtist = trackObject.artist["#text"];
			recentSong = trackObject.name;
			recentAlbumArt = trackObject.image[3]["#text"];

			if (isPlaying(trackObject))
			{
				console.log(trackObject);
				timeoutLength = 20000;

				// checks if the song has changed since the last AJAX call
				if ((recentSong != loggedSong) || (recentArtist != loggedArtist))
				{
					console.log("NEW SONG PLAYING");

					// update loggedSong and loggedArtist variables
					loggedSong = recentSong; 
					loggedArtist = recentArtist;

					// get additional metadata for display purposes
					// album = trackObject.album["#text"];
					
					display(true, recentArtist, recentSong, recentAlbumArt);

					spinRecord();
				}
			}

			else 
			{
				timeoutLength = 2000000;	// reduce AJAX call rate if no music is playing

				display(false, recentArtist, recentSong, recentAlbumArt);

				stopRecord();

			}

		}
	});

	setTimeout(ajaxCall, timeoutLength);
}

// displays current track info and artwork to DOM
function display(playing, artist, track, albumArtURL)
{
	if (playing)
	{
		message = "I'm currently listening to " + track + " by " + artist;
	}
	else
	{
		message = "Last played " + track + " by " + artist;
	}


	$('div.text').empty();
	$('div.album').empty();

	$('div.text').append('<div>' + message + '</div>');
	$('div.album').append('<img src="' + albumArtURL + ' height="150" width="150" id="art">');
}

// spins the record recursively
var spinRecord = function (){
	$('div.album').rotate({
	  angle:0, 
	  animateTo:360, 
	  callback: spinRecord,
	  duration: 2000,
	  easing: function (x,t,b,c,d){        // t: current time, b: begInnIng value, c: change In value, d: duration
	      return c*(t/d)+b;
	  }
	});
};

// stops the record spinning
var stopRecord = function(){
	$('div.album').rotate({
	  angle:0, 
	  animateTo:360, 
	  duration: 0,
	  easing: function (x,t,b,c,d){        // t: current time, b: begInnIng value, c: change In value, d: duration
	      return c*(t/d)+b;
	  }
	});
};

// checks if a song is currently playing
// RETURNS true if playing
// RETURNS false if not playing
function isPlaying(track)
{
	if(track.hasOwnProperty('@attr')) 
	{
		if(track['@attr'].hasOwnProperty('nowplaying')) 
		{
			if(track['@attr'].nowplaying == 'true') 
			{
				return true;
			}
		}
	}
	else
	{
		return false;
	}
}


// // RETURNS the song duration in seconds
// function getDuration(track, artist)
// {
// 	$.ajax({
// 		url: 'http://ws.audioscrobbler.com/2.0/',
// 		data: {
// 			method: 'track.getInfo',
// 			track: track,
// 			artist: artist,
// 			api_key: '1a0f06cdf3adf092204f7fc8a33b09a0',
// 			format: 'json'
// 		},
// 		success: function(track) {
// 			var duration = track.track.duration / 1000; // convert ms to sec

// 			// for weird cases, guess that the song is 6 mins long
// 			if ((duration === 0) || (duration === undefined)) 
// 			{
// 				return 360; 
// 			}

// 			else
// 			{
// 				return duration;
// 			}
// 		}
// 	});
// }
