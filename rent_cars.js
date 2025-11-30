document.addEventListener('DOMContentLoaded', function () {
    const carData = JSON.parse(localStorage.getItem('selectedCar'));

    if (carData) {
        updateCarPreview(carData);
        setupEventListeners(carData);
        setupFormSubmission(carData);
    } else {
        document.getElementById('selected-car').textContent = 'Please select a car first';
        document.querySelector('.price').textContent = 'Go to View Cars page to select a car';
    }
});

function updateCarPreview(carData) {
    document.getElementById('selected-car').textContent = carData.name;
    document.querySelector('.price').textContent = `$${carData.price}/day`;

    const carImage = document.querySelector('.car-preview img');
    if (carData.image) {
        carImage.src = carData.image;
        carImage.alt = carData.name;
    }
}

function setupEventListeners(carData) {
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');

    function calculateTotalPrice() {
        if (startDateInput.value && endDateInput.value) {
            const startDate = new Date(startDateInput.value);
            const endDate = new Date(endDateInput.value);
            const timeDiff = endDate.getTime() - startDate.getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

            if (daysDiff > 0) {
                const totalPrice = daysDiff * carData.price;
                document.querySelector('.price').textContent =
                    `$${carData.price}/day | Total: $${totalPrice} for ${daysDiff} days`;
            } else if (daysDiff < 0) {
                document.querySelector('.price').innerHTML = `$${carData.price}/day <br>
                        <span style="color: red;">Invalid date range!</span>`;
            }
        }
    }
    startDateInput.addEventListener('change', calculateTotalPrice);  // when date is changed,
    endDateInput.addEventListener('change', calculateTotalPrice); //these two lines are responsible to change the price

    const today = new Date().toISOString().split('T')[0];
    startDateInput.min = today;
    endDateInput.min = today;

}

function setupFormSubmission(carData) {      //  Responsibile for running whole code
    const rentForm = document.getElementById('rentalForm'); //when confrim button tapped

    rentForm.addEventListener('submit', function (e) {  // button tapped
        e.preventDefault();

        if (validateForm()) {
            showRentalConfirmation(carData);
        }
    });
}

function validateForm() {
    const inputs = document.querySelectorAll('input[required],select[required]');

    let isvalid = true;
    inputs.forEach(function (input) {
        if (!input.value) {
            isvalid = false;
            input.style.borderColor = 'red';
        } else {
            input.style.borderColor = 'green';
        }
    });

    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);

    if (startDate && endDate && endDate <= startDate) {
        alert('End date must be after start date!');
        isvalid = false;
    }
    if (!isvalid) {
        alert('Please fill in all required fields correctly!');
    }

    return isvalid;
}

function showRentalConfirmation(carData) {
    const fullName = document.querySelector('input[placeholder="Full Name"]').value;
    const startDate = document.getElementById('startDate').value; 
    const endDate = document.getElementById('endDate').value; 

    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysDiff = Math.ceil((end - start) / (1000 * 3600 * 24));
    const totalPrice = daysDiff * carData.price;

    const confirmationMessage = `Confirm Rental Details:
                                Car: ${carData.name}
                                customer: ${fullName}
                                Rental Period: ${startDate} to ${endDate}
                                Total Days: ${daysDiff}
                                Total Price: $${totalPrice}
                                
                                Do you want to proceed with this rental?`;

    if (confirm(confirmationMessage)) {
        saveRentalInformation(carData);
    } else {
        alert('Rental cancelled.You can modify your details.');
    }
}

function saveRentalInformation(carData) {
    const fullName = document.querySelector('input[placeholder="Full Name"]').value;
    const phone = document.querySelector('input[placeholder="Phone Number"]').value;
    const email = document.querySelector('input[placeholder="Email Address"]').value;
    const idNumber = document.querySelector('input[placeholder="Passport / ID Number"]').value;
    const pickUp = document.querySelector('input[placeholder="Pick-up Location"]').value;
    const dropOff = document.querySelector('input[placeholder="Drop-off Location"]').value;
    const startDate = document.getElementById('startDate').value; 
    const endDate = document.getElementById('endDate').value; 
    const gearType = document.querySelector('select').value;
    const fuelType = document.querySelectorAll('select')[1].value;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysDiff = Math.ceil((end - start) / (1000 * 3600 * 24));
    const totalPrice = daysDiff * carData.price;

    const rentalId = Math.floor(100000 + Math.random() * 900000);

    const rentalInfo = {
        rentalId: rentalId,
        car: carData.name,
        carPrice: carData.price,
        carImage: carData.image,

        customer: {
            fullName: fullName,
            phone: phone,
            email: email,
            idNumber: idNumber
        },

        rentalDetails: {
            pickUpLocation: pickUp,
            dropOffLocation: dropOff,
            startDate: startDate,
            endDate: endDate,
            gearType: gearType,
            fuelType: fuelType,
            totalDays: daysDiff,
            totalCost: totalPrice
        },

        status: 'active',
        rentalDate: new Date().toISOString()
    };

    const existingRentals = JSON.parse(localStorage.getItem('carRentals')) || [];
    existingRentals.push(rentalInfo);
    localStorage.setItem('carRentals', JSON.stringify(existingRentals));

    const successmessage = `Rental Confirmed!
                        Thank you for your rental!
                        Rental details:
                        Car: ${carData.name}
                        Rental ID: ${rentalId}
                        Period: ${daysDiff} days
                        Total Amount: $${totalPrice}
 
                        Save your Rental ID: ${rentalId}
                        You will need this to return the car!`;

    alert(successmessage);
    localStorage.removeItem('selectedCar');
    window.location.href = 'finalproject.html';
}