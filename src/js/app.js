import validateCoordinates from "./validateCoordinates";

document.addEventListener('DOMContentLoaded', () => {
	const postInput = document.getElementById('post-input');
	const addPostBtn = document.getElementById('add-post-btn');
	const postsContainer = document.getElementById('posts');
	const manualCoordinatesModal = document.getElementById('manual-coordinates-modal');
	const closeModalBtn = document.getElementById('close-modal');
	const submitCoordinatesBtn = document.getElementById('submit-coordinates');
	const manualInput = document.getElementById('manual-inp');
	const startRecordBtn = document.getElementById('start-record-btn');
	const startVideoBtn = document.getElementById('start-video-btn');
	const timerElement = document.getElementById('timer');
	const stopRecordBtn = document.getElementById('stop-record-btn');
	const cancelRecordBtn = document.getElementById('cancel-record-btn');
	const videoPreviewModal = document.getElementById('video-preview-container');
	const videoPreview = document.getElementById('video-preview');
	let recording = false;
	let mediaRecorder;
	let mediaChunks = [];
	let timerInterval;

	startRecordBtn.addEventListener('click', async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			mediaRecorder = new MediaRecorder(stream);
			const coordinates = await getUserCoordinates();
	
			mediaRecorder.ondataavailable = event => {
				if (event.data.size > 0) {
					mediaChunks.push(event.data);
			}};
	
			mediaRecorder.onstop = () => {
				const audioBlob = new Blob(mediaChunks, { type: 'audio/wav' });
				const audioUrl = URL.createObjectURL(audioBlob);
	
			clearInterval(timerInterval);
			timerElement.style.display = 'none';
			stopRecordBtn.style.display = 'none';
			cancelRecordBtn.style.display = 'none';
			startRecordBtn.style.display = 'block';
			startVideoBtn.style.display = 'block';
	
			const postText = '';
			const postDate = new Date();
			const post = createAudioPostElement(audioUrl, coordinates, postDate);
			postsContainer.insertBefore(post, postsContainer.firstChild);
			mediaChunks = [];
		};
			mediaRecorder.start();
			recording = true;
			startRecordBtn.style.display = 'none';
			startVideoBtn.style.display = 'none';
			stopRecordBtn.style.display = 'block';
			cancelRecordBtn.style.display = 'block';
			timerElement.style.display = 'block';
			let seconds = 0;
	
			timerInterval = setInterval(() => {
				seconds++;
				const minutes = Math.floor(seconds / 60);
				const remainingSeconds = seconds % 60;
				timerElement.textContent = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
			}, 1000);
		} catch (error) {
			if (error.name === 'NotAllowedError') {
				alert('Please grant permission to use your microphone.');
			} else {
				alert('An error occurred while starting audio recording.');
			}
		}
	});
	
	stopRecordBtn.addEventListener('click', () => {
		if (recording) {
			mediaRecorder.stop();
			recording = false;
		}
	});
	
	cancelRecordBtn.addEventListener('click', () => {
		if (recording) {
			clearInterval(timerInterval);
			timerElement.style.display = 'none';
			stopRecordBtn.style.display = 'none';
			cancelRecordBtn.style.display = 'none';
			startRecordBtn.style.display = 'block';
			mediaChunks = [];
			recording = false;
			if (mediaRecorder) {
				mediaRecorder.stop();
		}
		}
	});

	startVideoBtn.addEventListener('click', async () => { 
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ video: true });
			mediaRecorder = new MediaRecorder(stream);
			const coordinates = await getUserCoordinates();

			videoPreview.srcObject = stream;
			
			mediaRecorder.ondataavailable = event => {
				if (event.data.size > 0) {
					mediaChunks.push(event.data);
		}};
			mediaRecorder.onstop = () => {
				const videoBlob = new Blob(mediaChunks, { type: 'video/webm' });
				const videoUrl = URL.createObjectURL(videoBlob);
	
			clearInterval(timerInterval);
			timerElement.style.display = 'none';
			stopRecordBtn.style.display = 'none';
			cancelRecordBtn.style.display = 'none';
			startVideoBtn.style.display = 'block';
			startRecordBtn.style.display = 'block';
			videoPreviewModal.style.display = 'none';
	
			const postDate = new Date();
			const post = createVideoPostElement(videoUrl, coordinates, postDate);
			postsContainer.insertBefore(post, postsContainer.firstChild);
			mediaChunks = [];
		};
	
			mediaRecorder.start();
			recording = true;
			startVideoBtn.style.display = 'none';
			startRecordBtn.style.display = 'none'
			stopRecordBtn.style.display = 'block';
			cancelRecordBtn.style.display = 'block';
			timerElement.style.display = 'block';
			videoPreviewModal.style.display = 'block'
			let seconds = 0;
	
			timerInterval = setInterval(() => {
				seconds++;
				const minutes = Math.floor(seconds / 60);
				const remainingSeconds = seconds % 60;
				timerElement.textContent = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
			}, 1000);
		} catch (error) {
			if (error.name === 'NotAllowedError') {
				alert('Please grant permission to use your camera.');
		} else {
			alert('An error occurred while starting video recording.');
		}
		}
	});
	
	addPostBtn.addEventListener('click', async () => {
		const postText = postInput.value.trim();
		if (postText !== '') {
			try {
			const coordinates = await getUserCoordinates();
			const postDate = new Date();
			const post = createPostElement(postText, coordinates, postDate);
			postsContainer.insertBefore(post, postsContainer.firstChild);
			postInput.value = '';
			} catch (error) {
			alert('Error: ' + error.message);
			manualCoordinatesModal.style.display = 'block';
		}
		}
	});
  
	closeModalBtn.addEventListener('click', () => {
		manualCoordinatesModal.style.display = 'none';
	});
  
	submitCoordinatesBtn.addEventListener('click', () => {
		const coordinatesInput = manualInput.value.trim();
		console.log(manualInput.value)
		try {
			const coordinates = validateCoordinates(coordinatesInput);
			const postText = postInput.value.trim();
			const postDate = new Date();
			const post = createPostElement(postText, coordinates, postDate);
			postsContainer.insertBefore(post, postsContainer.firstChild);
			postInput.value = '';
			manualCoordinatesModal.style.display = 'none';
			manualInput.value = '';
		} catch (error) {
			alert('Please enter valid coordinates.');
		}
	});
  
	async function getUserCoordinates() {
		return new Promise((resolve, reject) => {
			navigator.geolocation.getCurrentPosition(
			positionAvailable => {
			const latitude = positionAvailable.coords.latitude;
			const longitude = positionAvailable.coords.longitude;
			if (positionAvailable) {
				manualCoordinatesModal.style.display = 'none';
			} else {
				manualCoordinatesModal.style.display = 'block';
			}
			resolve({ latitude, longitude });
		},
		error => {
			manualCoordinatesModal.style.display = 'block';
		}
		);
	});
	}
  
	function createPostElement(text, coordinates, date) {
		const postElement = document.createElement('div');
		postElement.className = 'post';
		postElement.innerHTML = `
			<p>${text}</p>
			<p class='coordinates'>[${coordinates.latitude}, ${coordinates.longitude}]</p>
			<p class='date'>${date.toLocaleString()}</p>
	  	`;
		return postElement;
	}

	function createAudioPostElement(audioUrl, coordinates, date) {
		const postElement = document.createElement('div');
		postElement.className = 'post audio-post';
		postElement.innerHTML = `
		  <audio controls>
			<source src="${audioUrl}" type="audio/wav">
		  </audio>
		  <p class='coordinates'>[${coordinates.latitude}, ${coordinates.longitude}]</p>
		  <p class='date'>${date.toLocaleString()}</p>
		`;
		return postElement;
	}

	function createVideoPostElement(videoUrl, coordinates, date) {
		const postElement = document.createElement('div');
		postElement.className = 'post video-post'; 
		postElement.innerHTML = `
		  <video controls muted>
			<source src="${videoUrl}" type="video/webm">
		  </video>
		  <p class='coordinates'>[${coordinates.latitude}, ${coordinates.longitude}]</p>
		  <p class='date'>${date.toLocaleString()}</p>
		`;
		return postElement;
	}
});
  