
export function sayHi(name) {
    alert(` hello ${name}   !`);
}





function getElementHeight(id) {
    const elm = document.querySelector(`#${id}`);
    return elm.offsetHeight;
}