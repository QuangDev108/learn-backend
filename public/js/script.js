//Show Alert
const showAlert = document.querySelector("[show-alert]");


if(showAlert) {
    const closeAlert = showAlert.querySelector("[close-alert]");
    const time = showAlert.getAttribute("data-time");
    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, time);

    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    });
}
//End Show Alert