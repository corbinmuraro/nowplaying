$(function() {
	ajaxCall();
});

var timeoutLength = 20000;

var loggedArtist = "", loggedSong = "", loggedAlbumArt = "",
	newArist, recentSong, recentAlbum, recentAlbumArt,
	artistURL, songURL,
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

			songURL = trackObject.url;
			artistURL = trimURL(trackObject.url) + '/';
			// artistURL = trackObject.url

			recentArtist = trackObject.artist["#text"];
			recentSong = trackObject.name;
			recentAlbumArt = trackObject.image[3]["#text"];

			if (isPlaying(trackObject))
			{
				timeoutLength = 20000;

				// checks if the song has changed since the last AJAX call
				if ((recentSong != loggedSong) || (recentArtist != loggedArtist))
				{
					// update loggedSong and loggedArtist variables
					loggedSong = recentSong; 
					loggedArtist = recentArtist;

					// get additional metadata for display purposes
					// album = trackObject.album["#text"];
					
					display(true, recentArtist, recentSong, recentAlbumArt);

					// let's spin that record!
					$('.album').addClass('rotate');
					// $('.album').removeClass('.stopRotate');
				}
			}

			else 
			{
				timeoutLength = 2000000;	// reduce AJAX call rate if no music is playing

				display(false, recentArtist, recentSong, recentAlbumArt);

				$('.album').removeClass('rotate');
				// $('.album').addClass('.stopRotate');

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
		message = "Currently listening to: <a href='" + songURL + "'>" + track + "</a>" + " by " + "<a href='" + artistURL + "'>" + artist + "</a>";
	}
	else
	{
		message = "Last played: <a href='" + songURL + "'>" + track + "</a>" + " by " + "<a href='" + artistURL + "'>" + artist + "</a>";
	}


	$('div.text').empty();
	$('div.album').empty();

	$('div.text').append('<div>' + message + '</div>');
	$('div.album').append('<img src="' + albumArtURL + ' id="art">');
}


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

// trims last.fm song url into a last.fm artist URL
// RETURNS trimmed artist URL string
function trimURL (url) 
{
	var array = url.split('/');
	array.pop();
	array.pop();
	return (array.join('/'));
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
