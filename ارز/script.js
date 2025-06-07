document.addEventListener('DOMContentLoaded', () => {
    const cryptoPricesContainer = document.getElementById('crypto-prices');
    const threeDContainer = document.getElementById('three-d-container');

    // --- Code for fetching and updating crypto prices (keep the previous code) ---

    // Function to fetch cryptocurrency data
    async function fetchCryptoPrices() {
        try {
            const coinIds = 'bitcoin,ethereum,ripple,cardano,dogecoin'; // Add/remove coin IDs here
            const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}&price_change_percentage=24h`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Fetched data:', data);

            updateCryptoPrices(data);
            addClickListeners(); // Add this line to make items clickable

        } catch (error) {
            console.error('Error fetching crypto prices:', error);
            if (cryptoPricesContainer) {
                 cryptoPricesContainer.innerHTML = '<p style="color: red; text-align: center;">خطا در دریافت اطلاعات قیمت. لطفا بعدا دوباره تلاش کنید.</p>';
            }
        }
    }

    // Function to update the HTML elements with data
    function updateCryptoPrices(data) {
        data.forEach(coin => {
            const cryptoItem = document.querySelector(`.crypto-item[data-coin-id="${coin.id}"]`);

            if (cryptoItem) {
                const logoElement = cryptoItem.querySelector('.coin-logo');
                const priceElement = cryptoItem.querySelector('.current-price');
                const changeElement = cryptoItem.querySelector('.price-change');
                const nameElement = cryptoItem.querySelector('.coin-name');

                if (logoElement && coin.image) {
                    logoElement.src = coin.image;
                    logoElement.alt = `${coin.name} Logo`;
                }

                if (priceElement && coin.current_price !== undefined) {
                    priceElement.textContent = `قیمت: ${coin.current_price.toFixed(2)} USD`;
                } else if (priceElement) {
                     priceElement.textContent = `قیمت: اطلاعات در دسترس نیست`;
                }

                if (changeElement && coin.price_change_percentage_24h !== undefined) {
                    const change = coin.price_change_percentage_24h.toFixed(2);
                    changeElement.textContent = `تغییر 24 ساعت: ${change}%`;

                    changeElement.classList.remove('positive', 'negative');
                    if (parseFloat(change) > 0) {
                        changeElement.classList.add('positive');
                    } else if (parseFloat(change) < 0) {
                        changeElement.classList.add('negative');
                    }
                } else if (changeElement) {
                    changeElement.textContent = `تغییر 24 ساعت: اطلاعات در دسترس نیست`;
                    changeElement.classList.remove('positive', 'negative');
                }
            }
        });
    }

    // Function to add click listeners to crypto items
    function addClickListeners() {
        const cryptoItems = document.querySelectorAll('.crypto-item');
        cryptoItems.forEach(item => {
            item.addEventListener('click', () => {
                const coinId = item.getAttribute('data-coin-id');
                const coinSymbol = item.getAttribute('data-coin-symbol'); // Get the symbol
                if (coinId && coinSymbol) {
                    // Redirect to chart.html with coin ID and symbol in URL parameters
                    window.location.href = `chart.html?coinId=${coinId}&coinSymbol=${coinSymbol}`;
                }
            });
        });
    }


    // Fetch prices when the page loads
    fetchCryptoPrices();

    // Optional: Fetch prices periodically (e.g., every 60 seconds)
    // setInterval(fetchCryptoPrices, 60000);


    // --- Code for 3D effects using Three.js (Loading Dollar Model) ---

    let scene, camera, renderer, dollarModel; // Added dollarModel variable

    function init3D() {
        // Create a scene
        scene = new THREE.Scene();
        scene.background = null; // Make background transparent to see CSS background

        // Create a camera (PerspectiveCamera)
        camera = new THREE.PerspectiveCamera(75, threeDContainer.clientWidth / threeDContainer.clientHeight, 0.1, 1000);
        camera.position.z = 5; // Move camera back

        // Create a renderer
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // alpha: true for transparency
        renderer.setSize(threeDContainer.clientWidth, threeDContainer.clientHeight);
        threeDContainer.appendChild(renderer.domElement); // Add the renderer's canvas to the container

        // Add some lighting (important for materials that react to light)
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // Directional light
        directionalLight.position.set(0, 1, 1).normalize();
        scene.add(directionalLight);


        // Load the 3D dollar model
        const loader = new THREE.GLTFLoader();

        // !!! IMPORTANT: Replace 'path/to/your/dollar_model.gltf' with the actual path to your model file !!!
        loader.load(
            'path/to/your/dollar_model.gltf', // Path to your .gltf file
            function (gltf) {
                dollarModel = gltf.scene;
                // Optional: Adjust position, rotation, or scale of the model
                // dollarModel.position.set(0, 0, 0);
                // dollarModel.scale.set(1, 1, 1);
                scene.add(dollarModel);
                console.log('Dollar model loaded successfully!');
            },
            // Optional: called while loading is progressing
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            // Called when loading has errors
            function (error) {
                console.error('An error happened while loading the dollar model:', error);
                // Display an error message in the 3D container if loading fails
                 if (threeDContainer) {
                     threeDContainer.innerHTML = '<p style="color: red; text-align: center;">خطا در بارگذاری مدل سه‌بعدی دلار.</p>';
                 }
            }
        );


        // Handle window resizing
        window.addEventListener('resize', onWindowResize, false);

        // Start the animation loop
        animate();
    }

    function onWindowResize() {
        camera.aspect = threeDContainer.clientWidth / threeDContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(threeDContainer.clientWidth, threeDContainer.clientHeight);
    }

    function animate() {
        requestAnimationFrame(animate); // Create a loop

        // Optional: Animate the dollar model (e.g., rotate it)
        if (dollarModel) {
             dollarModel.rotation.y += 0.005; // Example rotation
        }


        renderer.render(scene, camera); // Render the scene
    }

    // Initialize the 3D scene after the DOM is loaded
    init3D();

});
