import validateCoordinates from "./validateCoordinates";

document.addEventListener('DOMContentLoaded', () => {
	const postInput = document.getElementById('post-input');
	const addPostBtn = document.getElementById('add-post-btn');
	const postsContainer = document.getElementById('posts');
	const manualCoordinatesModal = document.getElementById('manual-coordinates-modal');
	const closeModalBtn = document.getElementById('close-modal');
	const submitCoordinatesBtn = document.getElementById('submit-coordinates');
	const manualInput = document.getElementById('manual-inp');

	
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
		const coordinatesArray = coordinatesInput.split(/[\s,]+/);
		
		if (coordinatesArray.length !== 2) {
			alert('Please enter valid coordinates.');
			return;
		}

		const manualLat = parseFloat(coordinatesArray[0]);
		const manualLng = parseFloat(coordinatesArray[1]);

		try {
			validateCoordinates(coordinatesInput);
			const coordinates = { latitude: manualLat, longitude: manualLng };
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
		return new Promise((resolve) => {
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
			}, error => {
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
  });
  