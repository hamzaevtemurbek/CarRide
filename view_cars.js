function rentCar(carName, price, imagePath) {
    if (!getCurrentUser()) {
        alert("Please login first to rent a car!");
        window.location.href = "login.html";
        return;
    }

    const carData = {
        name: carName,
        price: price,
        image: imagePath
    };

    localStorage.setItem('selectedCar', JSON.stringify(carData));

    window.location.href = 'rent_cars.html';
}

function searchCars() {
    const searchTerm = document.getElementById('inputcar').value.toLowerCase();
    const carDivs = document.querySelectorAll('#cars');

    let found = false;

    for (let i = 0; i < carDivs.length; i++) {
        const carDiv = carDivs[i];
        const carName = carDiv.querySelector('h1').textContent.toLowerCase();

        if (carName.includes(searchTerm)) {
            window.location.hash = searchTerm;
            found = true;
            break;
        }
    }

    if (!found) {
        alert("No such brand!");
    }
}
