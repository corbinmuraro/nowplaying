$(function() {
	ajaxCall();
});

var currentArtist = "", currentSong = "",
	newArist, newSong, newAlbum, newAlbumArt,
	nowPlaying;

setInterval(ajaxCall, 20000);

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

			newArtist = trackObject.artist["#text"];
			newSong = trackObject.name;

			if ((newSong != currentSong) || (newArtist != currentArtist))
			{
				console.log("NEW SONG PLAYING (in ajax function)");
				currentSong = newSong;
				currentArtist = newArtist;

				// album = trackObject.album["#text"];
				newAlbumArt = trackObject.image[3]["#text"];

				play(trackObject, newArtist,newSong,newAlbumArt);
			}
		}
	});
}

// displays currunt track to the DOM
// RETURNS nothing
function play(trackObj, artist, track, albumArtURL)
{
	isPlaying(trackObj);
	nowPlaying = "Now playing " + track + " by " + artist;

	$('div.text').empty();
	$('div.album').empty();

	$('div.text').append('<div>' + nowPlaying + '</div>');
	$('div.album').append('<img src="' + albumArtURL + ' height="150" width="150" id="art">');

	var rotation = function (){
		$('div.vinyl').rotate({
		  angle:0, 
		  animateTo:360, 
		  callback: rotation,
		  duration: 2000,
		  easing: function (x,t,b,c,d){        // t: current time, b: begInnIng value, c: change In value, d: duration
		      return c*(t/d)+b;
		  }
		});
	};

	rotation();
}



// checks if a song is currently playing
// RETURNS true if playing
// RETURNS false if not playing
function isPlaying(track)
{
	console.log(track);
	if(track.hasOwnProperty('@attr')) 
	{
		if(track['@attr'].hasOwnProperty('nowplaying')) 
		{
			if(track['@attr'].nowplaying == 'true') 
			{
				console.log("true");
				return true;
			}
		}
	}
	else
	{
		console.log("false");
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
