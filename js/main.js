$(function() {
	ajaxCall();
});

var currentArtist = "", currentSong = "",
	newArist, newSong, newAlbum, newAlbumArt,
	nowPlaying;



var container = $('div.container');

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

			isPlaying(trackObject);

			newArtist = trackObject.artist["#text"];
			newSong = trackObject.name;

			if (!isPlaying(newSong, newArtist))
			{
				stop();
			}

			if ((newSong != currentSong) || (newArtist != currentArtist))
			{
				currentSong = newSong;
				currentArtist = newArtist;

				// album = trackObject.album["#text"];
				newAlbumArt = trackObject.image[3]["#text"];

				// getDuration(currentSong, currentArtist);

				play(newArtist,newSong,newAlbumArt);
			}
		}
	});
}

// displays currunt track to the DOM
// RETURNS nothing
function play(artist, track, albumArtURL)
{
	nowPlaying = "Now playing " + track + " by " + artist;

	container.empty();
	container.append('<div>' + nowPlaying + '</div>');
	container.append('<img src="' + albumArtURL + '" height="150" width="150">');
}

// checks if a song is currently playing
// RETURNS true if playing
// RETURNS false if not playing
function isPlaying(track)
{
	console.log(track);
	if(track.hasOwnProperty('@attr')) {
		if(track['@attr'].hasOwnProperty('nowplaying')) {
			if(track['@attr'].nowplaying == 'true') {
				return true;
			}
		}
	}

	console.log('false');
	return false;
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
