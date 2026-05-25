document.addEventListener('DOMContentLoaded', () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const formContents = document.querySelectorAll('.form-content');
    const globalMessage = document.getElementById('global-message');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            globalMessage.classList.add('hidden');

            tabBtns.forEach(b => b.classList.remove('active'));
            formContents.forEach(f => {
                f.classList.add('hidden');
                f.classList.remove('active');
            });

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            const targetForm = document.getElementById(targetId);
            targetForm.classList.remove('hidden');
            targetForm.classList.add('active');
        });
    });

    const toggleBtns = document.querySelectorAll('.toggle-password');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
            } else {
                input.type = 'password';
            }
        });
    });

    const countrySelect = document.getElementById('country');
    const citySelect = document.getElementById('city');

    const citiesData = {
        ukraine: ['Київ', 'Чернівці', 'Львів', 'Одеса'],
        usa: ['New York', 'Los Angeles', 'Chicago']
    };

    if (countrySelect && citySelect) {
        countrySelect.addEventListener('change', function() {
            const country = this.value;
            citySelect.innerHTML = '<option value="">Choose...</option>';

            if (country && citiesData[country]) {
                citySelect.disabled = false;
                citiesData[country].forEach(city => {
                    const option = document.createElement('option');
                    option.value = city.toLowerCase();
                    option.textContent = city;
                    citySelect.appendChild(option);
                });
            } else {
                citySelect.disabled = true;
                citySelect.innerHTML = '<option value="">Choose country first...</option>';
            }
        });
    }

    const setError = (element, message) => {
        const formGroup = element.closest('.form-group');
        const errorDisplay = formGroup.querySelector('.error-text');
        errorDisplay.innerText = message;
        errorDisplay.style.color = 'red';
        element.style.borderColor = 'red';
    };

    const setSuccess = (element) => {
        const formGroup = element.closest('.form-group');
        const errorDisplay = formGroup.querySelector('.error-text');
        errorDisplay.innerText = 'Okay!';
        errorDisplay.style.color = 'green';
        element.style.borderColor = 'green';
    };

    const resetValidationStyles = (form) => {
        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.style.borderColor = '';
            const errText = input.closest('.form-group')?.querySelector('.error-text');
            if (errText) errText.innerText = '';
        });
    };

    const signupForm = document.getElementById('signup');

    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;

            const firstName = document.getElementById('firstName');
            if (firstName.value.trim().length < 3 || firstName.value.trim().length > 15) {
                setError(firstName, 'First name must be 3-15 characters.');
                isValid = false;
            } else {
                setSuccess(firstName);
            }

            const lastName = document.getElementById('lastName');
            if (lastName.value.trim().length < 3 || lastName.value.trim().length > 15) {
                setError(lastName, 'Last name must be 3-15 characters.');
                isValid = false;
            } else {
                setSuccess(lastName);
            }

            const email = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value.trim())) {
                setError(email, 'Please provide a valid email.');
                isValid = false;
            } else {
                setSuccess(email);
            }

            const password = document.getElementById('signup-password');
            if (password.value.length < 6) {
                setError(password, 'Password must be at least 6 characters.');
                isValid = false;
            } else {
                setSuccess(password);
            }

            const confirmPassword = document.getElementById('confirm-password');
            if (confirmPassword.value === '' || confirmPassword.value !== password.value) {
                setError(confirmPassword, 'Passwords do not match.');
                isValid = false;
            } else {
                setSuccess(confirmPassword);
            }

            const phone = document.getElementById('phone');
            const phoneRegex = /^\+380\d{9}$/;
            if (!phoneRegex.test(phone.value.trim())) {
                setError(phone, 'Format must be +380XXXXXXXXX');
                isValid = false;
            } else {
                setSuccess(phone);
            }

            const birthDate = document.getElementById('birthDate');
            if (!birthDate.value) {
                setError(birthDate, 'Please enter your date of birth.');
                isValid = false;
            } else {
                const birth = new Date(birthDate.value);
                const today = new Date();

                let age = today.getFullYear() - birth.getFullYear();
                const m = today.getMonth() - birth.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
                    age--;
                }

                if (birth > today) {
                    setError(birthDate, 'Date cannot be in the future.');
                    isValid = false;
                } else if (age < 12) {
                    setError(birthDate, 'You must be at least 12 years old.');
                    isValid = false;
                } else {
                    setSuccess(birthDate);
                }
            }

            const sexChecked = document.querySelector('input[name="sex"]:checked');
            const sexGroup = document.querySelector('.radio-group');
            const sexErrorDisplay = sexGroup.nextElementSibling;
            if (!sexChecked) {
                sexErrorDisplay.innerText = 'Please select your sex.';
                sexErrorDisplay.style.color = 'red';
                isValid = false;
            } else {
                sexErrorDisplay.innerText = 'Looks good!';
                sexErrorDisplay.style.color = 'green';
            }

            if (countrySelect.value === '') {
                setError(countrySelect, 'Please select a country.');
                isValid = false;
            } else {
                setSuccess(countrySelect);
            }

            if (citySelect.value === '' || citySelect.disabled) {
                setError(citySelect, 'Please select a city.');
                isValid = false;
            } else {
                setSuccess(citySelect);
            }

            if (isValid) {
                const formData = new FormData(this);

                globalMessage.innerText = 'Success! You have been registered.';
                globalMessage.style.color = 'green';
                globalMessage.classList.remove('hidden');

                this.reset();
                resetValidationStyles(this);

                citySelect.disabled = true;
                citySelect.innerHTML = '<option value="">Choose country first...</option>';
                sexErrorDisplay.innerText = '';
            }
        });
    }

    const loginForm = document.getElementById('login');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;

            const username = document.getElementById('login-username');
            if (username.value.trim() === '') {
                setError(username, 'Please choose a username.');
                isValid = false;
            } else {
                setSuccess(username);
            }

            const password = document.getElementById('login-password');
            if (password.value.length < 6) {
                setError(password, 'Password must be at least 6 characters.');
                isValid = false;
            } else {
                setSuccess(password);
            }

            if (isValid) {
                const formData = new FormData(this);

                globalMessage.innerText = 'Success! You are logged in.';
                globalMessage.style.color = 'green';
                globalMessage.classList.remove('hidden');

                this.reset();
                resetValidationStyles(this);
            }
        });
    }
});