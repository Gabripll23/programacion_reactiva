import { fromEvent } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';

const emailInput = document.getElementById('email');

const email$ = fromEvent(emailInput, 'input').pipe(
    map(event => event.target.value)
);

const validateEmail = email => {
    const API_URL = `https://api.example.com/validate-email?email=${email}`;
    return ajax.getJSON(API_URL);
};

const emailValidator$ = email$.pipe(
    debounceTime(500),
    distinctUntilChanged(),
    switchMap(validateEmail)
);

emailValidator$.subscribe(
    response => {
        if (response.valid) {
            emailInput.classList.remove('is-invalid');
            emailInput.classList.add('is-valid');
        } else {
            emailInput.classList.remove('is-valid');
            emailInput.classList.add('is-invalid');
        }
    },
    error => console.error(error)
);