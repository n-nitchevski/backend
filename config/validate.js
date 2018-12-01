/* eslint-disable no-useless-escape */

export function validateEmail(email) {
    // ^([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})$
    // const patternEmail = new RegExp('^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$', 'im');
    const patternEmail = new RegExp('^([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})$');
    return patternEmail.test(email);
}

export function validatePhone(phone) {
    const patternPhone = new RegExp('^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$', 'im');
    return patternPhone.test(phone);
}

export function validateImages(files) {
    const arr = Array.isArray(files) ? files : [files];
    return arr.every(file => file.mimetype && file.mimetype.indexOf('image') !== -1);
}
