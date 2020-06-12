export function disableBtn(vueBtnObj) {
    vueBtnObj.$el.setAttribute('disabled', 'disabled');
}

export function enableBtn(vueBtnObj) {
    vueBtnObj.$el.removeAttribute('disabled');
}
