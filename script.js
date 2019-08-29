var input = document.getElementById('input-box');
var search = document.getElementById('button-addon2');
var searchURL = 'https://youtubeaccess-xcjreubccu.now.sh/search';
var redirect = 'https://youtubeaccess-xcjreubccu.now.sh/download?id=';
var redirectmp3 = 'https://youtubeaccess-xcjreubccu.now.sh/downloadmp3?id=';
var thumbnail = 'https://youtubeaccess-xcjreubccu.now.sh/thumbnail?id=';
var redirectWatch = 'https://youtubeaccess-xcjreubccu.now.sh/watch?id=';
var close = document.querySelector('.close');
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var Exit = document.getElementsByClassName('exit')[0];
var video = document.getElementsByTagName('video')[0];


Exit.addEventListener('click', () => {
	Exit.parentNode.style.display = 'none';
	video.pause();
});

close.addEventListener('click', () => {
	close.parentNode.style.display = 'none';
});
input.addEventListener('keyup', (e) => {
	if (e.keyCode == 13) {
		sendSearch(input.value);
	}
});


search.addEventListener('click', () => {
	sendSearch(input.value);
});




function sendSearch(data) {
	document.querySelector('#loading').style.display = 'initial';
	var videos = document.querySelectorAll('.videos');
	if (videos[0]) {
		var parentElement = videos[0].parentNode;
	}
	for (var i = 0; i < videos.length; i++) {
		parentElement.removeChild(videos[i]);
	}
	fetch(searchURL, {
		method: 'POST',
		body: JSON.stringify({
			term: data
		}),
		headers: {
			'content-type': 'application/json'
		}
	}).then(res => res.json())
		.then(json => process(json));
}

function process(json) {
	document.querySelector('#loading').style.display = 'none';
	console.log(json[0].pages);
	json.forEach((data) => {
		var cardClone = document.getElementById('template').cloneNode(true);
		cardClone.childNodes[1].getElementsByClassName('thumbnail')[0].src = thumbnail+data.videoId;
		cardClone.childNodes[1].getElementsByClassName('video-title')[0].innerText = data.title;
		cardClone.childNodes[1].getElementsByClassName('channel-name')[0].innerText = data.channelTitle;
		cardClone.childNodes[1].getElementsByClassName('video-description')[0].innerText = data.description;
		cardClone.childNodes[1].getElementsByClassName('video-id')[0].innerText = 'ID: ' + data.videoId;
		var duration = data.duration.match(/\d+(M|S|H)/gi);
		duration = duration.join('').slice(0,-1).replace(/(H|M)/gi,':');
		var splitted = duration.split(':');
		for (var k = 0;k < splitted.length;k++) {splitted[k] = ('0'+splitted[k]).slice(-2);}
		duration = splitted.join(':');
		
		cardClone.childNodes[1].getElementsByClassName('duration')[0].innerText = 'Duration: ' + duration;
		var views = data.views;
		if (views.length >= 10) {
			views = views.slice(0,1)+'B';
		} else if (views.length >= 7) {
			views = views.slice(0,-6)+'M';
		} else if (views.length >= 4) {
			views = views.slice(0,-3)+'K';
		}
		cardClone.childNodes[1].getElementsByClassName('views')[0].innerText = views+' views';
		
		var date = data.publishedAt.slice(0,10);
		date = `${date.slice(8,10)} ${months[date.slice(5,7)-1]} ${date.slice(0,4)}`;
		cardClone.childNodes[1].getElementsByClassName('published-at')[0].innerText = 'Published At ' + date;
		cardClone.removeAttribute('id');
		cardClone.className = 'card mx-auto videos';
		cardClone.style.display = 'block';
		document.getElementById('main-container').appendChild(cardClone);
	});
	
}

function sendToDownload(element,format) {
	var videoId = element.parentNode.querySelector('.video-id').innerText.slice(4);
	if  (format == 'mp4') {
		window.open(redirect+videoId);
	} else if  (format == 'mp3') {
		window.open(redirectmp3+videoId);
	} else if  (format == 'watch') {
		Exit.parentNode.style.display = 'block';
		video.childNodes[1].src = redirectWatch + videoId;
		video.poster = thumbnail + videoId;
		video.load();
	}
}
